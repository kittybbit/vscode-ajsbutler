import { TelemetryPort } from "../../application/telemetry/TelemetryPort";

export class NoopTelemetryAdapter implements TelemetryPort {
  trackEvent(_eventName: string): void {
    void _eventName;
  }

  dispose(): void {}
}
