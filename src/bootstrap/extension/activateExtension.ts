import * as vscode from "vscode";
import { MyExtension } from "./MyExtension";
import { createExtensionDependencies } from "./extensionDependencies";
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
  const dependencies = createExtensionDependencies(context);
  const myExtension = createExtensionRuntime(context, dependencies.telemetry);

  context.subscriptions.push(
    ...createExtensionSubscriptions(myExtension.context, dependencies),
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
