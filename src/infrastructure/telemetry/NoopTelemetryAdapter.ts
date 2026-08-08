import type {
  TelemetryPort,
  ValidatedTelemetryEvent,
} from "../../application/telemetry/TelemetryPort";

export class NoopTelemetryAdapter implements TelemetryPort {
  report(_event: ValidatedTelemetryEvent): void {
    void _event;
  }

  dispose(): void {}
}
