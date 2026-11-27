import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import type { BuildUnitList } from "../../application/unit-list/buildUnitList";
import type { UnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import { en } from "../../resource/i18n/message_en";
import { ja } from "../../resource/i18n/message_ja";
import {
  createViewerReadyHandler,
  createViewerSubscriptions,
  revealCounterpartPanel,
} from "../../bootstrap/extension/viewerWiring";
import { ViewerFactory } from "../../presentation/vscode/webview/ViewerFactory";
import {
  AJS_FLOW_VIEWER_TYPE,
  AJS_TABLE_VIEWER_TYPE,
} from "../../presentation/vscode/webview/constant";
import { saveSvg } from "../../presentation/vscode/webview/messageHandlers";

type PropertyOverride = {
  restore: () => void;
};

const overrideProperty = (
  target: object,
  key: string,
  descriptor: PropertyDescriptor,
): PropertyOverride => {
  const previous = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, { configurable: true, ...descriptor });
  return {
    restore: () => {
      if (previous) Object.defineProperty(target, key, previous);
      else Reflect.deleteProperty(target, key);
    },
  };
};

type ViewerPanelFixture = {
  panel: vscode.WebviewPanel;
  receive: (message: unknown) => void;
};

const registerWritableMemoryFileSystem = (
  scheme: string,
  onWrite: (uri: vscode.Uri, bytes: Uint8Array) => void,
): vscode.Disposable => {
  const files = new Map<string, Uint8Array>();
  const changes = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
  const fileNotFound = (uri: vscode.Uri): never => {
    throw vscode.FileSystemError.FileNotFound(uri);
  };
  const provider: vscode.FileSystemProvider = {
    onDidChangeFile: changes.event,
    watch: () => ({ dispose() {} }),
    stat: (uri) => {
      const bytes = files.get(uri.toString());
      if (!bytes) return fileNotFound(uri);
      return {
        type: vscode.FileType.File,
        ctime: 0,
        mtime: 0,
        size: bytes.byteLength,
      };
    },
    readDirectory: () => [],
    createDirectory: () => undefined,
    readFile: (uri) => files.get(uri.toString()) ?? fileNotFound(uri),
    writeFile: (uri, bytes, options) => {
      const key = uri.toString();
      const exists = files.has(key);
      if (!exists && !options.create) {
        fileNotFound(uri);
      }
      if (exists && !options.overwrite) {
        throw vscode.FileSystemError.FileExists(uri);
      }
      const content = bytes.slice();
      files.set(key, content);
      onWrite(uri, content);
      changes.fire([{ type: vscode.FileChangeType.Changed, uri }]);
    },
    delete: (uri) => {
      if (!files.delete(uri.toString())) fileNotFound(uri);
    },
    rename: (oldUri, newUri) => {
      const bytes = files.get(oldUri.toString());
      if (!bytes) fileNotFound(oldUri);
      files.set(newUri.toString(), bytes);
      files.delete(oldUri.toString());
    },
  };
  const registration = vscode.workspace.registerFileSystemProvider(
    scheme,
    provider,
    {
      isCaseSensitive: true,
    },
  );
  return {
    dispose: () => {
      registration.dispose();
      changes.dispose();
    },
  };
};

const createViewerPanelFixture = (
  viewType: string,
  title: string,
  postMessage: () => Thenable<boolean> = async () => true,
): ViewerPanelFixture => {
  let receive: (message: unknown) => void = () => undefined;
  const disposeListeners: (() => void)[] = [];
  let disposed = false;
  const panel = {
    viewType,
    title,
    viewColumn: vscode.ViewColumn.Active,
    reveal: () => undefined,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      disposeListeners.forEach((listener) => listener());
    },
    onDidDispose: (listener: () => void) => {
      disposeListeners.push(listener);
      return { dispose: () => undefined };
    },
    webview: {
      options: {},
      html: "",
      cspSource: "vscode-webview:",
      asWebviewUri: (uri: vscode.Uri) => uri,
      postMessage,
      onDidReceiveMessage: (listener: (message: unknown) => void) => {
        receive = listener;
        return { dispose: () => undefined };
      },
    },
  } as unknown as vscode.WebviewPanel;
  return { panel, receive: (message) => receive(message) };
};

const createViewerLifecycleHarness = (
  options: {
    buildUnitList?: BuildUnitList;
    postMessage?: () => Thenable<boolean>;
    documentUri?: vscode.Uri;
    onError?: (message: string) => void;
    onEvent?: (eventName: string) => void;
  } = {},
) => {
  const commandHandlers = new Map<string, () => void>();
  const panels: ViewerPanelFixture[] = [];
  const events: {
    name: string;
    properties: Readonly<Record<string, string>>;
  }[] = [];
  let activeEditor: vscode.TextEditor | undefined;
  const errorMessages: string[] = [];
  const document = {
    uri: options.documentUri ?? vscode.Uri.parse("untitled:viewer-lifecycle"),
    getText: () => "unit=viewer,,jp1admin,;{ty=g;}",
  } as vscode.TextDocument;
  const emptyDocument = {
    rootUnits: [],
    warnings: [],
    unitDefinitions: [],
    unitList: { units: [], rows: [], columns: [] },
  } as unknown as UnitListDocumentDto;
  const overrides = [
    overrideProperty(vscode.commands, "registerCommand", {
      value: (command: string, callback: () => void) => {
        commandHandlers.set(command, callback);
        return { dispose: () => commandHandlers.delete(command) };
      },
    }),
    overrideProperty(vscode.window, "activeTextEditor", {
      get: () => activeEditor,
    }),
    overrideProperty(vscode.window, "createWebviewPanel", {
      value: (viewType: string, title: string) => {
        const fixture = createViewerPanelFixture(
          viewType,
          title,
          options.postMessage,
        );
        panels.push(fixture);
        return fixture.panel;
      },
    }),
    overrideProperty(vscode.window, "showErrorMessage", {
      value: (message: string) => {
        errorMessages.push(message);
        options.onError?.(message);
        return Promise.resolve(undefined);
      },
    }),
  ];
  const telemetry: TelemetryPort = {
    report: (event) => {
      events.push(event);
      options.onEvent?.(event.name);
    },
    dispose() {},
  };
  const subscriptions = createViewerSubscriptions({
    context: {
      extensionUri: vscode.Uri.parse("file:///extension"),
      subscriptions: [],
    } as unknown as vscode.ExtensionContext,
    telemetry,
    buildUnitList:
      options.buildUnitList ??
      (() => ({ document: emptyDocument, errors: [] })),
  });

  return {
    commandHandlers,
    document,
    events,
    errorMessages,
    panels,
    subscriptions,
    setActiveDocument: (value: vscode.TextDocument) => {
      activeEditor = { document: value } as vscode.TextEditor;
    },
    restore: () => {
      subscriptions.forEach((subscription) => subscription.dispose());
      overrides.reverse().forEach(({ restore }) => restore());
    },
  };
};

const flushMicrotasks = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

type CounterpartRevealTestDeps = {
  factoryByViewType: ReadonlyMap<string, ViewerFactory>;
  mountPanel: (panel: vscode.WebviewPanel, viewType: string) => void;
  onOpenStarted: (panel: vscode.WebviewPanel, viewType: string) => void;
  onOpenFailed: (viewType: string) => void;
  onPanelFailed: (panel: vscode.WebviewPanel) => void;
  pendingRevealByPanel: WeakMap<vscode.WebviewPanel, string>;
};

const createCounterpartRevealDeps = (
  overrides: Partial<CounterpartRevealTestDeps> = {},
): CounterpartRevealTestDeps => ({
  factoryByViewType: new Map(),
  mountPanel: () => undefined,
  onOpenStarted: () => undefined,
  onOpenFailed: () => undefined,
  onPanelFailed: () => undefined,
  pendingRevealByPanel: new WeakMap(),
  ...overrides,
});

suite("Viewer wiring", () => {
  test("routes Flow save through the bound source identity without CSV telemetry", async () => {
    const sourceUri = vscode.Uri.parse(
      "file:///tmp/flow/../source.svg?version=1#definition",
    );
    const destination = vscode.Uri.file("/tmp/source.svg");
    let harness: ReturnType<typeof createViewerLifecycleHarness> | undefined;
    const information: string[] = [];
    let reportConflict!: () => void;
    const conflictReported = new Promise<void>((resolve) => {
      reportConflict = resolve;
    });
    const overrides: PropertyOverride[] = [];
    try {
      harness = createViewerLifecycleHarness({
        documentUri: sourceUri,
        onError: reportConflict,
      });
      overrides.push(
        overrideProperty(vscode.window, "showSaveDialog", {
          value: async () => destination,
        }),
        overrideProperty(vscode.window, "showInformationMessage", {
          value: async (message: string) => {
            information.push(message);
            return undefined;
          },
        }),
      );
      harness.setActiveDocument(harness.document);
      harness.commandHandlers.get(`open.${AJS_FLOW_VIEWER_TYPE}`)?.();
      const fixture = harness.panels[0];
      assert.ok(fixture);
      fixture.receive({ type: "display", data: "success" });
      fixture.receive({ type: "ready" });
      await flushMicrotasks();
      fixture.receive({ type: "save", data: "<svg/>" });
      await conflictReported;

      assert.strictEqual(harness.errorMessages.length, 1);
      assert.ok(
        [
          en["flow.svg.save.sourceConflict"],
          ja["flow.svg.save.sourceConflict"],
        ].includes(harness.errorMessages[0] ?? ""),
      );
      assert.deepStrictEqual(information, []);
      assert.ok(harness.events.every((event) => event.name !== "csv.exported"));
    } finally {
      overrides.reverse().forEach(({ restore }) => restore());
      harness?.restore();
    }
  });

  test("keeps successful Table saves on the CSV-only telemetry path", async () => {
    const destination = vscode.Uri.parse("tablecsv://workspace/table.csv");
    let harness: ReturnType<typeof createViewerLifecycleHarness> | undefined;
    let writtenContent = "";
    let reportWrite!: () => void;
    const writeObserved = new Promise<void>((resolve) => {
      reportWrite = resolve;
    });
    let reportCsvTelemetry!: () => void;
    const csvTelemetryReported = new Promise<void>((resolve) => {
      reportCsvTelemetry = resolve;
    });
    let fileSystem: vscode.Disposable | undefined;
    const overrides: PropertyOverride[] = [];
    try {
      fileSystem = registerWritableMemoryFileSystem(
        "tablecsv",
        (_uri, bytes) => {
          writtenContent = new TextDecoder().decode(bytes);
          reportWrite();
        },
      );
      harness = createViewerLifecycleHarness({
        onEvent: (eventName) => {
          if (eventName === "csv.exported") reportCsvTelemetry();
        },
      });
      overrides.push(
        overrideProperty(vscode.window, "showSaveDialog", {
          value: async () => destination,
        }),
      );
      harness.setActiveDocument(harness.document);
      harness.commandHandlers.get(`open.${AJS_TABLE_VIEWER_TYPE}`)?.();
      const fixture = harness.panels[0];
      assert.ok(fixture);
      fixture.receive({ type: "display", data: "success" });
      fixture.receive({ type: "ready" });
      await flushMicrotasks();
      fixture.receive({ type: "save", data: "column,value\n" });
      await Promise.all([writeObserved, csvTelemetryReported]);

      assert.strictEqual(writtenContent, "column,value\n");
      assert.ok(
        harness.events.some(
          (event) =>
            event.name === "csv.exported" && event.properties.method === "save",
        ),
      );
      assert.ok(
        harness.events.every((event) =>
          ["viewer.open_completed", "csv.exported"].includes(event.name),
        ),
      );
    } finally {
      overrides.reverse().forEach(({ restore }) => restore());
      harness?.restore();
      fileSystem?.dispose();
    }
  });

  test("rejects the source SVG URI after normalizing file path aliases", async () => {
    const destination = vscode.Uri.file("/tmp/source.svg");
    const source = vscode.Uri.parse(
      "file:///tmp/flow/../source.svg?version=1#definition",
    );
    const errors: string[] = [];
    const information: string[] = [];
    const overrides = [
      overrideProperty(vscode.window, "showSaveDialog", {
        value: async (options: vscode.SaveDialogOptions) => {
          assert.deepStrictEqual(options.filters, { "SVG image": ["svg"] });
          return destination;
        },
      }),
      overrideProperty(vscode.window, "showErrorMessage", {
        value: async (message: string) => {
          errors.push(message);
          return undefined;
        },
      }),
      overrideProperty(vscode.window, "showInformationMessage", {
        value: async (message: string) => {
          information.push(message);
          return undefined;
        },
      }),
    ];
    try {
      assert.strictEqual(await saveSvg("<svg/>", source), false);
      assert.strictEqual(errors.length, 1);
      assert.ok(
        [
          en["flow.svg.save.sourceConflict"],
          ja["flow.svg.save.sourceConflict"],
        ].includes(errors[0] ?? ""),
      );
      assert.deepStrictEqual(information, []);
    } finally {
      overrides.reverse().forEach(({ restore }) => restore());
    }
  });

  test("writes selected SVG bytes to a distinct provider URI with localized completion", async () => {
    const destination = vscode.Uri.parse(
      "flow-svg-save://workspace/project/export.svg?version=3#main",
    );
    const source = vscode.Uri.parse(
      "flow-svg-save://workspace/project/source.ajs",
    );
    let writtenUri: vscode.Uri | undefined;
    let writtenBytes: Uint8Array | undefined;
    const errors: string[] = [];
    const information: { message: string; options: vscode.MessageOptions }[] =
      [];
    let reportWrite!: () => void;
    const writeObserved = new Promise<void>((resolve) => {
      reportWrite = resolve;
    });
    let reportCompletion!: () => void;
    const completionReported = new Promise<void>((resolve) => {
      reportCompletion = resolve;
    });
    const overrides: PropertyOverride[] = [];
    let fileSystem: vscode.Disposable | undefined;
    try {
      fileSystem = registerWritableMemoryFileSystem(
        "flow-svg-save",
        (uri, bytes) => {
          writtenUri = uri;
          writtenBytes = bytes;
          reportWrite();
        },
      );
      overrides.push(
        overrideProperty(vscode.window, "showSaveDialog", {
          value: async () => destination,
        }),
        overrideProperty(vscode.window, "showErrorMessage", {
          value: async (message: string) => {
            errors.push(message);
            return undefined;
          },
        }),
        overrideProperty(vscode.window, "showInformationMessage", {
          value: async (message: string, options: vscode.MessageOptions) => {
            information.push({ message, options });
            reportCompletion();
            return undefined;
          },
        }),
      );
      assert.strictEqual(await saveSvg("<svg>日本語</svg>", source), true);
      await Promise.all([writeObserved, completionReported]);
      assert.strictEqual(writtenUri, destination);
      assert.strictEqual(
        new TextDecoder().decode(writtenBytes),
        "<svg>日本語</svg>",
      );
      assert.deepStrictEqual(errors, []);
      assert.strictEqual(information.length, 1);
      assert.ok(
        [en["flow.svg.save.complete"], ja["flow.svg.save.complete"]].includes(
          information[0]?.message ?? "",
        ),
      );
      assert.deepStrictEqual(information[0]?.options, {
        detail: "",
        modal: false,
      });
    } finally {
      overrides.reverse().forEach(({ restore }) => restore());
      fileSystem?.dispose();
    }
  });

  test("reports SVG cancellation and dialog or write failures without success", async () => {
    const source = vscode.Uri.file("/tmp/source.ajs");
    const errors: string[] = [];
    const information: string[] = [];
    let dialogFails = false;
    let writeFails = false;
    const destination = vscode.Uri.parse(
      "flow-svg-failure://workspace/output.svg",
    );
    const overrides: PropertyOverride[] = [];
    let fileSystem: vscode.Disposable | undefined;
    try {
      fileSystem = registerWritableMemoryFileSystem("flow-svg-failure", () => {
        if (writeFails) throw new Error("private write failure");
      });
      overrides.push(
        overrideProperty(vscode.window, "showSaveDialog", {
          value: async () => {
            if (dialogFails) throw new Error("private dialog failure");
            return writeFails ? destination : undefined;
          },
        }),
        overrideProperty(vscode.window, "showErrorMessage", {
          value: async (message: string) => {
            errors.push(message);
            return undefined;
          },
        }),
        overrideProperty(vscode.window, "showInformationMessage", {
          value: async (message: string) => {
            information.push(message);
            return undefined;
          },
        }),
      );
      assert.strictEqual(await saveSvg("<svg/>", source), false);
      assert.ok(
        [en["flow.svg.save.cancelled"], ja["flow.svg.save.cancelled"]].includes(
          information[0] ?? "",
        ),
      );
      dialogFails = true;
      assert.strictEqual(await saveSvg("<svg/>", source), false);
      dialogFails = false;
      writeFails = true;
      assert.strictEqual(await saveSvg("<svg/>", source), false);
      assert.strictEqual(errors.length, 2);
      assert.ok(
        errors.every((message) =>
          [en["flow.svg.save.failed"], ja["flow.svg.save.failed"]].includes(
            message,
          ),
        ),
      );
      assert.ok(errors.every((message) => !message.includes("private")));
      assert.strictEqual(information.length, 1);
    } finally {
      overrides.reverse().forEach(({ restore }) => restore());
      fileSystem?.dispose();
    }
  });

  test("creates viewer subscriptions for both table and flow viewers", () => {
    const context = { subscriptions: [] } as vscode.ExtensionContext;
    const telemetry: TelemetryPort = {
      report() {},
      dispose() {},
    };

    const subscriptions = createViewerSubscriptions({
      context,
      telemetry,
      buildUnitList: () => ({ errors: [] }),
    });

    assert.strictEqual(subscriptions.length, 4);
    assert.strictEqual(new Set(subscriptions).size, subscriptions.length);
    assert.deepStrictEqual(context.subscriptions, []);
    subscriptions.forEach((subscription) => {
      assert.strictEqual(typeof subscription.dispose, "function");
      subscription.dispose();
    });
  });

  test("completes overlapping opens once, reuses a displayed panel, and ignores duplicate acknowledgements", async () => {
    const harness = createViewerLifecycleHarness();
    try {
      harness.setActiveDocument(harness.document);
      const open = harness.commandHandlers.get(`open.${AJS_TABLE_VIEWER_TYPE}`);
      assert.ok(open);
      open();
      open();
      const fixture = harness.panels[0];
      assert.ok(fixture);
      assert.deepStrictEqual(harness.events, []);

      fixture.receive({ type: "display", data: "success" });
      assert.deepStrictEqual(harness.events, []);
      fixture.receive({ type: "ready" });
      await flushMicrotasks();

      assert.deepStrictEqual(harness.events, [
        {
          name: "viewer.open_completed",
          properties: { feature: "table", host: "desktop", result: "success" },
        },
        {
          name: "viewer.open_completed",
          properties: { feature: "table", host: "desktop", result: "success" },
        },
      ]);

      fixture.receive({ type: "display", data: "failed" });
      fixture.receive({ type: "display", data: "success" });
      fixture.receive({ type: "ready" });
      await flushMicrotasks();
      assert.strictEqual(harness.events.length, 2);

      open();
      assert.deepStrictEqual(harness.events[2], {
        name: "viewer.open_completed",
        properties: { feature: "table", host: "desktop", result: "success" },
      });
    } finally {
      harness.restore();
    }
  });

  test("fails a pending open on disposal and ignores a late display acknowledgement", async () => {
    const harness = createViewerLifecycleHarness();
    try {
      harness.setActiveDocument(harness.document);
      harness.commandHandlers.get(`open.${AJS_TABLE_VIEWER_TYPE}`)?.();
      const fixture = harness.panels[0];
      assert.ok(fixture);
      fixture.receive({ type: "ready" });
      await flushMicrotasks();
      fixture.panel.dispose();
      fixture.receive({ type: "display", data: "success" });

      assert.deepStrictEqual(harness.events, [
        {
          name: "viewer.open_completed",
          properties: { feature: "table", host: "desktop", result: "failed" },
        },
      ]);
    } finally {
      harness.restore();
    }
  });

  test("notifies READY transport failures and completes each open as failed once", async () => {
    const failureModes: {
      name: string;
      buildUnitList?: BuildUnitList;
      postMessage?: () => Thenable<boolean>;
    }[] = [
      {
        name: "builder",
        buildUnitList: () => {
          throw new Error("build failed");
        },
      },
      {
        name: "synchronous postMessage",
        postMessage: () => {
          throw new Error("post failed");
        },
      },
    ];

    for (const failureMode of failureModes) {
      const harness = createViewerLifecycleHarness(failureMode);
      try {
        harness.setActiveDocument(harness.document);
        harness.commandHandlers.get(`open.${AJS_TABLE_VIEWER_TYPE}`)?.();
        const fixture = harness.panels[0];
        assert.ok(fixture, failureMode.name);

        fixture.receive({ type: "ready" });
        await new Promise((resolve) => setTimeout(resolve, 0));

        assert.deepStrictEqual(harness.errorMessages, [
          "The viewer document could not be refreshed.",
        ]);
        assert.deepStrictEqual(harness.events, [
          {
            name: "viewer.open_completed",
            properties: {
              feature: "table",
              host: "desktop",
              result: "failed",
            },
          },
        ]);
      } finally {
        harness.restore();
      }
    }
  });

  test("reveals an existing counterpart immediately", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      viewColumn: vscode.ViewColumn.Beside,
      reveal: () => calls.push("reveal"),
      webview: {
        postMessage: (message: {
          type: string;
          data: { absolutePath: string };
        }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
      },
    } as unknown as vscode.WebviewPanel;
    const factory = {
      getExistingPanel: () => panel,
      getPanel: () => {
        throw new Error("existing panel should be reused");
      },
    } as unknown as ViewerFactory;

    revealCounterpartPanel(
      {
        document,
        targetViewType: AJS_FLOW_VIEWER_TYPE,
        absolutePath: "/root/job",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel: new WeakMap(),
      }),
    );

    assert.deepStrictEqual(calls, ["reveal", "post:revealUnit:/root/job"]);
  });

  test("drops pending state when an existing counterpart is disposed", () => {
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      viewColumn: vscode.ViewColumn.Beside,
      reveal: () => {
        throw new Error("panel disposed");
      },
      webview: { postMessage: () => undefined },
    } as unknown as vscode.WebviewPanel;
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();
    pendingRevealByPanel.set(panel, "/root/old");
    const factory = {
      getExistingPanel: () => panel,
      getPanel: () => {
        throw new Error("disposed panel should not be replaced here");
      },
    } as unknown as ViewerFactory;

    assert.throws(() =>
      revealCounterpartPanel(
        {
          document,
          targetViewType: AJS_FLOW_VIEWER_TYPE,
          absolutePath: "/root/latest",
        },
        createCounterpartRevealDeps({
          factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
          mountPanel: () => undefined,
          pendingRevealByPanel,
        }),
      ),
    );

    assert.strictEqual(pendingRevealByPanel.has(panel), false);
  });

  test("runs ready callbacks and consumes a pending reveal once", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const createPanel = (): vscode.WebviewPanel =>
      ({
        viewColumn: vscode.ViewColumn.Beside,
        webview: {
          postMessage: (message: {
            type: string;
            data: { absolutePath: string };
          }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
        },
      }) as unknown as vscode.WebviewPanel;
    const commandPanel = createPanel();
    const navigationPanel = createPanel();
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();
    pendingRevealByPanel.set(navigationPanel, "/root/job");

    const onReady = createViewerReadyHandler(
      (_document, panel) => {
        calls.push(
          `ready:${panel === navigationPanel ? "navigation" : "command"}`,
        );
      },
      pendingRevealByPanel,
      (_document, panel) =>
        calls.push(
          `flow-ready:${panel === navigationPanel ? "navigation" : "command"}`,
        ),
    );

    onReady(document, commandPanel);
    onReady(document, navigationPanel);
    onReady(document, navigationPanel);

    assert.deepStrictEqual(calls, [
      "ready:command",
      "flow-ready:command",
      "ready:navigation",
      "flow-ready:navigation",
      "post:revealUnit:/root/job",
      "ready:navigation",
      "flow-ready:navigation",
    ]);
    assert.strictEqual(pendingRevealByPanel.has(navigationPanel), false);
  });

  test("opens a missing flow panel and reveals after document readiness", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      viewColumn: vscode.ViewColumn.Beside,
      reveal: () => calls.push("reveal"),
      webview: {
        postMessage: (message: {
          type: string;
          data: { absolutePath: string };
        }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
      },
    } as unknown as vscode.WebviewPanel;
    let opened = false;
    const factory = {
      getExistingPanel: () => (opened ? panel : undefined),
      getPanel: () => panel,
    } as unknown as ViewerFactory;
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();

    revealCounterpartPanel(
      {
        document,
        targetViewType: AJS_FLOW_VIEWER_TYPE,
        absolutePath: "/root/job",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
        mountPanel: () => {
          opened = true;
          calls.push("mount");
        },
        onOpenStarted: (_panel, viewType) => calls.push(`open:${viewType}`),
        pendingRevealByPanel,
      }),
    );

    assert.deepStrictEqual(calls, [
      `open:${AJS_FLOW_VIEWER_TYPE}`,
      "mount",
      "reveal",
    ]);
    revealCounterpartPanel(
      {
        document,
        targetViewType: AJS_FLOW_VIEWER_TYPE,
        absolutePath: "/root/latest",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel,
      }),
    );
    assert.deepStrictEqual(calls, [
      `open:${AJS_FLOW_VIEWER_TYPE}`,
      "mount",
      "reveal",
      "reveal",
    ]);
    createViewerReadyHandler(() => {
      calls.push("document");
    }, pendingRevealByPanel)(document, panel);
    assert.deepStrictEqual(calls, [
      `open:${AJS_FLOW_VIEWER_TYPE}`,
      "mount",
      "reveal",
      "reveal",
      "document",
      "post:revealUnit:/root/latest",
    ]);
  });

  test("opens a missing table panel and reveals after document readiness", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      viewColumn: vscode.ViewColumn.Beside,
      reveal: () => calls.push("reveal"),
      webview: {
        postMessage: (message: {
          type: string;
          data: { absolutePath: string };
        }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
      },
    } as unknown as vscode.WebviewPanel;
    const factory = {
      getExistingPanel: () => undefined,
      getPanel: () => panel,
    } as unknown as ViewerFactory;
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();

    revealCounterpartPanel(
      {
        document,
        targetViewType: AJS_TABLE_VIEWER_TYPE,
        absolutePath: "/root/job",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map([[AJS_TABLE_VIEWER_TYPE, factory]]),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel,
      }),
    );

    assert.deepStrictEqual(calls, ["mount", "reveal"]);
    createViewerReadyHandler(() => {
      calls.push("document");
    }, pendingRevealByPanel)(document, panel);
    assert.deepStrictEqual(calls, [
      "mount",
      "reveal",
      "document",
      "post:revealUnit:/root/job",
    ]);
  });

  test("cleans up pending reveal state when counterpart setup fails", () => {
    const document = { uri: {} } as vscode.TextDocument;
    const failureModes = [
      {
        name: "mount",
        mountPanel: (calls: string[]) => {
          calls.push("mount");
          throw new Error("mount failed");
        },
        revealPanel: (calls: string[]) => calls.push("reveal"),
        expectedCalls: ["mount", "dispose"],
      },
      {
        name: "reveal",
        mountPanel: (calls: string[]) => calls.push("mount"),
        revealPanel: (calls: string[]) => {
          calls.push("reveal");
          throw new Error("reveal failed");
        },
        expectedCalls: ["mount", "reveal", "dispose"],
      },
    ];

    failureModes.forEach(({ name, mountPanel, revealPanel, expectedCalls }) => {
      const calls: string[] = [];
      const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();
      const panel = {
        viewColumn: vscode.ViewColumn.Beside,
        reveal: () => revealPanel(calls),
        dispose: () => calls.push("dispose"),
      } as unknown as vscode.WebviewPanel;
      const factory = {
        getExistingPanel: () => undefined,
        getPanel: () => panel,
      } as unknown as ViewerFactory;

      assert.throws(() =>
        revealCounterpartPanel(
          {
            document,
            targetViewType: AJS_FLOW_VIEWER_TYPE,
            absolutePath: `/root/${name}`,
          },
          createCounterpartRevealDeps({
            factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
            mountPanel: () => mountPanel(calls),
            pendingRevealByPanel,
          }),
        ),
      );

      assert.deepStrictEqual(calls, expectedCalls);
      assert.strictEqual(pendingRevealByPanel.has(panel), false);
    });
  });

  test("flushes a pending reveal when lifecycle telemetry fails", () => {
    const calls: string[] = [];
    const document = { uri: {} } as vscode.TextDocument;
    const panel = {
      webview: {
        postMessage: (message: {
          type: string;
          data: { absolutePath: string };
        }) => calls.push(`post:${message.type}:${message.data.absolutePath}`),
      },
    } as unknown as vscode.WebviewPanel;
    const pendingRevealByPanel = new WeakMap<vscode.WebviewPanel, string>();
    pendingRevealByPanel.set(panel, "/root/job");

    const onReady = createViewerReadyHandler(
      () => {
        calls.push("ready");
      },
      pendingRevealByPanel,
      () => {
        throw new Error("telemetry failed");
      },
    );

    assert.doesNotThrow(() => onReady(document, panel));
    assert.deepStrictEqual(calls, ["ready", "post:revealUnit:/root/job"]);
    assert.strictEqual(pendingRevealByPanel.has(panel), false);
  });

  test("keeps state stable when a target factory is unavailable", () => {
    const calls: string[] = [];
    revealCounterpartPanel(
      {
        document: { uri: {} } as vscode.TextDocument,
        targetViewType: AJS_FLOW_VIEWER_TYPE,
        absolutePath: "/root/job",
      },
      createCounterpartRevealDeps({
        factoryByViewType: new Map(),
        mountPanel: () => calls.push("mount"),
        pendingRevealByPanel: new WeakMap(),
      }),
    );
    assert.deepStrictEqual(calls, []);
  });

  test("keeps state stable when the existing-panel lookup fails", () => {
    const calls: string[] = [];
    const factory = {
      getExistingPanel: () => {
        throw new Error("context unavailable");
      },
      getPanel: () => {
        calls.push("getPanel");
        throw new Error("getPanel should not be called");
      },
    } as unknown as ViewerFactory;

    assert.doesNotThrow(() =>
      revealCounterpartPanel(
        {
          document: { uri: {} } as vscode.TextDocument,
          targetViewType: AJS_FLOW_VIEWER_TYPE,
          absolutePath: "/root/job",
        },
        createCounterpartRevealDeps({
          factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
          mountPanel: () => calls.push("mount"),
          pendingRevealByPanel: new WeakMap(),
        }),
      ),
    );
    assert.deepStrictEqual(calls, ["getPanel"]);
  });

  test("keeps state stable when the counterpart context cannot create a panel", () => {
    const calls: string[] = [];
    const factory = {
      getExistingPanel: () => undefined,
      getPanel: () => {
        throw new Error("context unavailable");
      },
    } as unknown as ViewerFactory;

    assert.doesNotThrow(() =>
      revealCounterpartPanel(
        {
          document: { uri: {} } as vscode.TextDocument,
          targetViewType: AJS_FLOW_VIEWER_TYPE,
          absolutePath: "/root/job",
        },
        createCounterpartRevealDeps({
          factoryByViewType: new Map([[AJS_FLOW_VIEWER_TYPE, factory]]),
          mountPanel: () => calls.push("mount"),
          onOpenStarted: () => calls.push("open"),
          pendingRevealByPanel: new WeakMap(),
        }),
      ),
    );
    assert.deepStrictEqual(calls, []);
  });
});
