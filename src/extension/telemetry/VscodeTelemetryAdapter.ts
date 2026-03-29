import { TelemetryReporter } from "@vscode/extension-telemetry";
import {
  TelemetryPort,
  TelemetryProperties,
} from "../../application/telemetry/TelemetryPort";

export class VscodeTelemetryAdapter implements TelemetryPort {
  #reporter: TelemetryReporter;

  constructor(connectionString: string) {
    this.#reporter = new TelemetryReporter(connectionString);
  }

  trackEvent(eventName: string, properties: TelemetryProperties = {}): void {
    this.#reporter.sendTelemetryEvent(eventName, properties);
  }

  dispose(): void {
    this.#reporter.dispose();
  }
}
