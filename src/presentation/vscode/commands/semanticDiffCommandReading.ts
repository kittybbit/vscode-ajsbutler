import type * as vscode from "vscode";
import type { SemanticDiffCommandDeps } from "./semanticDiffCommand";

const textDecoder = new TextDecoder("utf-8");

export type BeforeFileReadResult =
  | { kind: "ready"; content: string; version: number | null; uri: vscode.Uri }
  | { kind: "failed" };

const readBeforeDocument = async (
  openTextDocument: NonNullable<SemanticDiffCommandDeps["openTextDocument"]>,
  beforeUri: vscode.Uri,
): Promise<BeforeFileReadResult> => {
  try {
    const document = await openTextDocument(beforeUri);
    return {
      kind: "ready",
      content: document.getText(),
      version: typeof document.version === "number" ? document.version : null,
      uri: beforeUri,
    };
  } catch {
    return { kind: "failed" };
  }
};

const readBeforeBytes = async (
  readFile: SemanticDiffCommandDeps["readFile"],
  beforeUri: vscode.Uri,
): Promise<BeforeFileReadResult> => {
  try {
    return {
      kind: "ready",
      content: textDecoder.decode(await readFile(beforeUri)),
      version: null,
      uri: beforeUri,
    };
  } catch {
    return { kind: "failed" };
  }
};

export const readSemanticDiffBeforeFile = (
  deps: SemanticDiffCommandDeps,
  beforeUri: vscode.Uri,
): Promise<BeforeFileReadResult> =>
  deps.openTextDocument
    ? readBeforeDocument(deps.openTextDocument, beforeUri)
    : readBeforeBytes(deps.readFile, beforeUri);
