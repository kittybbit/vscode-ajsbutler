import { createExtensionActivatedEvent } from "../../application/telemetry/telemetryEvent";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";
import { MyExtension } from "./MyExtension";

export const reportExtensionActivated = (myExtension: MyExtension): void => {
  try {
    myExtension.telemetry.report(
      createExtensionActivatedEvent(getTelemetryHost()),
    );
  } catch {
    // Telemetry must not prevent a successfully constructed extension from activating.
  }
};

export const reportAndDisposeExtensionRuntime = (
  myExtension: MyExtension | undefined,
): void => {
  if (!myExtension) return;

  try {
    myExtension.dispose();
  } catch {
    // Telemetry disposal must not prevent extension shutdown.
  }
};
