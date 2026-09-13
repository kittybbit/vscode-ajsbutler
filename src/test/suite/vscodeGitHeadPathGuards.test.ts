import * as assert from "assert";
import * as vscode from "vscode";
import {
  candidateChanges,
  normalizePath,
  sourcePathFor,
  type GitChange,
  type GitRepositoryState,
} from "../../infrastructure/git/VscodeGitHeadPathGuards";

const rootUri = vscode.Uri.parse("file:///workspace/project");
const activeUri = vscode.Uri.parse("file:///workspace/project/definition.ajs");
const originalUri = vscode.Uri.parse("file:///workspace/project/old.ajs");

suite("Git HEAD path guard seam", () => {
  test("normalizes nested paths and rejects traversal or outside paths", () => {
    assert.deepStrictEqual(
      normalizePath("\\workspace\\project\\nested\\a.ajs"),
      ["workspace", "project", "nested", "a.ajs"],
    );
    assert.strictEqual(
      normalizePath("/workspace/project/../secret.ajs"),
      undefined,
    );
    assert.deepStrictEqual(sourcePathFor(rootUri, activeUri), {
      relativePath: "definition.ajs",
      absolutePath: activeUri.fsPath,
    });
    assert.deepStrictEqual(
      sourcePathFor(
        rootUri,
        vscode.Uri.parse("file:///workspace/project/nested/definition.ajs"),
      ),
      {
        relativePath: "nested/definition.ajs",
        absolutePath: vscode.Uri.parse(
          "file:///workspace/project/nested/definition.ajs",
        ).fsPath,
      },
    );
    assert.strictEqual(
      sourcePathFor(
        rootUri,
        vscode.Uri.parse("file:///workspace/project-other/a.ajs"),
      ),
      undefined,
    );
    assert.strictEqual(
      sourcePathFor(
        rootUri,
        vscode.Uri.parse("untitled:///workspace/project/definition.ajs"),
      ),
      undefined,
    );
  });

  test("selects only active, supported rename targets in index-first order", () => {
    const indexRename: GitChange = {
      originalUri,
      renameUri: activeUri,
      status: "INDEX_RENAMED",
    };
    const workingRename: GitChange = {
      originalUri: vscode.Uri.parse("file:///workspace/project/working.ajs"),
      renameUri: activeUri,
      status: "DELETED",
    };
    const changes: GitRepositoryState = {
      indexChanges: [
        indexRename,
        { ...indexRename, status: "INDEX_COPIED" },
        {
          ...indexRename,
          renameUri: vscode.Uri.parse("file:///workspace/project/other.ajs"),
        },
      ],
      workingTreeChanges: [
        workingRename,
        { ...workingRename, status: "OTHER" },
        {
          ...workingRename,
          originalUri:
            "file:///workspace/project/not-uri.ajs" as unknown as vscode.Uri,
        },
      ],
    };
    const candidates = candidateChanges({
      state: changes,
      activeUri,
      rootUri,
    });
    assert.strictEqual(candidates.length, 2);
    assert.deepStrictEqual(
      candidates.map((candidate) => [
        candidate.originalUri.fsPath,
        candidate.status,
      ]),
      [
        [originalUri.fsPath, "INDEX_RENAMED"],
        [workingRename.originalUri!.fsPath, "DELETED"],
      ],
    );
  });

  test("keeps ambiguity visible to the caller instead of guessing a rename", () => {
    const rename = (path: string): GitChange => ({
      originalUri: vscode.Uri.parse(`file:///workspace/project/${path}`),
      renameUri: activeUri,
      status: 3,
    });
    const candidates = candidateChanges({
      state: {
        indexChanges: [rename("first.ajs"), rename("second.ajs")],
        workingTreeChanges: [],
      },
      activeUri,
      rootUri,
    });
    assert.strictEqual(candidates.length, 2);
  });
});
