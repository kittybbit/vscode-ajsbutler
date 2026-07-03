import {
  createTelemetryEvent,
  telemetryEvents,
} from "../../application/telemetry/telemetryEvent";
import { Telemetry } from "../../presentation/vscode/constant";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";
import { MyExtension } from "./MyExtension";

const DEVELOPMENT_PROPERTY = {
  development: String(DEVELOPMENT),
};

export const reportExtensionActivated = (myExtension: MyExtension): void => {
  myExtension.telemetry.trackEvent(
    Telemetry.ExtensionActivate,
    DEVELOPMENT_PROPERTY,
  );
  const event = createTelemetryEvent(
    telemetryEvents.extensionLifecycleActivated,
    {
      development: DEVELOPMENT,
      host: getTelemetryHost(),
      result: "success",
    },
  );
  myExtension.telemetry.trackEvent(event.name, event.properties);
};

export const reportAndDisposeExtensionRuntime = (
  myExtension: MyExtension | undefined,
): void => {
  if (!myExtension) {
    return;
  }

  myExtension.telemetry.trackEvent(
    Telemetry.ExtensionDeactivate,
    DEVELOPMENT_PROPERTY,
  );
  const event = createTelemetryEvent(
    telemetryEvents.extensionLifecycleDeactivated,
    {
      development: DEVELOPMENT,
      host: getTelemetryHost(),
      result: "success",
    },
  );
  myExtension.telemetry.trackEvent(event.name, event.properties);
  myExtension.dispose();
};
