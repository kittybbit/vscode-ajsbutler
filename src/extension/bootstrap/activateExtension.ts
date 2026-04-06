import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { createEditorAdapterSubscriptions } from "./editorAdapterWiring";
import {
  deactivateExtensionRuntime,
  reportExtensionActivated,
} from "./extensionLifecycle";
import { createExtensionRuntime } from "./extensionRuntime";
import { createViewerSubscriptions } from "./viewerWiring";

export type ActivatedExtension = {
  myExtension: MyExtension;
};

export const activateExtension = (
  context: vscode.ExtensionContext,
): ActivatedExtension => {
  const myExtension = createExtensionRuntime(context);

  context.subscriptions.push(
    ...createEditorAdapterSubscriptions(),
    ...createViewerSubscriptions(myExtension),
  );

  reportExtensionActivated(myExtension);

  return {
    myExtension,
  };
};

export const deactivateExtension = (
  activatedExtension: ActivatedExtension | undefined,
): void => {
  deactivateExtensionRuntime(activatedExtension?.myExtension);
};
