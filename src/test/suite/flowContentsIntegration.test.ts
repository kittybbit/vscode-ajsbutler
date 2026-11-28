import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import { ja } from "../../resource/i18n/message_ja";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import {
  createViewerDocumentChangedMessage,
  createViewerResourceStateMessage,
} from "../../presentation/webview/viewerHostMessages";
import { parseAjsDocumentForTest } from "../support/parseAjs";

type FlowViewerAppModule =
  typeof import("../../presentation/webview/editor/ajsFlow/AjsFlowViewerApp");

const loadFlowViewerApp = async (): Promise<FlowViewerAppModule> => {
  const originalCssLoader = require.extensions[".css"];
  require.extensions[".css"] = () => undefined;
  try {
    return (await import(
      "../../presentation/webview/editor/ajsFlow/AjsFlowViewerApp"
    )) as FlowViewerAppModule;
  } finally {
    if (originalCssLoader) {
      require.extensions[".css"] = originalCssLoader;
    } else {
      delete require.extensions[".css"];
    }
  }
};

const nestedDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    ar=f=source-scope-job,t=report::nested-panel-bounds,con;
    el=child-net,n,+240+144;
    el=source-scope-job,j,+0+144;
    el=report::nested-panel-bounds,j,+480+144;
    el=outer-sibling,j,+720+144;
    unit=child-net,,jp1admin,;
    {
      ty=n;
      el=nested-net,n,+240+144;
      el=inner-sibling,j,+480+144;
      unit=nested-net,,jp1admin,;
      {
        ty=n;
        el=leaf-job,j,+240+144;
        unit=leaf-job,,jp1admin,;
        {
          ty=j;
        }
      }
      unit=inner-sibling,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=source-scope-job,,jp1admin,;
    {
      ty=j;
    }
    unit=report::nested-panel-bounds,,jp1admin,;
    {
      ty=j;
    }
    unit=outer-sibling,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const recoveryDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=.CONDITION,rc,+0+0;
    el=outer-job,j,+240+144;
    unit=.CONDITION,,jp1admin,;
    {
      ty=rc;
      el=recovery-job,j,+240+144;
      unit=recovery-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=outer-job,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const getExportedUnitTitles = (svg: string): string[] => {
  const dom = new JSDOM(svg, { contentType: "image/svg+xml" });
  try {
    return Array.from(dom.window.document.querySelectorAll("g > title"))
      .map((title) => title.textContent ?? "")
      .sort();
  } finally {
    dom.window.close();
  }
};

const isMenuItemDisabled = (item: HTMLElement): boolean =>
  item.getAttribute("aria-disabled") === "true";

const prepareMenuAnchor = (anchor: HTMLElement): void => {
  anchor.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 40,
      bottom: 40,
      width: 40,
      height: 40,
      toJSON: () => ({}),
    }) as DOMRect;
};

const createPngBytes = (width: number, height: number): ArrayBuffer => {
  const bytes = new ArrayBuffer(33);
  const view = new DataView(bytes);
  [137, 80, 78, 71, 13, 10, 26, 10].forEach((value, index) =>
    view.setUint8(index, value),
  );
  view.setUint32(8, 13);
  [73, 72, 68, 82].forEach((value, index) => view.setUint8(12 + index, value));
  view.setUint32(16, width);
  view.setUint32(20, height);
  view.setUint8(24, 8);
  view.setUint8(25, 6);
  return bytes;
};

const hasViewerReadyRequest = (messages: readonly unknown[]): boolean =>
  messages.some(
    (message) =>
      typeof message === "object" &&
      message !== null &&
      "type" in message &&
      message.type === "ready",
  );

type GlobalDescriptorMap = Map<string, PropertyDescriptor | undefined>;

const installDomGlobals = (): {
  dom: JSDOM;
  previous: GlobalDescriptorMap;
} => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const previous: GlobalDescriptorMap = new Map();
  const domWindow = dom.window;
  const requestAnimationFrame = (callback: FrameRequestCallback): number =>
    domWindow.setTimeout(() => callback(domWindow.performance.now()), 0);
  const cancelAnimationFrame = (handle: number): void =>
    domWindow.clearTimeout(handle);
  domWindow.requestAnimationFrame = requestAnimationFrame;
  domWindow.cancelAnimationFrame = cancelAnimationFrame;
  const values: Record<string, unknown> = {
    window: domWindow,
    document: domWindow.document,
    navigator: domWindow.navigator,
    HTMLElement: domWindow.HTMLElement,
    Node: domWindow.Node,
    Element: domWindow.Element,
    SVGElement: domWindow.SVGElement,
    SVGSVGElement: domWindow.SVGSVGElement,
    CSS: {
      escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "\\$&"),
    },
    Event: domWindow.Event,
    MessageEvent: domWindow.MessageEvent,
    KeyboardEvent: domWindow.KeyboardEvent,
    MouseEvent: domWindow.MouseEvent,
    MutationObserver: domWindow.MutationObserver,
    ResizeObserver: class {
      disconnect(): void {}
      observe(): void {}
      unobserve(): void {}
    },
    getComputedStyle: domWindow.getComputedStyle.bind(domWindow),
    requestAnimationFrame,
    cancelAnimationFrame,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  Object.defineProperty(domWindow, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
  domWindow.HTMLElement.prototype.scrollIntoView = () => undefined;
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  }
  return { dom, previous };
};

const restoreDomGlobals = (dom: JSDOM, previous: GlobalDescriptorMap): void => {
  for (const key of previous.keys()) {
    const descriptor = previous.get(key);
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete (globalThis as Record<string, unknown>)[key];
    }
  }
  dom.window.close();
};

suite("Flow Contents integration", () => {
  let dom: JSDOM;
  let previousGlobals: GlobalDescriptorMap;

  suiteSetup(() => {
    ({ dom, previous: previousGlobals } = installDomGlobals());
  });

  teardown(() => {
    cleanup();
    delete window.vscode;
    delete window.EventBridge;
    dom.window.document.body.innerHTML = "";
  });

  suiteTeardown(() => {
    restoreDomGlobals(dom, previousGlobals);
  });

  test("connects the document to the Flow tree, graph, and header actions", async () => {
    const { AjsFlowViewerApp } = await loadFlowViewerApp();
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsFlowViewerApp));
    const documentDto = toUnitListDocumentDto(
      parseAjsDocumentForTest(nestedDefinition),
    );

    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerResourceStateMessage({
            isDarkMode: false,
            lang: "en",
            scrollType: "table",
          }),
        }),
      );
    });

    await waitFor(() => {
      assert.ok(hasViewerReadyRequest(postedMessages));
    });

    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerDocumentChangedMessage(documentDto),
        }),
      );
    });

    await waitFor(() => {
      assert.ok(view.getByRole("tree"));
      assert.ok(view.getByRole("region", { name: /flow graph/i }));
      assert.ok(view.getByPlaceholderText(/search/i));
    });

    const currentScope = view.getByText("ROOT JOBNET");
    assert.ok(currentScope);
    const tree = view.getByRole("tree");
    const currentScopeRow = tree.querySelector<HTMLElement>(
      '[data-unit-tree-unit-id$="/jobnet"]',
    );
    assert.ok(currentScopeRow);

    fireEvent.click(currentScopeRow);
    assert.strictEqual(currentScopeRow.getAttribute("aria-selected"), "true");

    const relationshipFocusButton = within(view.getByRole("banner")).getByRole(
      "button",
      { name: /focus on selected node relationships/i },
    );
    fireEvent.click(relationshipFocusButton);
    assert.strictEqual(
      relationshipFocusButton.getAttribute("aria-pressed"),
      "true",
    );

    const searchInput = view.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "leaf-job" } });
    fireEvent.keyUp(searchInput, { key: "Enter" });

    await waitFor(() => {
      assert.ok(view.getByLabelText("1 / 1"));
    });
    assert.deepStrictEqual(
      postedMessages.filter(
        (message) =>
          typeof message === "object" &&
          message !== null &&
          ["search", "operation"].includes(
            (message as { type?: string }).type ?? "",
          ),
      ),
      [{ type: "search", data: { feature: "flow" } }],
    );
  });

  test("exports the entered N scope without changing selection or expansion", async () => {
    const { AjsFlowViewerApp } = await loadFlowViewerApp();
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    const clipboardWrites: string[] = [];
    let resolveClipboardWrite: (() => void) | undefined;
    const previousClipboard = Object.getOwnPropertyDescriptor(
      navigator,
      "clipboard",
    );
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (text: string) => {
          clipboardWrites.push(text);
          return new Promise<void>((resolve) => {
            resolveClipboardWrite = resolve;
          });
        },
      },
    });
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    try {
      const view = render(React.createElement(AjsFlowViewerApp));
      const documentDto = toUnitListDocumentDto(
        parseAjsDocumentForTest(nestedDefinition),
      );
      act(() => {
        eventBridge.dispatch(
          new MessageEvent("message", {
            data: createViewerResourceStateMessage({
              isDarkMode: false,
              lang: "en",
              scrollType: "table",
              flowSaveMode: "dialog",
            }),
          }),
        );
      });
      await waitFor(() => assert.ok(hasViewerReadyRequest(postedMessages)));
      assert.strictEqual(
        (
          view.getByRole("button", {
            name: "Save flow diagram",
          }) as HTMLButtonElement
        ).disabled,
        true,
      );
      assert.strictEqual(
        (
          view.getByRole("button", {
            name: "Copy flow diagram",
          }) as HTMLButtonElement
        ).disabled,
        true,
      );
      act(() => {
        eventBridge.dispatch(
          new MessageEvent("message", {
            data: createViewerDocumentChangedMessage(documentDto),
          }),
        );
      });

      const copyButton = await view.findByRole("button", {
        name: "Copy flow diagram",
      });
      const saveButton = view.getByRole("button", {
        name: "Save flow diagram",
      });
      prepareMenuAnchor(copyButton);
      prepareMenuAnchor(saveButton);
      assert.strictEqual((saveButton as HTMLButtonElement).disabled, false);
      const exportStatus = within(view.getByRole("banner")).getByRole("status");
      assert.strictEqual(saveButton.getAttribute("aria-haspopup"), "menu");
      assert.strictEqual(saveButton.getAttribute("aria-expanded"), "false");
      assert.strictEqual(copyButton.getAttribute("aria-haspopup"), "menu");
      const initialWriteCount = clipboardWrites.length;
      const initialMessageCount = postedMessages.length;
      copyButton.focus();
      fireEvent.click(copyButton);
      const copySvgMenuItem = await view.findByRole("menuitem", {
        name: "Copy SVG source",
      });
      const copyPngMenuItem = view.getByRole("menuitem", {
        name: "Copy flow image (PNG)",
      });
      assert.strictEqual(copyButton.getAttribute("aria-expanded"), "true");
      assert.strictEqual(isMenuItemDisabled(copySvgMenuItem), false);
      assert.strictEqual(isMenuItemDisabled(copyPngMenuItem), false);
      assert.strictEqual(clipboardWrites.length, initialWriteCount);
      assert.strictEqual(postedMessages.length, initialMessageCount);
      fireEvent.keyDown(view.getByRole("menu"), {
        key: "Escape",
        code: "Escape",
      });
      await waitFor(() =>
        assert.ok(!view.queryByRole("menu"), "Escape should close the menu."),
      );
      assert.strictEqual(copyButton.getAttribute("aria-expanded"), "false");
      assert.ok(
        document.activeElement === copyButton,
        "Escape should return focus to the Copy trigger.",
      );
      const selectMenuItem = async (
        button: HTMLElement,
        itemLabel: string,
      ): Promise<void> => {
        button.focus();
        fireEvent.click(button);
        fireEvent.click(await view.findByRole("menuitem", { name: itemLabel }));
      };

      const copySvg = async (): Promise<string> => {
        const writeIndex = clipboardWrites.length;
        await selectMenuItem(copyButton, "Copy SVG source");
        await waitFor(() =>
          assert.strictEqual(clipboardWrites.length, writeIndex + 1),
        );
        const svg = clipboardWrites[writeIndex];
        assert.ok(svg?.startsWith("<svg "));
        act(() => resolveClipboardWrite?.());
        await waitFor(() =>
          assert.strictEqual(exportStatus.textContent, "SVG source copied."),
        );
        return svg as string;
      };

      const saveSvg = async (): Promise<string> => {
        const saveCount = postedMessages.filter(
          (message) =>
            typeof message === "object" &&
            message !== null &&
            "type" in message &&
            message.type === "save",
        ).length;
        await selectMenuItem(saveButton, "Save flow as SVG");
        await waitFor(() =>
          assert.strictEqual(
            postedMessages.filter(
              (message) =>
                typeof message === "object" &&
                message !== null &&
                "type" in message &&
                message.type === "save",
            ).length,
            saveCount + 1,
          ),
        );
        const saveMessage = postedMessages.filter(
          (message): message is { type: string; data: string } =>
            typeof message === "object" &&
            message !== null &&
            "type" in message &&
            message.type === "save",
        )[saveCount];
        return saveMessage?.data ?? "";
      };

      const rootSvg = await copySvg();
      const rootTitles = getExportedUnitTitles(rootSvg);
      assert.ok(rootTitles.includes("report::nested-panel-bounds"));
      assert.ok(rootTitles.includes("outer-sibling"));
      assert.strictEqual(
        (rootSvg.match(/<path d=.*?marker-end=/g) ?? []).length,
        1,
      );
      assert.strictEqual(await saveSvg(), rootSvg);

      const scopeNode = view.getByRole("group", { name: "child-net" });
      fireEvent.keyDown(scopeNode, { key: "Enter" });
      const banner = within(view.getByRole("banner"));
      await waitFor(() =>
        assert.ok(banner.getByText("child-net", { exact: true })),
      );
      const expandAll = view.getByRole("button", {
        name: /expand all nested jobnets/i,
      });
      await waitFor(() =>
        assert.strictEqual((expandAll as HTMLButtonElement).disabled, false),
      );
      fireEvent.click(expandAll);
      const collapseAll = await view.findByRole("button", {
        name: /collapse all nested jobnets/i,
      });
      assert.ok(view.getByRole("group", { name: "leaf-job" }));
      const tree = view.getByRole("tree");
      const leafTreeRow = tree.querySelector<HTMLElement>(
        '[data-unit-tree-unit-id$="/leaf-job"]',
      );
      assert.ok(leafTreeRow);
      fireEvent.click(leafTreeRow);
      await waitFor(() =>
        assert.strictEqual(leafTreeRow.getAttribute("aria-selected"), "true"),
      );

      const captureViewerState = () => ({
        scope: banner.getByText("child-net", { exact: true }).textContent,
        selectedUnitId: tree
          .querySelector<HTMLElement>('[aria-selected="true"]')
          ?.getAttribute("data-unit-tree-unit-id"),
        expansion: collapseAll.getAttribute("aria-label"),
      });
      const expandedState = captureViewerState();
      assert.strictEqual(
        expandedState.selectedUnitId,
        "/root/jobnet/child-net/nested-net/leaf-job",
      );
      const expandedSvg = await copySvg();
      assert.deepStrictEqual(
        getExportedUnitTitles(expandedSvg),
        [
          "child-net",
          "inner-sibling",
          "jobnet",
          "leaf-job",
          "nested-net",
          "root",
        ].sort(),
      );
      assert.strictEqual(await saveSvg(), expandedSvg);
      assert.deepStrictEqual(captureViewerState(), expandedState);

      fireEvent.click(collapseAll);
      const expandCollapsed = await view.findByRole("button", {
        name: /expand all nested jobnets/i,
      });
      const collapsedSvg = await copySvg();
      assert.deepStrictEqual(
        getExportedUnitTitles(collapsedSvg),
        ["child-net", "inner-sibling", "jobnet", "nested-net", "root"].sort(),
      );
      assert.ok(!collapsedSvg.includes("outer-sibling"));
      assert.ok(!collapsedSvg.includes("report::nested-panel-bounds"));
      assert.strictEqual(
        (expandCollapsed as HTMLButtonElement).disabled,
        false,
      );
      assert.strictEqual(
        banner.getByText("child-net", { exact: true }).textContent,
        "child-net",
      );

      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error("clipboard denied");
          },
        },
      });
      await selectMenuItem(copyButton, "Copy SVG source");
      await waitFor(() =>
        assert.strictEqual(
          exportStatus.textContent,
          "Could not copy SVG source.",
        ),
      );
      assert.strictEqual((saveButton as HTMLButtonElement).disabled, false);

      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: undefined,
      });
      await selectMenuItem(copyButton, "Copy SVG source");
      await waitFor(() =>
        assert.strictEqual(
          exportStatus.textContent,
          "SVG source copy is unavailable in this host.",
        ),
      );
      assert.strictEqual(
        banner.getByText("child-net", { exact: true }).textContent,
        "child-net",
      );
      const savedSvgWithoutClipboard = await saveSvg();
      assert.ok(savedSvgWithoutClipboard.startsWith("<svg "));
      act(() => {
        eventBridge.dispatch(
          new MessageEvent("message", {
            data: createViewerResourceStateMessage({
              isDarkMode: false,
              lang: "ja",
              scrollType: "table",
              flowSaveMode: "dialog",
            }),
          }),
        );
      });
      const localizedCopyButton = await view.findByRole("button", {
        name: ja["a11y.flow.controls.copyMenu"],
      });
      const localizedSaveButton = view.getByRole("button", {
        name: ja["a11y.flow.controls.saveMenu"],
      });
      prepareMenuAnchor(localizedCopyButton);
      prepareMenuAnchor(localizedSaveButton);
      localizedCopyButton.focus();
      fireEvent.click(localizedCopyButton);
      assert.ok(
        await view.findByRole("menuitem", {
          name: ja["a11y.flow.controls.copySvg"],
        }),
      );
      assert.ok(
        view.getByRole("menuitem", {
          name: ja["a11y.flow.controls.copyPng"],
        }),
      );
      fireEvent.keyDown(view.getByRole("menu"), {
        key: "Escape",
        code: "Escape",
      });
      await waitFor(() =>
        assert.ok(!view.queryByRole("menu"), "Escape should close the menu."),
      );
      localizedSaveButton.focus();
      fireEvent.click(localizedSaveButton);
      assert.ok(
        await view.findByRole("menuitem", {
          name: ja["a11y.flow.controls.saveSvg"],
        }),
      );
      assert.ok(
        view.getByRole("menuitem", {
          name: ja["a11y.flow.controls.savePng"],
        }),
      );
      fireEvent.keyDown(view.getByRole("menu"), {
        key: "Escape",
        code: "Escape",
      });
      await waitFor(() =>
        assert.ok(!view.queryByRole("menu"), "Escape should close the menu."),
      );
      assert.strictEqual(
        (localizedSaveButton as HTMLButtonElement).disabled,
        false,
      );
    } finally {
      if (previousClipboard) {
        Object.defineProperty(navigator, "clipboard", previousClipboard);
      } else {
        Reflect.deleteProperty(navigator, "clipboard");
      }
    }
  });

  test("copies PNG from the active expanded scope during the gesture and saves after clipboard denial", async () => {
    const { AjsFlowViewerApp } = await loadFlowViewerApp();
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    const previousClipboard = Object.getOwnPropertyDescriptor(
      navigator,
      "clipboard",
    );
    const previousImage = Object.getOwnPropertyDescriptor(globalThis, "Image");
    const previousClipboardItem = Object.getOwnPropertyDescriptor(
      globalThis,
      "ClipboardItem",
    );
    const previousCreateElement = Object.getOwnPropertyDescriptor(
      document,
      "createElement",
    );
    const previousCreateObjectUrl = Object.getOwnPropertyDescriptor(
      URL,
      "createObjectURL",
    );
    const previousRevokeObjectUrl = Object.getOwnPropertyDescriptor(
      URL,
      "revokeObjectURL",
    );
    let writeStarted = false;
    let imageDecodeCount = 0;
    let imageDecodeStarted!: () => void;
    let releaseImageDecode!: () => void;
    let deferImageDecode = true;
    let rasterSourceSvg: Promise<string> | undefined;
    let copiedItem:
      | { types: string[]; data: Record<string, Promise<Blob>> }
      | undefined;
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({
        drawImage: () => undefined,
      }),
      toBlob: (callback: BlobCallback) =>
        callback(
          new Blob([createPngBytes(canvas.width, canvas.height)], {
            type: "image/png",
          }),
        ),
    } as unknown as HTMLCanvasElement;
    class MockImage {
      src = "";
      naturalWidth = 200;
      naturalHeight = 100;

      decode(): Promise<void> {
        imageDecodeCount += 1;
        if (!deferImageDecode) return Promise.resolve();
        deferImageDecode = false;
        imageDecodeStarted();
        return new Promise((resolve) => {
          releaseImageDecode = resolve;
        });
      }
    }
    class MockClipboardItem {
      readonly types: string[];

      constructor(readonly data: Record<string, Promise<Blob>>) {
        this.types = Object.keys(data);
      }
    }
    const clipboard = {
      write: async (items: ClipboardItem[]) => {
        writeStarted = true;
        copiedItem = items[0] as unknown as MockClipboardItem;
        await Promise.all(Object.values(copiedItem.data));
      },
    };
    const originalCreateElement = document.createElement.bind(document);
    const imageDecodeStartedPromise = new Promise<void>((resolve) => {
      imageDecodeStarted = resolve;
    });
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    try {
      const view = render(React.createElement(AjsFlowViewerApp));
      const documentDto = toUnitListDocumentDto(
        parseAjsDocumentForTest(nestedDefinition),
      );
      act(() => {
        eventBridge.dispatch(
          new MessageEvent("message", {
            data: createViewerResourceStateMessage({
              isDarkMode: false,
              lang: "en",
              scrollType: "table",
              flowSaveMode: "dialog",
            }),
          }),
        );
      });
      await waitFor(() => assert.ok(hasViewerReadyRequest(postedMessages)));
      act(() => {
        eventBridge.dispatch(
          new MessageEvent("message", {
            data: createViewerDocumentChangedMessage(documentDto),
          }),
        );
      });
      await waitFor(() => assert.ok(view.getByRole("tree")));
      const nestedScope = await view.findByRole("group", {
        name: "child-net",
      });
      fireEvent.keyDown(nestedScope, { key: "Enter" });
      const banner = within(view.getByRole("banner"));
      await waitFor(() =>
        assert.ok(banner.getByText("child-net", { exact: true })),
      );
      fireEvent.click(
        view.getByRole("button", {
          name: /Expand all nested jobnets\.?/,
        }),
      );
      await view.findByRole("group", { name: "leaf-job" });

      Object.defineProperty(globalThis, "Image", {
        configurable: true,
        value: MockImage,
      });
      Object.defineProperty(globalThis, "ClipboardItem", {
        configurable: true,
        value: MockClipboardItem,
      });
      Object.defineProperty(document, "createElement", {
        configurable: true,
        value: ((tagName: string, options?: ElementCreationOptions) =>
          tagName.toLowerCase() === "canvas"
            ? canvas
            : originalCreateElement(
                tagName,
                options,
              )) as Document["createElement"],
      });
      Object.defineProperty(URL, "createObjectURL", {
        configurable: true,
        value: (blob: Blob) => {
          rasterSourceSvg = blob.text();
          return "blob:flow-png-test";
        },
      });
      Object.defineProperty(URL, "revokeObjectURL", {
        configurable: true,
        value: () => undefined,
      });
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: clipboard,
      });

      const copyMenuButton = view.getByRole("button", {
        name: "Copy flow diagram",
      });
      const saveMenuButton = view.getByRole("button", {
        name: "Save flow diagram",
      });
      prepareMenuAnchor(copyMenuButton);
      prepareMenuAnchor(saveMenuButton);
      const selectMenuItem = async (
        button: HTMLElement,
        itemLabel: string,
      ): Promise<void> => {
        button.focus();
        fireEvent.click(button);
        fireEvent.click(await view.findByRole("menuitem", { name: itemLabel }));
      };
      const exportStatus = within(view.getByRole("banner")).getByRole("status");

      await selectMenuItem(copyMenuButton, "Copy SVG source");
      await waitFor(() =>
        assert.strictEqual(
          exportStatus.textContent,
          "SVG source copy is unavailable in this host.",
        ),
      );
      assert.strictEqual(writeStarted, false);
      assert.strictEqual(imageDecodeCount, 0);

      await selectMenuItem(copyMenuButton, "Copy flow image (PNG)");
      assert.strictEqual(writeStarted, true);
      await imageDecodeStartedPromise;
      assert.deepStrictEqual(copiedItem?.types, ["image/png"]);

      copyMenuButton.focus();
      fireEvent.click(copyMenuButton);
      const busyCopySvg = await view.findByRole("menuitem", {
        name: "Copy SVG source",
      });
      const busyCopyPng = view.getByRole("menuitem", {
        name: "Copy flow image (PNG)",
      });
      assert.strictEqual(isMenuItemDisabled(busyCopySvg), false);
      assert.strictEqual(isMenuItemDisabled(busyCopyPng), true);
      fireEvent.keyDown(view.getByRole("menu"), {
        key: "Escape",
        code: "Escape",
      });
      await waitFor(() =>
        assert.ok(!view.queryByRole("menu"), "Escape should close the menu."),
      );
      saveMenuButton.focus();
      fireEvent.click(saveMenuButton);
      const busySaveSvg = await view.findByRole("menuitem", {
        name: "Save flow as SVG",
      });
      const busySavePng = view.getByRole("menuitem", {
        name: "Save flow as PNG",
      });
      assert.strictEqual(isMenuItemDisabled(busySaveSvg), false);
      assert.strictEqual(isMenuItemDisabled(busySavePng), true);
      fireEvent.keyDown(view.getByRole("menu"), {
        key: "Escape",
        code: "Escape",
      });
      await waitFor(() =>
        assert.ok(!view.queryByRole("menu"), "Escape should close the menu."),
      );
      releaseImageDecode();
      await waitFor(() =>
        assert.strictEqual(exportStatus.textContent, "Flow image copied."),
      );
      const exportedSvg = await rasterSourceSvg;
      assert.ok(exportedSvg?.includes("child-net"));
      assert.ok(exportedSvg?.includes("leaf-job"));
      assert.ok(!exportedSvg?.includes("outer-sibling"));
      const copiedBlob = await copiedItem?.data["image/png"];
      assert.strictEqual(copiedBlob?.type, "image/png");
      assert.strictEqual(imageDecodeCount, 1);

      Object.defineProperty(globalThis, "ClipboardItem", {
        configurable: true,
        value: undefined,
      });
      await selectMenuItem(copyMenuButton, "Copy flow image (PNG)");
      await waitFor(() =>
        assert.strictEqual(
          exportStatus.textContent,
          "Image copy is unavailable in this host.",
        ),
      );
      assert.strictEqual(imageDecodeCount, 1);
      Object.defineProperty(globalThis, "ClipboardItem", {
        configurable: true,
        value: MockClipboardItem,
      });

      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: undefined,
      });
      await selectMenuItem(copyMenuButton, "Copy flow image (PNG)");
      await waitFor(() =>
        assert.strictEqual(
          exportStatus.textContent,
          "Image copy is unavailable in this host.",
        ),
      );
      assert.strictEqual(imageDecodeCount, 1);
      const pngSaveCountWithoutClipboard = postedMessages.filter(
        (message) =>
          typeof message === "object" &&
          message !== null &&
          (message as { type?: string }).type === "flow_png_save",
      ).length;
      await selectMenuItem(saveMenuButton, "Save flow as PNG");
      await waitFor(() =>
        assert.strictEqual(
          postedMessages.filter(
            (message) =>
              typeof message === "object" &&
              message !== null &&
              (message as { type?: string }).type === "flow_png_save",
          ).length,
          pngSaveCountWithoutClipboard + 1,
        ),
      );
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          write: async () => {
            throw new Error("clipboard denied");
          },
        },
      });
      await selectMenuItem(copyMenuButton, "Copy flow image (PNG)");
      await waitFor(() =>
        assert.strictEqual(
          exportStatus.textContent,
          "Could not copy the flow image.",
        ),
      );
      await selectMenuItem(saveMenuButton, "Save flow as PNG");
      await waitFor(() =>
        assert.ok(
          postedMessages.some(
            (message) =>
              typeof message === "object" &&
              message !== null &&
              (message as { type?: string }).type === "flow_png_save",
          ),
        ),
      );
      const pngSaveRequest = postedMessages.find(
        (message) =>
          typeof message === "object" &&
          message !== null &&
          (message as { type?: string }).type === "flow_png_save",
      ) as { data: { bytes: ArrayBuffer } };
      assert.ok(pngSaveRequest.data.bytes instanceof ArrayBuffer);
      assert.strictEqual(
        new DataView(pngSaveRequest.data.bytes).getUint8(1),
        80,
      );
      assert.ok(
        postedMessages
          .map((message) =>
            typeof message === "object" && message !== null
              ? (message as { type?: string }).type
              : undefined,
          )
          .every((type) => type !== "csv_export"),
      );
    } finally {
      if (previousClipboard) {
        Object.defineProperty(navigator, "clipboard", previousClipboard);
      } else {
        Reflect.deleteProperty(navigator, "clipboard");
      }
      for (const [target, key, descriptor] of [
        [globalThis, "Image", previousImage],
        [globalThis, "ClipboardItem", previousClipboardItem],
        [document, "createElement", previousCreateElement],
        [URL, "createObjectURL", previousCreateObjectUrl],
        [URL, "revokeObjectURL", previousRevokeObjectUrl],
      ] as const) {
        if (descriptor) Object.defineProperty(target, key, descriptor);
        else Reflect.deleteProperty(target, key);
      }
    }
  });

  test("exports an entered RC scope with its own children and no outer sibling", async () => {
    const { AjsFlowViewerApp } = await loadFlowViewerApp();
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    let copiedSvg = "";
    const previousClipboard = Object.getOwnPropertyDescriptor(
      navigator,
      "clipboard",
    );
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (svg: string) => {
          copiedSvg = svg;
          return Promise.resolve();
        },
      },
    });
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    try {
      const view = render(React.createElement(AjsFlowViewerApp));
      const documentDto = toUnitListDocumentDto(
        parseAjsDocumentForTest(recoveryDefinition),
      );
      act(() => {
        eventBridge.dispatch(
          new MessageEvent("message", {
            data: createViewerResourceStateMessage({
              isDarkMode: false,
              lang: "en",
              scrollType: "table",
              flowSaveMode: "dialog",
            }),
          }),
        );
      });
      await waitFor(() => assert.ok(hasViewerReadyRequest(postedMessages)));
      act(() => {
        eventBridge.dispatch(
          new MessageEvent("message", {
            data: createViewerDocumentChangedMessage(documentDto),
          }),
        );
      });

      const recoveryCondition = view.getByRole("group", {
        name: ".CONDITION",
      });
      fireEvent.keyDown(recoveryCondition, { key: "Enter" });
      const banner = within(view.getByRole("banner"));
      await waitFor(() =>
        assert.ok(banner.getByText(".CONDITION", { exact: true })),
      );
      const copyButton = view.getByRole("button", {
        name: "Copy flow diagram",
      });
      prepareMenuAnchor(copyButton);
      copyButton.focus();
      fireEvent.click(copyButton);
      fireEvent.click(
        await view.findByRole("menuitem", { name: "Copy SVG source" }),
      );
      await waitFor(() => assert.ok(copiedSvg.startsWith("<svg ")));
      await waitFor(() =>
        assert.strictEqual(
          banner.getByRole("status").textContent,
          "SVG source copied.",
        ),
      );
      assert.deepStrictEqual(getExportedUnitTitles(copiedSvg), [
        ".CONDITION",
        "jobnet",
        "recovery-job",
        "root",
      ]);
      assert.ok(!copiedSvg.includes("outer-job"));
      assert.strictEqual(
        banner.getByText(".CONDITION", { exact: true }).textContent,
        ".CONDITION",
      );
    } finally {
      if (previousClipboard) {
        Object.defineProperty(navigator, "clipboard", previousClipboard);
      } else {
        Reflect.deleteProperty(navigator, "clipboard");
      }
    }
  });
});
