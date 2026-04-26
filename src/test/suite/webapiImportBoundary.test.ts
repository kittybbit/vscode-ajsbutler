import * as assert from "assert";
import { readFileSync } from "fs";
import { join } from "path";

suite("WebAPI import boundaries", () => {
  test("keeps application WebAPI import free of runtime adapter dependencies", () => {
    const source = readFileSync(
      join(
        __dirname,
        "../../application/webapi-import/importAjsDefinitionViaWebApi.js",
      ),
      "utf8",
    );

    const forbiddenImports = [
      "vscode",
      "node:",
      "infrastructure/webapi",
      "generated/jp1Ajs3WebApi",
      "ui-component",
      "webview",
      "react",
      "Prism",
    ];

    forbiddenImports.forEach((forbiddenImport) => {
      assert.ok(
        !source.includes(forbiddenImport),
        `application WebAPI import must not include ${forbiddenImport}`,
      );
    });
  });
});
