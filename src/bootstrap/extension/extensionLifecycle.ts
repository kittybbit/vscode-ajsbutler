import {
  createTelemetryEvent,
  telemetryEvents,
} from "../../application/telemetry/telemetryEvent";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";
import { MyExtension } from "./MyExtension";

export const reportExtensionActivated = (myExtension: MyExtension): void => {
  myExtension.telemetry.report(
    createTelemetryEvent(telemetryEvents.legacyExtensionActivated, {
      development: DEVELOPMENT,
    }),
  );
  const event = createTelemetryEvent(
    telemetryEvents.extensionLifecycleActivated,
    {
      development: DEVELOPMENT,
      host: getTelemetryHost(),
      result: "success",
    },
  );
  myExtension.telemetry.report(event);
};

export const reportAndDisposeExtensionRuntime = (
  myExtension: MyExtension | undefined,
): void => {
  if (!myExtension) {
    return;
  }

  myExtension.telemetry.report(
    createTelemetryEvent(telemetryEvents.legacyExtensionDeactivated, {
      development: DEVELOPMENT,
    }),
  );
  const event = createTelemetryEvent(
    telemetryEvents.extensionLifecycleDeactivated,
    {
      development: DEVELOPMENT,
      host: getTelemetryHost(),
      result: "success",
    },
  );
  myExtension.telemetry.report(event);
  myExtension.dispose();
};
