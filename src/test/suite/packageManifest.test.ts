import * as assert from "assert";
import { readFileSync } from "fs";
import { join } from "path";

type CommandContribution = {
  command: string;
  icon?: string;
};

type MenuContribution = {
  command: string;
  group?: string;
  when?: string;
};

type PackageJson = {
  activationEvents: string[];
  contributes: {
    commands: CommandContribution[];
    menus: {
      "editor/title": MenuContribution[];
    };
  };
};

function readPackageJson(): PackageJson {
  return JSON.parse(
    readFileSync(join(__dirname, "../../..", "package.json"), "utf8"),
  ) as PackageJson;
}

suite("Package manifest", () => {
  test("uses detail-pane aligned codicons for editor title viewer commands", () => {
    const commands = readPackageJson().contributes.commands;
    const byCommand = new Map(
      commands.map((command) => [command.command, command]),
    );

    assert.strictEqual(
      byCommand.get("open.ajsbutler.flowViewer")?.icon,
      "$(type-hierarchy)",
    );
    assert.strictEqual(
      byCommand.get("open.ajsbutler.tableViewer")?.icon,
      "$(table)",
    );
  });

  test("contributes semantic diff command and activation event", () => {
    const manifest = readPackageJson();
    const byCommand = new Map(
      manifest.contributes.commands.map((command) => [
        command.command,
        command,
      ]),
    );

    assert.strictEqual(
      byCommand.get("ajsbutler.compareSemanticDiff")?.icon,
      "$(diff)",
    );
    assert.ok(
      manifest.activationEvents.includes(
        "onCommand:ajsbutler.compareSemanticDiff",
      ),
    );
  });

  test("contributes semantic diff command to JP1/AJS editor title", () => {
    const editorTitleItems =
      readPackageJson().contributes.menus["editor/title"];

    assert.deepStrictEqual(
      editorTitleItems.filter((item) =>
        [
          "open.ajsbutler.flowViewer",
          "open.ajsbutler.tableViewer",
          "ajsbutler.compareSemanticDiff",
        ].includes(item.command),
      ),
      [
        {
          when: "editorLangId == 'jp1ajs'",
          command: "open.ajsbutler.flowViewer",
          group: "navigation",
        },
        {
          when: "editorLangId == 'jp1ajs'",
          command: "open.ajsbutler.tableViewer",
          group: "navigation",
        },
        {
          when: "editorLangId == 'jp1ajs'",
          command: "ajsbutler.compareSemanticDiff",
          group: "navigation",
        },
      ],
    );
  });
});
