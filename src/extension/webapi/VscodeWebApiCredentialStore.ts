import * as vscode from "vscode";
import type {
  Jp1Ajs3WebApiCredential,
  Jp1Ajs3WebApiCredentialProvider,
} from "../../infrastructure/webapi/Jp1Ajs3WebApiImportAdapter";

export class VscodeWebApiCredentialStore
  implements Jp1Ajs3WebApiCredentialProvider
{
  #secrets: vscode.SecretStorage;

  constructor(secrets: vscode.SecretStorage) {
    this.#secrets = secrets;
  }

  async storeCredential(
    credentialRef: string,
    credential: Jp1Ajs3WebApiCredential,
  ): Promise<void> {
    await this.#secrets.store(credentialRef, JSON.stringify(credential));
  }

  async resolveCredential(
    credentialRef: string | undefined,
  ): Promise<Jp1Ajs3WebApiCredential | undefined> {
    if (!credentialRef) {
      return undefined;
    }

    const serialized = await this.#secrets.get(credentialRef);
    if (!serialized) {
      return undefined;
    }

    try {
      const credential = JSON.parse(
        serialized,
      ) as Partial<Jp1Ajs3WebApiCredential>;
      if (
        typeof credential.username === "string" &&
        typeof credential.password === "string"
      ) {
        return {
          username: credential.username,
          password: credential.password,
        };
      }
    } catch {
      return undefined;
    }

    return undefined;
  }
}
