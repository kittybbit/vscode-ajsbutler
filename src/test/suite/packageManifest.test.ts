import * as assert from "assert";
import { readFileSync } from "fs";
import { join } from "path";

type CommandContribution = {
  command: string;
  icon?: string;
};

type PackageJson = {
  contributes: {
    commands: CommandContribution[];
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
});
