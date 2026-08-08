declare const validatedTelemetryEventBrand: unique symbol;

export type ValidatedTelemetryEvent<Name extends string = string> = Readonly<{
  name: Name;
  properties: Readonly<Record<string, string>>;
  readonly [validatedTelemetryEventBrand]: true;
}>;

export interface TelemetryPort {
  report(event: ValidatedTelemetryEvent): void;
  dispose(): void;
}
