import * as assert from "assert";
import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import * as vscode from "vscode";
import { createBuildUnitList } from "../../application/unit-list/buildUnitList";
import { testAjsParser } from "../support/parseAjs";

const decodedDefinition = `unit=ルート,,jp1admin,;
{
  ty=g;
  unit=ジョブ,,jp1admin,;
  {
    ty=j;
  }
}
`;

const shiftJisDefinitionBase64 =
  "dW5pdD2Di4Fbg2csLGpwMWFkbWluLDsKewogIHR5PWc7CiAgdW5pdD2DV4OHg3UsLGpwMWFkbWluLDsKICB7CiAgICB0eT1qOwogIH0KfQo=";

const buildUnitList = createBuildUnitList(testAjsParser);

const readProjectionThroughVsCode = async (
  filePath: string,
  encoding: string,
): Promise<string[]> => {
  const filesConfiguration = vscode.workspace.getConfiguration("files");
  await filesConfiguration.update(
    "encoding",
    encoding,
    vscode.ConfigurationTarget.Global,
  );
  const document = await vscode.workspace.openTextDocument(filePath);
  const result = buildUnitList(document.getText());
  assert.deepStrictEqual(result.errors, []);
  return result.document?.unitList.rows.map((row) => row.absolutePath) ?? [];
};

suite("Unit list host encoding", () => {
  test("projects equivalent UTF-8 and Shift_JIS documents decoded by VS Code", async () => {
    const fixtureDirectory = mkdtempSync(join(tmpdir(), "ajsbutler-encoding-"));
    const utf8Path = join(fixtureDirectory, "definition-utf8.ajs");
    const shiftJisPath = join(fixtureDirectory, "definition-shiftjis.ajs");
    const filesConfiguration = vscode.workspace.getConfiguration("files");
    const previousEncoding = filesConfiguration.get<string>("encoding");
    writeFileSync(utf8Path, decodedDefinition, "utf8");
    writeFileSync(
      shiftJisPath,
      Buffer.from(shiftJisDefinitionBase64, "base64"),
    );

    try {
      const utf8Rows = await readProjectionThroughVsCode(utf8Path, "utf8");
      const shiftJisRows = await readProjectionThroughVsCode(
        shiftJisPath,
        "shiftjis",
      );

      assert.deepStrictEqual(utf8Rows, ["/ルート", "/ルート/ジョブ"]);
      assert.deepStrictEqual(shiftJisRows, utf8Rows);
    } finally {
      await filesConfiguration.update(
        "encoding",
        previousEncoding,
        vscode.ConfigurationTarget.Global,
      );
      rmSync(fixtureDirectory, { recursive: true, force: true });
    }
  });
});
