import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { Telemetry } from "../constant";
import { registerHoverProvider } from "../languages/registerHoverProvider";
import { registerDiagnostics } from "../diagnostics/registerDiagnostics";
import { createTelemetry } from "../telemetry/createTelemetry";
import { createViewerSubscriptions } from "./viewerWiring";

export type ActivatedExtension = {
  myExtension: MyExtension;
};

export const activateExtension = (
  context: vscode.ExtensionContext,
): ActivatedExtension => {
  const telemetry = createTelemetry();
  const myExtension = MyExtension.init(context, telemetry);

  context.subscriptions.push(
    registerDiagnostics(),
    registerHoverProvider(),
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
