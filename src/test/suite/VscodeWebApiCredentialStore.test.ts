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
  test("derives the stable import reference, stores credentials, and resolves them", async () => {
    const store = new VscodeWebApiCredentialStore(createSecretStorage());

    const credentialRef = await store.storeCredentialForImport(
      { baseUrl: " HTTPS://Web-Console.Example.com:22252 " },
      {
        manager: " Manager.Example.com ",
        serviceName: " AJSROOT1 ",
        location: "/JobGroup",
      },
      {
        username: "jp1admin",
        password: "secret",
      },
    );

    assert.strictEqual(
      credentialRef,
      "jp1-ajs-webapi:https%3A%2F%2Fweb-console.example.com%3A22252:manager.example.com:ajsroot1",
    );
    assert.deepStrictEqual(await store.resolveCredential(credentialRef), {
      username: "jp1admin",
      password: "secret",
    });
  });

  test("preserves credential-store write rejections", async () => {
    const expected = new Error("secret storage unavailable");
    const store = new VscodeWebApiCredentialStore({
      async get() {
        return undefined;
      },
      async store() {
        throw expected;
      },
      async delete() {},
      onDidChange: () => ({ dispose() {} }),
    } as vscode.SecretStorage);

    await assert.rejects(
      store.storeCredentialForImport(
        { baseUrl: "https://web-console.example.com:22252" },
        {
          manager: "manager.example.com",
          serviceName: "AJSROOT1",
          location: "/JobGroup",
        },
        { username: "jp1admin", password: "secret" },
      ),
      (error) => error === expected,
    );
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
