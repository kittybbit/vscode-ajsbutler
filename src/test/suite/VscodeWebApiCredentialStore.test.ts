import * as assert from "assert";
import * as vscode from "vscode";
import { VscodeWebApiCredentialStore } from "../../infrastructure/webapi/VscodeWebApiCredentialStore";

const createSecretStorage = (
  initialValues: Record<string, string | undefined> = {},
): vscode.SecretStorage => {
  const values = new Map(Object.entries(initialValues));
  return {
    async get(key) {
      return values.get(key);
    },
    async store(key, value) {
      values.set(key, value);
    },
    async delete(key) {
      values.delete(key);
    },
    onDidChange: () => ({
      dispose() {
        // Test double.
      },
    }),
  } as vscode.SecretStorage;
};

suite("VS Code WebAPI credential store", () => {
  test("stores credentials as JSON and resolves valid stored credentials", async () => {
    const store = new VscodeWebApiCredentialStore(createSecretStorage());

    await store.storeCredential("credential-ref", {
      username: "jp1admin",
      password: "secret",
    });

    assert.deepStrictEqual(await store.resolveCredential("credential-ref"), {
      username: "jp1admin",
      password: "secret",
    });
  });

  test("returns undefined for missing refs, missing secrets, malformed JSON, and invalid shapes", async () => {
    const store = new VscodeWebApiCredentialStore(
      createSecretStorage({
        malformed: "{",
        missingPassword: JSON.stringify({ username: "jp1admin" }),
        nonStringPassword: JSON.stringify({
          username: "jp1admin",
          password: 123,
        }),
      }),
    );

    assert.strictEqual(await store.resolveCredential(undefined), undefined);
    assert.strictEqual(await store.resolveCredential("missing"), undefined);
    assert.strictEqual(await store.resolveCredential("malformed"), undefined);
    assert.strictEqual(
      await store.resolveCredential("missingPassword"),
      undefined,
    );
    assert.strictEqual(
      await store.resolveCredential("nonStringPassword"),
      undefined,
    );
  });
});
