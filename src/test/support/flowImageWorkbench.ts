import type { Browser, Frame, Locator, Page } from "playwright";

const wait = async (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const waitForEnabled = async (
  locator: Locator,
  purpose: string,
  timeoutMilliseconds = 10_000,
): Promise<void> => {
  const deadline = Date.now() + timeoutMilliseconds;
  while (Date.now() < deadline) {
    if ((await locator.isVisible()) && !(await locator.isDisabled())) return;
    await wait(100);
  }
  throw new Error(`Timed out waiting for enabled ${purpose}.`);
};

export const waitForQuickInput = async (
  page: Page,
  purpose: string,
): Promise<ReturnType<Page["locator"]>> => {
  const input = page
    .locator(".quick-input-widget input:not([type='checkbox'])")
    .first();
  try {
    await input.waitFor({ state: "visible", timeout: 10_000 });
    return input;
  } catch (error) {
    const state = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      text: document.body.innerText.slice(0, 600),
      inputs: Array.from(document.querySelectorAll("input")).map((entry) => ({
        placeholder: entry.getAttribute("placeholder"),
        ariaLabel: entry.getAttribute("aria-label"),
        visible: entry.getBoundingClientRect().width > 0,
      })),
      buttons: Array.from(document.querySelectorAll("button,[role=button]"))
        .slice(0, 40)
        .map((entry) => ({
          label: entry.getAttribute("aria-label"),
          title: entry.getAttribute("title"),
          text: entry.textContent?.trim().slice(0, 80),
        })),
      quickInputWidgets: document.querySelectorAll(".quick-input-widget")
        .length,
    }));
    throw new Error(
      `Timed out opening ${purpose}: ${JSON.stringify(state)} (${String(error)})`,
    );
  }
};

export const assertQuickInputHasResults = async (
  page: Page,
  purpose: string,
): Promise<void> => {
  await wait(250);
  const text = await page.locator(".quick-input-widget").innerText();
  if (/no matching results|一致する結果はありません/i.test(text)) {
    const state = await page.evaluate(() => ({
      body: document.body.innerText.slice(0, 1_200),
      statusBar: Array.from(document.querySelectorAll(".statusbar-item")).map(
        (entry) => ({
          text: entry.textContent?.trim(),
          title: entry.getAttribute("title"),
          ariaLabel: entry.getAttribute("aria-label"),
        }),
      ),
      tabs: Array.from(document.querySelectorAll(".tab")).map((entry) => ({
        text: entry.textContent?.trim(),
        selected: entry.getAttribute("aria-selected"),
        active: entry.classList.contains("active"),
      })),
    }));
    throw new Error(`No ${purpose} results: ${JSON.stringify(state)}`);
  }
};

export const waitForWorkbenchPage = async (
  browser: Browser,
  timeoutMilliseconds = 20_000,
): Promise<Page> => {
  const deadline = Date.now() + timeoutMilliseconds;
  while (Date.now() < deadline) {
    const pages = browser.contexts().flatMap((context) => context.pages());
    for (const page of pages) {
      if (!page.isClosed()) return page;
    }
    await wait(100);
  }
  throw new Error("Timed out waiting for the Desktop workbench page.");
};

export const runWorkbenchCommand = async (
  page: Page,
  command: string,
): Promise<void> => {
  const modifier = process.platform === "darwin" ? "Meta" : "Control";
  const showCommands = page.getByRole("button", {
    name: /show all commands|すべてのコマンドを表示/i,
  });
  if (
    (await showCommands.count()) > 0 &&
    (await showCommands.first().isVisible())
  ) {
    await showCommands.first().click();
  } else {
    await page.keyboard.press(`${modifier}+Shift+P`);
  }
  const input = await waitForQuickInput(page, `command palette (${command})`);
  await input.fill(`>${command}`);
  await assertQuickInputHasResults(page, `command palette for ${command}`);
  await page.keyboard.press("Enter");
};

export const waitForWebviewFrame = async (
  page: Page,
  buttonLabels: readonly string[],
  timeoutMilliseconds = 20_000,
): Promise<Frame> => {
  const deadline = Date.now() + timeoutMilliseconds;
  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      for (const label of buttonLabels) {
        try {
          const button = frame.getByRole("button", {
            name: label,
            exact: true,
          });
          if ((await button.count()) > 0 && (await button.isVisible())) {
            return frame;
          }
        } catch {
          // The webview may be navigating while the workbench restores it.
        }
      }
    }
    await wait(100);
  }
  const state = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    text: document.body.innerText.slice(0, 800),
    frames: Array.from(document.querySelectorAll("iframe")).map((frame) => ({
      title: frame.title,
      src: frame.src,
      visible: frame.getBoundingClientRect().width > 0,
    })),
  }));
  throw new Error(
    `Timed out waiting for the Flow Viewer webview: ${JSON.stringify(state)}`,
  );
};
