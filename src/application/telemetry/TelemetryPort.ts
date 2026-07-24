import type { ValidatedTelemetryEvent } from "./telemetryEvent";

export interface TelemetryPort {
  report(event: ValidatedTelemetryEvent): void;
  dispose(): void;
}
