import * as assert from "assert";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { open } from "@vscode/test-web";
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Frame,
} from "playwright";
import { en } from "../../resource/i18n/message_en";
import {
  assertQuickInputHasResults,
  runWorkbenchCommand,
  waitForEnabled,
  waitForQuickInput,
  waitForWebviewFrame,
} from "./flowImageWorkbench";

const fixtureDirectory = path.resolve(
  __dirname,
  "../../../src/test/fixtures/flow-svg-web",
);
const fixtureName = "flow-svg-fixture";

const setLanguageMode = async (
  page: import("playwright").Page,
): Promise<void> => {
  const fixture = page.getByText(fixtureName, { exact: true }).first();
  await fixture.waitFor({ state: "visible", timeout: 10_000 });
  await fixture.dblclick();
  await page.locator(".monaco-editor").waitFor({ state: "visible" });
  await page.locator('.statusbar-item[aria-label="Plain Text"]').click();
  const languagePicker = await waitForQuickInput(page, "language picker");
  await languagePicker.fill("JP1/AJS");
  await assertQuickInputHasResults(page, "JP1/AJS language mode");
  await page.keyboard.press("Enter");
};

const copyButtonLabelCandidates = [en["a11y.flow.controls.copyMenu"]];

const chooseFlowMenuItemWithKeyboard = async (
  frame: Frame,
  trigger: import("playwright").Locator,
  itemName: string,
  firstItemName: string,
): Promise<void> => {
  await trigger.focus();
  await trigger.press("Enter");
  const firstItem = frame.getByRole("menuitem", {
    name: firstItemName,
    exact: true,
  });
  await firstItem.waitFor({ state: "visible", timeout: 10_000 });
  if (itemName !== firstItemName) {
    await firstItem.press("ArrowDown");
    const activeMenuItem = await frame.evaluate(
      () => document.activeElement?.textContent?.trim() ?? "",
    );
    assert.strictEqual(activeMenuItem, itemName);
  }
  await frame
    .getByRole("menuitem", { name: itemName, exact: true })
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

export const runFlowImageWebSmoke = async (
  extensionDevelopmentPath: string,
  testRunnerDataDir: string,
): Promise<void> => {
  const server = await open({
    browserType: "none",
    extensionDevelopmentPath,
    folderPath: fixtureDirectory,
    quality: "stable",
    port: 3211,
    testRunnerDataDir,
    esm: true,
  });
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;

  try {
    browser = await chromium.launch({
      headless: true,
      args: process.platform === "linux" ? ["--no-sandbox"] : [],
    });
    context = await browser.newContext({
      acceptDownloads: true,
      locale: "en-US",
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3211");
    await setLanguageMode(page);
    await runWorkbenchCommand(page, "Open JP1/AJS flow viewer");
    const frame = await waitForWebviewFrame(page, copyButtonLabelCandidates);
    const expandButton = frame.getByRole("button", {
      name: en["a11y.flow.controls.expandAll"],
      exact: true,
    });
    await waitForEnabled(expandButton, "Expand All");
    await expandButton.click();
    await frame
      .getByRole("button", {
        name: en["a11y.flow.controls.collapseAll"],
        exact: true,
      })
      .waitFor({ state: "visible", timeout: 10_000 });
    await frame.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    const messages = en;
    const copyButton = frame.getByRole("button", {
      name: messages["a11y.flow.controls.copyMenu"],
      exact: true,
    });
    const copyStatus = frame.getByText(messages["flow.svg.copy.success"], {
      exact: true,
    });
    const viewport = frame.locator(".react-flow__viewport");
    const viewportBeforeExport = await viewport.getAttribute("style");
    assert.ok(viewportBeforeExport);
    const downloadPromise = page.waitForEvent("download", { timeout: 20_000 });
    const saveButton = frame.getByRole("button", {
      name: messages["a11y.flow.controls.saveMenu"],
      exact: true,
    });
    await chooseFlowMenuItemWithKeyboard(
      frame,
      saveButton,
      messages["a11y.flow.controls.saveSvg"],
      messages["a11y.flow.controls.saveSvg"],
    );
    const download = await downloadPromise;
    assert.strictEqual(
      await viewport.getAttribute("style"),
      viewportBeforeExport,
    );
    assert.strictEqual(download.suggestedFilename(), "ajs-flow.svg");
    const downloadPath = await download.path();
    assert.ok(downloadPath);
    const downloadedSvg = await fs.readFile(downloadPath, "utf8");
    assert.ok(downloadedSvg.startsWith("<svg "));
    assert.ok(downloadedSvg.includes("日本語-net"));
    assert.ok(
      downloadedSvg.includes("offscreen-job"),
      `Expanded SVG omitted offscreen-job: ${downloadedSvg}`,
    );
    const parsed = await page.evaluate((svg) => {
      const document = new DOMParser().parseFromString(svg, "image/svg+xml");
      return {
        rootName: document.documentElement.localName,
        parseError: document.querySelector("parsererror") !== null,
        width: Number(document.documentElement.getAttribute("width")),
        height: Number(document.documentElement.getAttribute("height")),
        relations: document.querySelectorAll("path[marker-end]").length,
      };
    }, downloadedSvg);
    assert.strictEqual(parsed.rootName, "svg");
    assert.strictEqual(parsed.parseError, false);
    assert.ok(Number.isFinite(parsed.width) && parsed.width > 0);
    assert.ok(Number.isFinite(parsed.height) && parsed.height > 0);
    assert.ok(parsed.relations > 0);

    const renderedPage = await context.newPage();
    const externalRequests: string[] = [];
    renderedPage.on("request", (request) => {
      if (!request.url().startsWith("data:"))
        externalRequests.push(request.url());
    });
    await renderedPage.setContent(downloadedSvg);
    const renderedLabels = await renderedPage
      .locator("svg")
      .evaluate((svg) => ({
        width: svg.getAttribute("width"),
        text: svg.textContent ?? "",
      }));
    assert.ok(Number(renderedLabels.width) > 0);
    assert.ok(renderedLabels.text.includes("日本語-net"));
    assert.deepStrictEqual(externalRequests, []);

    const labelBounds = await renderedPage.locator("svg").evaluate((svg) => {
      const expectedLabels = new Set([
        "WWWWWWWWWWWWWWWWWWWW",
        "日本語日本語日本語日本語日本語日本語日本語日本語",
      ]);
      const entries = Array.from(svg.querySelectorAll(":scope > g"))
        .map((group) => {
          const title = group.querySelector(":scope > title")?.textContent;
          const label = group.querySelector<SVGTextElement>(
            ':scope > text[y="53"]',
          );
          const card = group.querySelector<SVGRectElement>(":scope > rect");
          if (!title || !expectedLabels.has(title) || !label || !card) {
            return undefined;
          }
          const bounds = label.getBBox();
          return {
            title,
            text: label.textContent,
            x: bounds.x,
            right: bounds.x + bounds.width,
            width: bounds.width,
            cardWidth: Number(card.getAttribute("width")),
            textLength: label.getAttribute("textLength"),
            lengthAdjust: label.getAttribute("lengthAdjust"),
          };
        })
        .filter((entry) => entry !== undefined);
      return {
        fontFamily: svg.getAttribute("font-family"),
        labels: entries,
      };
    });
    assert.match(
      labelBounds.fontFamily ?? "",
      /Noto Sans CJK JP.*Yu Gothic.*Meiryo/s,
    );
    assert.deepStrictEqual(
      labelBounds.labels.map((entry) => entry.title).sort(),
      [
        "WWWWWWWWWWWWWWWWWWWW",
        "日本語日本語日本語日本語日本語日本語日本語日本語",
      ].sort(),
    );
    for (const label of labelBounds.labels) {
      assert.ok(label.text?.endsWith("…"));
      assert.strictEqual(Number(label.textLength), label.cardWidth - 24);
      assert.strictEqual(label.lengthAdjust, "spacingAndGlyphs");
      assert.ok(label.x >= 0, `${label.title} begins outside its card.`);
      assert.ok(
        label.right <= label.cardWidth,
        `${label.title} overflows its card: ${JSON.stringify(label)}`,
      );
    }

    await chooseFlowMenuItemWithKeyboard(
      frame,
      copyButton,
      messages["a11y.flow.controls.copySvg"],
      messages["a11y.flow.controls.copySvg"],
    );
    await copyStatus.waitFor({ state: "visible", timeout: 10_000 });
    assert.strictEqual(
      await viewport.getAttribute("style"),
      viewportBeforeExport,
    );
    const copiedSvg = await frame.evaluate(async () =>
      navigator.clipboard.readText(),
    );
    assert.strictEqual(copiedSvg, downloadedSvg);
    await chooseFlowMenuItemWithKeyboard(
      frame,
      copyButton,
      messages["a11y.flow.controls.copySvg"],
      messages["a11y.flow.controls.copySvg"],
    );
    await copyStatus.waitFor({ state: "visible", timeout: 10_000 });
    assert.strictEqual(
      await frame.evaluate(async () => navigator.clipboard.readText()),
      copiedSvg,
    );

    const pngDownloadPromise = page.waitForEvent("download", {
      timeout: 20_000,
    });
    await chooseFlowMenuItemWithKeyboard(
      frame,
      saveButton,
      messages["a11y.flow.controls.savePng"],
      messages["a11y.flow.controls.saveSvg"],
    );
    const pngDownload = await pngDownloadPromise;
    assert.strictEqual(pngDownload.suggestedFilename(), "ajs-flow.png");
    const pngDownloadPath = await pngDownload.path();
    assert.ok(pngDownloadPath);
    const downloadedPng = await fs.readFile(pngDownloadPath);
    assert.deepStrictEqual(
      Array.from(downloadedPng.subarray(0, 8)),
      [137, 80, 78, 71, 13, 10, 26, 10],
    );
    const pngWidth = downloadedPng.readUInt32BE(16);
    const pngHeight = downloadedPng.readUInt32BE(20);
    assert.strictEqual(pngWidth, parsed.width);
    assert.strictEqual(pngHeight, parsed.height);
    assert.ok(downloadedPng.length <= 32 * 1024 * 1024);
    await assertPngMatchesSvg(
      frame,
      downloadedSvg,
      downloadedPng.toString("base64"),
    );

    await chooseFlowMenuItemWithKeyboard(
      frame,
      copyButton,
      messages["a11y.flow.controls.copyPng"],
      messages["a11y.flow.controls.copySvg"],
    );
    await frame
      .getByText(messages["flow.png.copy.success"], { exact: true })
      .waitFor({ state: "visible", timeout: 10_000 });
    const copiedPngBase64 = await frame.evaluate(async () => {
      const [item] = await navigator.clipboard.read();
      const blob = await item.getType("image/png");
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = "";
      for (let offset = 0; offset < bytes.length; offset += 0x8000) {
        binary += String.fromCharCode(
          ...bytes.subarray(offset, offset + 0x8000),
        );
      }
      return btoa(binary);
    });
    await assertPngMatchesSvg(frame, downloadedSvg, copiedPngBase64);
  } finally {
    try {
      await context?.close();
    } finally {
      try {
        await browser?.close();
      } finally {
        server.dispose();
      }
    }
  }
};
