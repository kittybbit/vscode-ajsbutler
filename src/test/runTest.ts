import * as assert from "assert";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { _electron, type ElectronApplication, type Page } from "playwright";
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
    en["a11y.flow.controls.copySvg"],
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

  const copyButton = frame.getByRole("button", {
    name: en["a11y.flow.controls.copySvg"],
    exact: true,
  });
  await copyButton.click();
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

  await frame
    .getByRole("button", {
      name: en["a11y.flow.controls.saveSvg"],
      exact: true,
    })
    .click();
  await page
    .getByText(en["flow.svg.save.sourceConflict"], { exact: true })
    .waitFor({ state: "visible", timeout: 10_000 });
  await copyButton.click();
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
