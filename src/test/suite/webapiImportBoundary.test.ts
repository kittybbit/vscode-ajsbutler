import * as assert from "assert";
import { readFileSync } from "fs";
import { join } from "path";

suite("WebAPI import boundaries", () => {
  test("keeps application WebAPI import free of adapter and HTTP semantics", () => {
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
      "webview",
      "react",
      "Prism",
      "/ajs/api/v1",
      "searchTarget",
      "X-AJS-Authorization",
    ];

    forbiddenImports.forEach((forbiddenImport) => {
      assert.ok(
        !source.includes(forbiddenImport),
        `application WebAPI import must not include ${forbiddenImport}`,
      );
    });
  });

  test("keeps presentation free of transport and credential persistence", () => {
    const source = readFileSync(
      join(
        __dirname,
        "../../presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.js",
      ),
      "utf8",
    );

    [
      "buildCredentialRef",
      "storeCredential",
      "importPort",
      "/ajs/api/v1",
      "searchTarget",
      "X-AJS-Authorization",
    ].forEach((forbiddenSemantic) => {
      assert.ok(
        !source.includes(forbiddenSemantic),
        `presentation WebAPI import must not include ${forbiddenSemantic}`,
      );
    });
  });
});
