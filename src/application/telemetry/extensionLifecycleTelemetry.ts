import {
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
} from "./telemetryEvent";
import type { ValidatedTelemetryEvent } from "./TelemetryPort";

export type ExtensionTelemetryHost = "desktop" | "web";

export const createLegacyExtensionActivatedEvent =
  (): ValidatedTelemetryEvent =>
    createTelemetryEvent(telemetryEvents.legacyExtensionActivated, {
      [telemetryPropertyKeys.development]: DEVELOPMENT,
    });

export const createLegacyExtensionDeactivatedEvent =
  (): ValidatedTelemetryEvent =>
    createTelemetryEvent(telemetryEvents.legacyExtensionDeactivated, {
      [telemetryPropertyKeys.development]: DEVELOPMENT,
    });

export const createExtensionLifecycleActivatedEvent = (
  host: ExtensionTelemetryHost,
): ValidatedTelemetryEvent =>
  createTelemetryEvent(telemetryEvents.extensionLifecycleActivated, {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.result]: "success",
  });

export const createExtensionLifecycleDeactivatedEvent = (
  host: ExtensionTelemetryHost,
): ValidatedTelemetryEvent =>
  createTelemetryEvent(telemetryEvents.extensionLifecycleDeactivated, {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.result]: "success",
  });

export const createExtensionTelemetryInitializedEvent = ({
  host,
  result,
  errorCode,
}: {
  host: ExtensionTelemetryHost;
  result: "success" | "failed";
  errorCode?: string;
}): ValidatedTelemetryEvent =>
  createTelemetryEvent(telemetryEvents.extensionTelemetryInitialized, {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.result]: result,
    [telemetryPropertyKeys.errorCode]: errorCode,
  });
