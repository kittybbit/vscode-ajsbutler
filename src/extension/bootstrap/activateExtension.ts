import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { Telemetry } from "../constant";
import { createEditorAdapterSubscriptions } from "./editorAdapterWiring";
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

  myExtension.telemetry.trackEvent(Telemetry.ExtensionActivate, {
    development: String(DEVELOPMENT),
  });

  return {
    myExtension,
  };
};

export const deactivateExtension = (
  activatedExtension: ActivatedExtension | undefined,
): void => {
  const telemetry = activatedExtension?.myExtension.telemetry;
  if (telemetry) {
    telemetry.trackEvent(Telemetry.ExtensionDeactivate, {
      development: String(DEVELOPMENT),
    });
    activatedExtension?.myExtension.dispose();
  }
};
