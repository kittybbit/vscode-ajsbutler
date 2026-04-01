import { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { NoopTelemetryAdapter } from "./NoopTelemetryAdapter";
import { VscodeTelemetryAdapter } from "./VscodeTelemetryAdapter";

export const createTelemetry = (
  connectionString: string = CONNECTION_STRING,
  createAdapter: (value: string) => TelemetryPort = (value) =>
    new VscodeTelemetryAdapter(value),
): TelemetryPort => {
  if (!connectionString) {
    return new NoopTelemetryAdapter();
  }

  try {
    return createAdapter(connectionString);
  } catch (error) {
    console.warn("Telemetry initialization failed.", error);
    return new NoopTelemetryAdapter();
  }
};
