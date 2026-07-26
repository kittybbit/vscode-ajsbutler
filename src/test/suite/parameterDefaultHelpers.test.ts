import * as assert from "assert";
import { resolveHttpConnectionJobEuDefaultRawValue } from "../../domain/models/parameters/httpConnectionJobDefaultHelpers";
import {
  resolveConnectorControlDefaultRawValue,
  resolveRootJobnetDefaultRawValue,
} from "../../domain/models/parameters/parameterDefaultHelpers";

suite("Parameter default helpers", () => {
  test("resolves root-jobnet and connector-control defaults", () => {
    assert.strictEqual(resolveRootJobnetDefaultRawValue("rg", true), "1");
    assert.strictEqual(resolveRootJobnetDefaultRawValue("sd", true), "en");
    assert.strictEqual(resolveRootJobnetDefaultRawValue("ncl", true), "n");
    assert.strictEqual(resolveRootJobnetDefaultRawValue("ncs", true), "n");
    assert.strictEqual(resolveRootJobnetDefaultRawValue("ncex", true), "n");
    assert.strictEqual(
      resolveRootJobnetDefaultRawValue("rg", false),
      undefined,
    );

    assert.strictEqual(
      resolveConnectorControlDefaultRawValue("ncl", "always"),
      "n",
    );
    assert.strictEqual(
      resolveConnectorControlDefaultRawValue("ncs", "root-jobnet-only", true),
      "n",
    );
    assert.strictEqual(
      resolveConnectorControlDefaultRawValue("ncex", "root-jobnet-only", false),
      undefined,
    );
  });

  test("resolves the HTTP connection job execution-user default", () => {
    assert.strictEqual(resolveHttpConnectionJobEuDefaultRawValue(), "def");
  });
});
