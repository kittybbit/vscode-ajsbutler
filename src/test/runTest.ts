import * as assert from "assert";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import {
  _electron,
  type ElectronApplication,
  type Frame,
  type Page,
} from "playwright";
import { downloadAndUnzipVSCode, runTests } from "@vscode/test-electron";
import { en } from "../resource/i18n/message_en";
import {
  waitForEnabled,
  waitForWebviewFrame,
} from "./support/flowImageWorkbench";

export interface DesktopTestTarget {
  version: "stable" | "1.75.0";
  extensionTestsPath: string;
}

type SmokeSignal = Readonly<{
  status: "passed" | "failed";
  message?: string;
}>;

export function selectDesktopTestTarget(
  args: readonly string[],
): DesktopTestTarget {
  if (args.length === 0) {
    return {
      version: "stable",
      extensionTestsPath: path.resolve(__dirname, "suite/desktopTestEntry"),
    };
  }
  if (args.length === 1 && args[0] === "--minimum") {
    return {
      version: "1.75.0",
      extensionTestsPath: path.resolve(__dirname, "suite/webSmoke.bundle.js"),
    };
  }
  throw new Error(`Unsupported Desktop test arguments: ${args.join(" ")}`);
}

async function main(): Promise<void> {
  try {
    const target = selectDesktopTestTarget(process.argv.slice(2));
    console.log(
      `[desktop-test] launching VS Code ${target.version}: ${target.extensionTestsPath}`,
    );
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");
    await runTests({ ...target, extensionDevelopmentPath });
    await runDesktopClipboardSmoke(target, extensionDevelopmentPath);
    console.log("[desktop-test] host completed successfully");
  } catch (error) {
    console.error("[desktop-test] launch or test execution failed", error);
    process.exitCode = 1;
  }
}

const wait = async (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const waitForFile = async (
  filePath: string,
  purpose: string,
  timeoutMilliseconds = 60_000,
): Promise<void> => {
  const deadline = Date.now() + timeoutMilliseconds;
  while (Date.now() < deadline) {
    try {
      await fs.access(filePath);
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await wait(100);
    }
  }
  throw new Error(`Timed out waiting for ${purpose}.`);
};

const readSmokeSignal = async (
  filePath: string,
  purpose: string,
): Promise<SmokeSignal> => {
  await waitForFile(filePath, purpose);
  return JSON.parse(await fs.readFile(filePath, "utf8")) as SmokeSignal;
};

const writeSmokeResult = async (
  signalPath: string,
  result: SmokeSignal,
): Promise<void> => {
  const destination = `${signalPath}.done`;
  const temporaryPath = `${destination}.${process.pid}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(result), "utf8");
  await fs.rename(temporaryPath, destination);
};

const runDesktopClipboardSmoke = async (
  target: DesktopTestTarget,
  extensionDevelopmentPath: string,
): Promise<void> => {
  const profile = await fs.mkdtemp(
    path.join(os.tmpdir(), "ajs-flow-desktop-smoke-"),
  );
  const signalPath = path.join(profile, "smoke");
  let application: ElectronApplication | undefined;
  try {
    application = await _electron.launch({
      executablePath: await downloadAndUnzipVSCode({ version: target.version }),
      args: createSmokeLaunchArgs(profile, extensionDevelopmentPath),
      env: {
        ...(process.env as Record<string, string>),
        FLOW_IMAGE_SMOKE_ONLY: "true",
        FLOW_IMAGE_SMOKE_SIGNAL_PATH: signalPath,
      },
      timeout: 60_000,
    });
    const page = await application.firstWindow({ timeout: 45_000 });
    await page.locator(".monaco-workbench").waitFor({
      state: "attached",
      timeout: 30_000,
    });
    await waitForFile(`${signalPath}.ready`, "Flow fixture setup");
    await exerciseFlowClipboard(page, application);
    await writeSmokeResult(signalPath, { status: "passed" });
    const completion = await readSmokeSignal(
      `${signalPath}.finished`,
      "Flow source preservation check",
    );
    assert.strictEqual(completion.status, "passed", completion.message);
    console.log(
      `[desktop-test] VS Code ${target.version} Flow clipboard and source guard passed`,
    );
  } catch (error) {
    await writeSmokeResult(signalPath, {
      status: "failed",
      message: String(error),
    }).catch(() => undefined);
    throw error;
  } finally {
    await application?.close();
    await fs.rm(profile, { recursive: true, force: true });
  }
};

const createSmokeLaunchArgs = (
  profile: string,
  extensionDevelopmentPath: string,
): string[] => [
  "--no-sandbox",
  "--disable-gpu-sandbox",
  "--disable-updates",
  "--skip-welcome",
  "--skip-release-notes",
  "--no-cached-data",
  "--disable-workspace-trust",
  "--disable-gpu",
  `--user-data-dir=${path.join(profile, "user")}`,
  `--extensions-dir=${path.join(profile, "extensions")}`,
  `--extensionTestsPath=${path.resolve(__dirname, "support/flowImageDesktopSmoke")}`,
  `--extensionDevelopmentPath=${extensionDevelopmentPath}`,
  "--locale=en",
];

const exerciseFlowClipboard = async (
  page: Page,
  application: ElectronApplication,
): Promise<void> => {
  await page
    .getByRole("button", {
      name: "Open JP1/AJS flow viewer",
      exact: true,
    })
    .click({ timeout: 15_000 });
  const frame = await waitForWebviewFrame(page, [
    en["a11y.flow.controls.copyMenu"],
  ]);
  const expandButton = frame.getByRole("button", {
    name: en["a11y.flow.controls.expandAll"],
    exact: true,
  });
  await waitForEnabled(expandButton, "Expand All");
  await expandButton.click();
  await frame
    .getByRole("group", { name: "offscreen-job", exact: true })
    .waitFor({ state: "attached", timeout: 10_000 });

  const copyMenuLabel = en["a11y.flow.controls.copyMenu"];
  const saveMenuLabel = en["a11y.flow.controls.saveMenu"];
  await selectFlowMenuItemWithKeyboard(
    frame,
    copyMenuLabel,
    en["a11y.flow.controls.copySvg"],
    en["a11y.flow.controls.copySvg"],
  );
  await frame
    .getByText(en["flow.svg.copy.success"], { exact: true })
    .waitFor({ state: "visible", timeout: 10_000 });
  const copiedSvg = await frame.evaluate(() => navigator.clipboard.readText());
  const nativeClipboardSvg = await application.evaluate(({ clipboard }) =>
    clipboard.readText(),
  );
  assert.strictEqual(copiedSvg, nativeClipboardSvg);
  assert.ok(copiedSvg.startsWith("<svg "));
  assert.ok(copiedSvg.includes("日本語-net"));
  assert.ok(copiedSvg.includes("offscreen-job"));
  await assertFlowSvgDocument(frame, copiedSvg);

  await selectFlowMenuItemWithKeyboard(
    frame,
    copyMenuLabel,
    en["a11y.flow.controls.copyPng"],
    en["a11y.flow.controls.copySvg"],
  );
  await frame
    .getByText(en["flow.png.copy.success"], { exact: true })
    .waitFor({ state: "visible", timeout: 10_000 });
  const copiedClipboardItem = await frame.evaluate(async () => {
    const items = await navigator.clipboard.read();
    if (items.length !== 1) throw new Error("Expected one clipboard image.");
    if (items[0].types.length !== 1 || items[0].types[0] !== "image/png") {
      throw new Error("Expected one image/png clipboard item.");
    }
    const blob = await items[0].getType("image/png");
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return { type: blob.type, base64: btoa(binary) };
  });
  assert.strictEqual(copiedClipboardItem.type, "image/png");
  const copiedPngBase64 = copiedClipboardItem.base64;
  const copiedPngBytes = Buffer.from(copiedPngBase64, "base64");
  const nativePngBytes = Buffer.from(
    await application.evaluate(({ clipboard }) =>
      Array.from(clipboard.readImage().toPNG()),
    ),
  );
  assertPngBytesMatchSvg(copiedPngBytes, copiedSvg);
  assertPngBytesMatchSvg(nativePngBytes, copiedSvg);
  await assertPngMatchesSvg(frame, copiedSvg, copiedPngBase64);
  await assertPngMatchesSvg(
    frame,
    copiedSvg,
    nativePngBytes.toString("base64"),
  );

  await selectFlowMenuItemWithKeyboard(
    frame,
    saveMenuLabel,
    en["a11y.flow.controls.saveSvg"],
    en["a11y.flow.controls.saveSvg"],
  );
  await page
    .getByText(en["flow.svg.save.sourceConflict"], { exact: true })
    .waitFor({ state: "visible", timeout: 10_000 });
  await selectFlowMenuItemWithKeyboard(
    frame,
    saveMenuLabel,
    en["a11y.flow.controls.savePng"],
    en["a11y.flow.controls.saveSvg"],
  );
  await page
    .getByText(en["flow.png.save.sourceConflict"], { exact: true })
    .waitFor({ state: "visible", timeout: 10_000 });
  await selectFlowMenuItemWithKeyboard(
    frame,
    copyMenuLabel,
    en["a11y.flow.controls.copySvg"],
    en["a11y.flow.controls.copySvg"],
  );
  await frame
    .getByText(en["flow.svg.copy.success"], { exact: true })
    .waitFor({ state: "visible", timeout: 10_000 });
  assert.strictEqual(
    await frame.evaluate(() => navigator.clipboard.readText()),
    copiedSvg,
  );
  assert.strictEqual(
    await application.evaluate(({ clipboard }) => clipboard.readText()),
    copiedSvg,
  );
};

const selectFlowMenuItemWithKeyboard = async (
  frame: Frame,
  triggerLabel: string,
  itemLabel: string,
  firstItemLabel: string,
): Promise<void> => {
  const trigger = frame.getByRole("button", {
    name: triggerLabel,
    exact: true,
  });
  await trigger.focus();
  await trigger.press("Enter");
  const firstItem = frame.getByRole("menuitem", {
    name: firstItemLabel,
    exact: true,
  });
  await firstItem.waitFor({ state: "visible", timeout: 10_000 });
  if (itemLabel !== firstItemLabel) {
    await firstItem.press("ArrowDown");
    const activeMenuItem = await frame.evaluate(
      () => document.activeElement?.textContent?.trim() ?? "",
    );
    assert.strictEqual(activeMenuItem, itemLabel);
  }
  await frame
    .getByRole("menuitem", { name: itemLabel, exact: true })
    .press("Enter");
};

const assertPngMatchesSvg = async (
  frame: Frame,
  svg: string,
  pngBase64: string,
): Promise<void> => {
  const comparison = await frame.evaluate(
    async ({ svgContent, encodedPng }) => {
      const binary = atob(encodedPng);
      const bytes = Uint8Array.from(binary, (character) =>
        character.charCodeAt(0),
      );
      const loadImage = (blob: Blob): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const objectUrl = URL.createObjectURL(blob);
          const image = new Image();
          image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(image);
          };
          image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error(`Could not decode ${blob.type} image.`));
          };
          image.src = objectUrl;
        });
      const [svgImage, pngImage] = await Promise.all([
        loadImage(
          new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" }),
        ),
        loadImage(new Blob([bytes], { type: "image/png" })),
      ]);
      const canvas = document.createElement("canvas");
      canvas.width = svgImage.naturalWidth;
      canvas.height = svgImage.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("PNG pixel comparison needs a canvas.");
      context.drawImage(svgImage, 0, 0);
      const expected = context.getImageData(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(pngImage, 0, 0);
      const actual = context.getImageData(0, 0, canvas.width, canvas.height);
      let differentPixels = 0;
      for (let offset = 0; offset < expected.data.length; offset += 4) {
        if (
          Math.abs(expected.data[offset] - actual.data[offset]) > 2 ||
          Math.abs(expected.data[offset + 1] - actual.data[offset + 1]) > 2 ||
          Math.abs(expected.data[offset + 2] - actual.data[offset + 2]) > 2 ||
          expected.data[offset + 3] !== actual.data[offset + 3]
        ) {
          differentPixels += 1;
        }
      }
      return {
        pngSize: [pngImage.naturalWidth, pngImage.naturalHeight],
        svgSize: [svgImage.naturalWidth, svgImage.naturalHeight],
        differentPixels,
      };
    },
    { svgContent: svg, encodedPng: pngBase64 },
  );
  assert.deepStrictEqual(comparison.pngSize, comparison.svgSize);
  assert.strictEqual(
    comparison.differentPixels,
    0,
    "PNG pixels differ from the complete SVG geometry.",
  );
};

const assertPngBytesMatchSvg = (bytes: Buffer, svg: string): void => {
  assert.deepStrictEqual(
    Array.from(bytes.subarray(0, 8)),
    [137, 80, 78, 71, 13, 10, 26, 10],
  );
  assert.strictEqual(bytes.readUInt32BE(8), 13);
  const svgDimensions = svg.match(
    /^<svg\s[^>]*width="(\d+)"[^>]*height="(\d+)"/u,
  );
  assert.ok(svgDimensions);
  assert.strictEqual(bytes.readUInt32BE(16), Number(svgDimensions[1]));
  assert.strictEqual(bytes.readUInt32BE(20), Number(svgDimensions[2]));
  assert.ok(bytes.length <= 32 * 1024 * 1024);
};

const assertFlowSvgDocument = async (
  frame: Awaited<ReturnType<typeof waitForWebviewFrame>>,
  svg: string,
): Promise<void> => {
  const parsed = await frame.evaluate((value) => {
    const document = new DOMParser().parseFromString(value, "image/svg+xml");
    return {
      rootName: document.documentElement.localName,
      hasParseError: document.querySelector("parsererror") !== null,
      width: Number(document.documentElement.getAttribute("width")),
      height: Number(document.documentElement.getAttribute("height")),
      relationCount: document.querySelectorAll("path[marker-end]").length,
    };
  }, svg);
  assert.strictEqual(parsed.rootName, "svg");
  assert.strictEqual(parsed.hasParseError, false);
  assert.ok(Number.isFinite(parsed.width) && parsed.width > 0);
  assert.ok(Number.isFinite(parsed.height) && parsed.height > 0);
  assert.ok(parsed.relationCount > 0);
};

if (require.main === module) {
  void main();
}
