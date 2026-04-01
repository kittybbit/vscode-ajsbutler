import {
  TelemetryPort,
  TelemetryProperties,
} from "../../application/telemetry/TelemetryPort";

export class NoopTelemetryAdapter implements TelemetryPort {
  trackEvent(_eventName: string, _properties: TelemetryProperties = {}): void {}

  dispose(): void {}
}
