import {
  TelemetryPort,
  TelemetryProperties,
} from "../../application/telemetry/TelemetryPort";

export class NoopTelemetryAdapter implements TelemetryPort {
  trackEvent(_eventName: string, _properties?: TelemetryProperties): void {
    void _eventName;
    void _properties;
  }

  dispose(): void {}
}
