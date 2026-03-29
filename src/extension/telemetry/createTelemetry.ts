import { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { VscodeTelemetryAdapter } from "./VscodeTelemetryAdapter";

export const createTelemetry = (): TelemetryPort => {
  return new VscodeTelemetryAdapter(CONNECTION_STRING);
};
