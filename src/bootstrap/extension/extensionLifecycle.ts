import { Telemetry } from "../../presentation/vscode/constant";
import { MyExtension } from "./MyExtension";

const DEVELOPMENT_PROPERTY = {
  development: String(DEVELOPMENT),
};

export const reportExtensionActivated = (myExtension: MyExtension): void => {
  myExtension.telemetry.trackEvent(
    Telemetry.ExtensionActivate,
    DEVELOPMENT_PROPERTY,
  );
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
  myExtension.dispose();
};
