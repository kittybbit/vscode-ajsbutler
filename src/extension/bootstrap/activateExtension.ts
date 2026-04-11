import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import {
  reportExtensionActivated,
  reportAndDisposeExtensionRuntime,
} from "./extensionLifecycle";
import { createExtensionRuntime } from "./extensionRuntime";
import { createExtensionSubscriptions } from "./extensionSubscriptions";

export type ActivatedExtension = {
  myExtension: MyExtension;
};

export const activateExtension = (
  context: vscode.ExtensionContext,
): ActivatedExtension => {
  const myExtension = createExtensionRuntime(context);

  context.subscriptions.push(
    ...createExtensionSubscriptions(myExtension.context, myExtension.telemetry),
  );

  reportExtensionActivated(myExtension);

  return {
    myExtension,
  };
};

export const deactivateExtension = (
  activatedExtension: ActivatedExtension | undefined,
): void => {
  reportAndDisposeExtensionRuntime(activatedExtension?.myExtension);
};
