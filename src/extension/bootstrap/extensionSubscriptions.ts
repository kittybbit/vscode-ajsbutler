import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { createEditorAdapterSubscriptions } from "./editorAdapterWiring";
import { createViewerSubscriptions } from "./viewerWiring";

export const createExtensionSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => [
  ...createEditorAdapterSubscriptions(),
  ...createViewerSubscriptions(myExtension),
];
