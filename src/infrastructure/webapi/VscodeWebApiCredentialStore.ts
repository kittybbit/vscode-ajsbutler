import * as vscode from "vscode";
import type {
  Jp1Ajs3WebApiCredential,
  Jp1Ajs3WebApiCredentialProvider,
} from "./Jp1Ajs3WebApiImportAdapter";

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
    return parseStoredCredential(serialized);
  }
}

const parseStoredCredential = (
  serialized: string | undefined,
): Jp1Ajs3WebApiCredential | undefined => {
  if (!serialized) {
    return undefined;
  }

  try {
    return toCredential(JSON.parse(serialized));
  } catch {
    return undefined;
  }
};

const toCredential = (value: unknown): Jp1Ajs3WebApiCredential | undefined => {
  if (!isCredentialLike(value)) {
    return undefined;
  }

  return {
    username: value.username,
    password: value.password,
  };
};

const isCredentialLike = (value: unknown): value is Jp1Ajs3WebApiCredential =>
  isRecord(value) &&
  hasStringProperty(value, "username") &&
  hasStringProperty(value, "password");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasStringProperty = (
  value: Record<string, unknown>,
  key: string,
): boolean => typeof value[key] === "string";
