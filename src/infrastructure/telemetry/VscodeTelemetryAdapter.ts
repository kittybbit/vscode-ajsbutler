import { TelemetryReporter } from "@vscode/extension-telemetry";
import type { ValidatedTelemetryEvent } from "../../application/telemetry/telemetryEvent";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";

type TelemetrySdkReporter = {
  sendTelemetryEvent(
    eventName: string,
    properties?: Record<string, string>,
  ): void;
  dispose(): void | Promise<unknown>;
};

type CreateTelemetrySdkReporter = (
  connectionString: string,
) => TelemetrySdkReporter;

export class VscodeTelemetryAdapter implements TelemetryPort {
  readonly #reporter: TelemetrySdkReporter;

  constructor(
    connectionString: string,
    createReporter: CreateTelemetrySdkReporter = (value) =>
      new TelemetryReporter(value),
  ) {
    this.#reporter = createReporter(connectionString);
  }

  report(event: ValidatedTelemetryEvent): void {
    try {
      this.#reporter.sendTelemetryEvent(event.name, event.properties);
    } catch {
      // Telemetry reporting must never change extension behavior.
    }
  }

  dispose(): void {
    try {
      void Promise.resolve(this.#reporter.dispose()).catch(() => {
        // Telemetry disposal must never change extension shutdown behavior.
      });
    } catch {
      // Telemetry disposal must never change extension shutdown behavior.
    }
  }
}
