import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import { collectImportReferencesFromSource } from "../support/architectureSourceAnalysis";

const repoRoot = path.resolve(__dirname, "../../..");

const semanticDiffAdapterRoot = path.join(
  repoRoot,
  "src/presentation/vscode/semantic-diff",
);
const semanticDiffPresentationRoot = path.join(
  repoRoot,
  "src/presentation/semantic-diff",
);
const semanticDiffPresentationReportRoot = path.join(
  semanticDiffPresentationRoot,
  "report",
);
const semanticDiffPresentationReportFiles = [
  "renderSemanticDiffAuditMarkdown.ts",
  "renderSemanticDiffMarkdown.ts",
  "renderSemanticDiffSummaryMarkdown.ts",
  "semanticDiffJson.ts",
  "semanticDiffJsonOrdering.ts",
  "semanticDiffJsonProjection.ts",
  "semanticDiffJsonValidation.ts",
  "semanticDiffMarkdownLocalization.ts",
  "semanticDiffMarkdownTypes.ts",
  "semanticDiffOutput.ts",
  "semanticDiffReportText.ts",
  "serializeSemanticDiffJson.ts",
] as const;
const semanticDiffPresentationFacades = [
  "pickSemanticDiffOutputMode.ts",
  "presentSemanticDiffOutput.ts",
] as const;
const semanticDiffCategories = [
  "panel",
  "flow",
  "report",
  "source",
  "calendar",
] as const;
const movedSemanticDiffModules = [
  "semanticDiffExplorerPanelActions",
  "semanticDiffExplorerPanelHtml",
  "semanticDiffExplorerPanelInstall",
  "semanticDiffExplorerPanelLifecycle",
  "semanticDiffExplorerPanelRequests",
  "semanticDiffExplorerPanelTransport",
  "semanticDiffExplorerFlowAction",
  "semanticDiffExplorerFlowActionPreparation",
  "semanticDiffExplorerFlowOverlayRegistry",
  "semanticDiffExplorerFlowTargets",
  "semanticDiffExplorerReportAction",
  "semanticDiffExplorerReportActionRunner",
  "semanticDiffExplorerSourceAction",
  "semanticDiffExplorerSourceActionRunner",
  "semanticDiffReportDocument",
] as const;
const scheduleImpactCalendarHostRoot = path.join(
  repoRoot,
  "src/presentation/vscode/semantic-diff/calendar",
);
const scheduleImpactCalendarLegacyRoot = path.join(
  repoRoot,
  "src/presentation/vscode/webview/scheduleImpactCalendar",
);
const scheduleImpactCalendarHostModules = [
  "scheduleImpactCalendarJson.ts",
  "scheduleImpactCalendarPanel.ts",
  "scheduleImpactCalendarPanelRuntime.ts",
  "scheduleImpactCalendarSessionRegistry.ts",
  "scheduleImpactCalendarTransport.ts",
] as const;
const semanticDiffExplorerEditorRoot = path.join(
  repoRoot,
  "src/presentation/webview/editor/semanticDiffExplorer",
);
const sharedResultRoot = path.join(
  repoRoot,
  "src/presentation/webview/editor/shared/result",
);
const sharedResultFiles = [
  "ResultCard.tsx",
  "ResultEmptyState.tsx",
  "ResultKeyValueList.tsx",
  "ResultSection.tsx",
  "ResultStatusChip.tsx",
  "ResultComparison.tsx",
  "formatLocalizedDateRange.ts",
] as const;
const semanticDiffExplorerBrowserModules = [
  "semanticDiffExplorerFocus.ts",
  "semanticDiffExplorerHostMessageState.ts",
  "semanticDiffExplorerHostState.ts",
  "semanticDiffExplorerKeyboard.ts",
  "semanticDiffExplorerLocalization.ts",
  "semanticDiffExplorerDetails.ts",
  "semanticDiffExplorerTree.tsx",
  "semanticDiffExplorerTreeData.ts",
  "semanticDiffExplorerView.tsx",
  "semanticDiffExplorerViewState.ts",
] as const;
const semanticDiffBrowserEntries = [
  "src/presentation/webview/editor/scheduleImpactCalendar.tsx",
  "src/presentation/webview/editor/semanticDiffExplorer.tsx",
] as const;

const sourceFilesUnder = (directory: string): string[] =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFilesUnder(entryPath);
    return entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")
      ? [entryPath]
      : [];
  });

const browserGlobalNames = new Set([
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "MutationObserver",
]);

const findHostNeutralBrowserGlobalReferences = (
  filePaths: readonly string[],
): string[] => {
  const program = ts.createProgram({
    rootNames: [...filePaths],
    options: {
      baseUrl: repoRoot,
      jsx: ts.JsxEmit.React,
      lib: ["lib.dom.d.ts", "lib.es2022.d.ts"],
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      paths: {
        "@generate/*": ["src/generate/*"],
        "@resource/*": ["src/resource/*"],
      },
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const checker = program.getTypeChecker();

  return filePaths.flatMap((filePath) => {
    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) return [];
    const references: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isIdentifier(node) && browserGlobalNames.has(node.text)) {
        const symbol = checker.getSymbolAtLocation(node);
        const isDomSymbol = symbol?.declarations?.some((declaration) =>
          /[\\/]lib\.dom(?:\.iterable)?\.d\.ts$/u.test(
            declaration.getSourceFile().fileName,
          ),
        );
        if (isDomSymbol) {
          references.push(
            `${path.relative(repoRoot, filePath)}:${sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1}`,
          );
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return references;
  });
};

const resolveSemanticDiffModule = (
  modulePath: string,
  modules: ReadonlyMap<string, string>,
): string | undefined =>
  [modulePath, `${modulePath}.ts`, `${modulePath}.tsx`]
    .map((candidate) => modules.get(candidate))
    .find((candidate): candidate is string => candidate !== undefined);

const findSemanticDiffAdapterCycles = (): string[][] => {
  const sourceFiles = semanticDiffCategories.flatMap((category) =>
    sourceFilesUnder(path.join(semanticDiffAdapterRoot, category)),
  );
  const modules = new Map<string, string>();
  sourceFiles.forEach((filePath) => {
    const relative = path
      .relative(repoRoot, filePath)
      .split(path.sep)
      .join("/");
    modules.set(relative, relative);
    modules.set(relative.replace(/\.tsx?$/u, ""), relative);
  });
  const graph = new Map<string, string[]>();
  sourceFiles.forEach((filePath) => {
    const file = path.relative(repoRoot, filePath).split(path.sep).join("/");
    const edges = collectImportReferencesFromSource(
      file,
      fs.readFileSync(filePath, "utf8"),
    )
      .map(({ resolvedPath }) =>
        resolvedPath === undefined
          ? undefined
          : resolveSemanticDiffModule(resolvedPath, modules),
      )
      .filter((target): target is string => target !== undefined);
    graph.set(file, edges);
  });
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const cycles: string[][] = [];
  const visit = (node: string, stack: string[]): void => {
    if (visiting.has(node)) {
      cycles.push([...stack.slice(stack.indexOf(node)), node]);
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    graph.get(node)?.forEach((target) => visit(target, [...stack, node]));
    visiting.delete(node);
    visited.add(node);
  };
  graph.forEach((_, node) => visit(node, []));
  return cycles;
};

suite("Architecture Semantic Diff ownership", () => {
  test("keeps Semantic Diff adapters under canonical category packages", () => {
    const rootFiles = fs
      .readdirSync(semanticDiffAdapterRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
      .map((entry) => entry.name)
      .sort();
    assert.deepStrictEqual(rootFiles, []);
    semanticDiffCategories.forEach((category) => {
      assert.ok(
        fs.statSync(path.join(semanticDiffAdapterRoot, category)).isDirectory(),
        `${category} must be a canonical Semantic Diff adapter category`,
      );
    });
    assert.ok(
      fs.existsSync(
        path.join(
          semanticDiffAdapterRoot,
          "panel/semanticDiffExplorerConstants.ts",
        ),
      ),
    );
    assert.match(
      fs.readFileSync(
        path.join(
          semanticDiffAdapterRoot,
          "panel/semanticDiffExplorerPanelHtml.ts",
        ),
        "utf8",
      ),
      /semanticDiffExplorerConstants/,
    );
  });

  test("keeps report ownership split between Presentation and VS Code", () => {
    const rootFiles = fs
      .readdirSync(semanticDiffPresentationRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
      .map((entry) => entry.name);
    assert.deepStrictEqual(rootFiles, []);
    assert.deepStrictEqual(
      fs
        .readdirSync(semanticDiffPresentationReportRoot)
        .filter((file) => file.endsWith(".ts"))
        .sort(),
      [...semanticDiffPresentationReportFiles].sort(),
    );
    semanticDiffPresentationFacades.forEach((file) => {
      assert.strictEqual(
        fs.existsSync(path.join(semanticDiffPresentationRoot, file)),
        false,
        `${file} must not remain as a Presentation facade`,
      );
    });

    const reportFiles = sourceFilesUnder(semanticDiffPresentationReportRoot);
    const reportImports = reportFiles.flatMap((filePath) => {
      const file = path.relative(repoRoot, filePath).split(path.sep).join("/");
      return collectImportReferencesFromSource(
        file,
        fs.readFileSync(filePath, "utf8"),
      ).filter(
        ({ specifier }) =>
          specifier === "vscode" ||
          specifier.startsWith("node:") ||
          specifier === "react" ||
          specifier.startsWith("@mui/"),
      );
    });
    assert.deepStrictEqual(reportImports, []);
    assert.deepStrictEqual(
      findHostNeutralBrowserGlobalReferences(reportFiles),
      [],
    );

    const vscodeReportImports = sourceFilesUnder(
      path.join(semanticDiffAdapterRoot, "report"),
    ).flatMap((filePath) => {
      const file = path.relative(repoRoot, filePath).split(path.sep).join("/");
      return collectImportReferencesFromSource(
        file,
        fs.readFileSync(filePath, "utf8"),
      ).filter(({ resolvedPath }) =>
        resolvedPath?.startsWith("src/presentation/semantic-diff/report/"),
      );
    });
    assert.ok(
      vscodeReportImports.length > 0,
      "VS Code report adapters must consume Presentation report modules",
    );
  });

  test("rejects direct imports of moved flat Semantic Diff implementations", () => {
    const imports = sourceFilesUnder(path.join(repoRoot, "src")).flatMap(
      (filePath) => {
        const file = path
          .relative(repoRoot, filePath)
          .split(path.sep)
          .join("/");
        return collectImportReferencesFromSource(
          file,
          fs.readFileSync(filePath, "utf8"),
        ).filter(({ specifier }) =>
          movedSemanticDiffModules.some((module) =>
            specifier.endsWith(`/semantic-diff/${module}`),
          ),
        );
      },
    );
    assert.deepStrictEqual(imports, []);
  });

  test("keeps Calendar and Explorer browser modules in canonical packages", () => {
    scheduleImpactCalendarHostModules.forEach((file) => {
      assert.ok(fs.existsSync(path.join(scheduleImpactCalendarHostRoot, file)));
    });
    assert.strictEqual(
      fs.existsSync(scheduleImpactCalendarLegacyRoot),
      false,
      "Calendar host modules must not remain under generic vscode/webview",
    );
    semanticDiffExplorerBrowserModules.forEach((file) => {
      assert.ok(fs.existsSync(path.join(semanticDiffExplorerEditorRoot, file)));
      assert.strictEqual(
        fs.existsSync(
          path.join(repoRoot, "src/presentation/webview/semantic-diff", file),
        ),
        false,
        `${file} must not remain in the removed browser package`,
      );
    });
    assert.strictEqual(
      fs.existsSync(
        path.join(repoRoot, "src/presentation/webview/semantic-diff"),
      ),
      false,
    );
    assert.strictEqual(
      fs.existsSync(
        path.join(
          semanticDiffExplorerEditorRoot,
          "semanticDiffExplorerThemeMode.ts",
        ),
      ),
      false,
    );

    const staleImports = sourceFilesUnder(path.join(repoRoot, "src")).flatMap(
      (filePath) => {
        const file = path
          .relative(repoRoot, filePath)
          .split(path.sep)
          .join("/");
        return collectImportReferencesFromSource(
          file,
          fs.readFileSync(filePath, "utf8"),
        ).filter(
          ({ specifier }) =>
            specifier.includes("webview/semantic-diff/semanticDiffExplorer") ||
            specifier.includes("webview/editor/scheduleImpactCalendarBridge") ||
            specifier.includes("/semantic-diff/semanticDiffExplorerFlow") ||
            specifier.includes("/semantic-diff/semanticDiffExplorerPanel") ||
            specifier.includes("/semantic-diff/semanticDiffExplorerRegistry") ||
            /webview\/scheduleImpactCalendar(?:Json|Panel|PanelRuntime|SessionRegistry|Transport)/u.test(
              specifier,
            ),
        );
      },
    );
    assert.deepStrictEqual(staleImports, []);

    const explorerSource = sourceFilesUnder(semanticDiffExplorerEditorRoot).map(
      (filePath) => fs.readFileSync(filePath, "utf8"),
    );
    explorerSource.forEach((source) => {
      assert.strictEqual(
        /matchMedia|MutationObserver|vscode-(?:dark|light)/u.test(source),
        false,
      );
    });

    const webpackSource = fs.readFileSync(
      path.join(repoRoot, "webpack.config.js"),
      "utf8",
    );
    assert.match(
      webpackSource,
      /semanticDiffExplorer:\s*"\.\/src\/presentation\/webview\/editor\/semanticDiffExplorer\.tsx"/u,
    );
    assert.match(
      webpackSource,
      /scheduleImpactCalendar:\s*"\.\/src\/presentation\/webview\/editor\/scheduleImpactCalendar\.tsx"/u,
    );

    const browserImports = [
      ...semanticDiffExplorerBrowserModules.map((file) =>
        path.join(semanticDiffExplorerEditorRoot, file),
      ),
      ...semanticDiffBrowserEntries.map((file) => path.join(repoRoot, file)),
    ].flatMap((filePath) => {
      const relative = path
        .relative(repoRoot, filePath)
        .split(path.sep)
        .join("/");
      return collectImportReferencesFromSource(
        relative,
        fs.readFileSync(filePath, "utf8"),
      ).filter(
        ({ specifier }) =>
          specifier === "vscode" ||
          specifier.startsWith("node:") ||
          specifier.includes("/presentation/vscode/"),
      );
    });
    assert.deepStrictEqual(browserImports, []);

    semanticDiffBrowserEntries.forEach((file) => {
      const source = fs.readFileSync(path.join(repoRoot, file), "utf8");
      assert.match(source, /bootstrapViewer/);
      if (file.endsWith("/semanticDiffExplorer.tsx")) {
        assert.doesNotMatch(source, /export\s+(?:\{|default)/u);
      }
    });
  });

  test("keeps shared result primitives browser-safe and view-owned", () => {
    assert.deepStrictEqual(
      fs
        .readdirSync(sharedResultRoot)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))
        .sort(),
      [...sharedResultFiles].sort(),
    );

    const primitiveFiles = sourceFilesUnder(sharedResultRoot);
    const forbiddenImports = primitiveFiles.flatMap((filePath) => {
      const file = path.relative(repoRoot, filePath).split(path.sep).join("/");
      return collectImportReferencesFromSource(
        file,
        fs.readFileSync(filePath, "utf8"),
      ).filter(
        ({ resolvedPath, specifier }) =>
          specifier === "vscode" ||
          specifier.startsWith("node:") ||
          specifier.startsWith("@resource/") ||
          resolvedPath?.startsWith("src/domain/") ||
          resolvedPath?.startsWith("src/application/") ||
          resolvedPath?.startsWith("src/infrastructure/") ||
          resolvedPath?.startsWith("src/presentation/vscode/"),
      );
    });
    assert.deepStrictEqual(forbiddenImports, []);

    const sharedImportPrefix = "src/presentation/webview/editor/shared/result/";
    const explorerImports = sourceFilesUnder(semanticDiffExplorerEditorRoot)
      .flatMap((filePath) => {
        const file = path
          .relative(repoRoot, filePath)
          .split(path.sep)
          .join("/");
        return collectImportReferencesFromSource(
          file,
          fs.readFileSync(filePath, "utf8"),
        );
      })
      .filter(({ resolvedPath }) =>
        resolvedPath?.startsWith(sharedImportPrefix),
      );
    const calendarImports = sourceFilesUnder(
      path.join(
        repoRoot,
        "src/presentation/webview/editor/scheduleImpactCalendar",
      ),
    )
      .flatMap((filePath) => {
        const file = path
          .relative(repoRoot, filePath)
          .split(path.sep)
          .join("/");
        return collectImportReferencesFromSource(
          file,
          fs.readFileSync(filePath, "utf8"),
        );
      })
      .filter(({ resolvedPath }) =>
        resolvedPath?.startsWith(sharedImportPrefix),
      );
    assert.ok(
      explorerImports.length > 0,
      "Explorer must consume shared result primitives",
    );
    assert.ok(
      calendarImports.length > 0,
      "Calendar must consume shared result primitives",
    );
  });

  test("keeps host-neutral Semantic Diff output free of host dependencies", () => {
    const hostNeutralFiles = sourceFilesUnder(
      semanticDiffPresentationReportRoot,
    );
    const hostNeutralImports = hostNeutralFiles.flatMap((filePath) => {
      const relative = path
        .relative(repoRoot, filePath)
        .split(path.sep)
        .join("/");
      return collectImportReferencesFromSource(
        relative,
        fs.readFileSync(filePath, "utf8"),
      ).filter(
        ({ specifier }) =>
          specifier === "vscode" ||
          specifier.startsWith("node:") ||
          specifier === "react" ||
          specifier.startsWith("@mui/"),
      );
    });
    assert.deepStrictEqual(hostNeutralImports, []);
    assert.deepStrictEqual(
      findHostNeutralBrowserGlobalReferences(hostNeutralFiles),
      [],
    );
  });

  test("keeps Semantic Diff adapter category graph acyclic", () => {
    assert.deepStrictEqual(findSemanticDiffAdapterCycles(), []);
  });
});
