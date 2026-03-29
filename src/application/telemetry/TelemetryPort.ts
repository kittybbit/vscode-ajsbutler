export type TelemetryProperties = Record<string, string>;

export interface TelemetryPort {
  trackEvent(eventName: string, properties?: TelemetryProperties): void;
  dispose(): void;
}
