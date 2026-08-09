import {
  createExtensionLifecycleActivatedEvent,
  createExtensionLifecycleDeactivatedEvent,
  createLegacyExtensionActivatedEvent,
  createLegacyExtensionDeactivatedEvent,
} from "../../application/telemetry/extensionLifecycleTelemetry";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";
import { MyExtension } from "./MyExtension";

export const reportExtensionActivated = (myExtension: MyExtension): void => {
  myExtension.telemetry.report(createLegacyExtensionActivatedEvent());
  myExtension.telemetry.report(
    createExtensionLifecycleActivatedEvent(getTelemetryHost()),
  );
};

export const reportAndDisposeExtensionRuntime = (
  myExtension: MyExtension | undefined,
): void => {
  if (!myExtension) {
    return;
  }

  myExtension.telemetry.report(createLegacyExtensionDeactivatedEvent());
  myExtension.telemetry.report(
    createExtensionLifecycleDeactivatedEvent(getTelemetryHost()),
  );
  myExtension.dispose();
};
