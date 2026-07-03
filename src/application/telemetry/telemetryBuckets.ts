export type TelemetryDurationBucket =
  | "unknown"
  | "lt100ms"
  | "100_499ms"
  | "500_999ms"
  | "1_4s"
  | "5_14s"
  | "15s_plus";

export type TelemetryCountBucket =
  | "unknown"
  | "0"
  | "1"
  | "2_9"
  | "10_99"
  | "100_999"
  | "1000_plus";

export type TelemetryHttpStatusCategory =
  | "unknown"
  | "none"
  | "1xx"
  | "2xx"
  | "3xx"
  | "4xx"
  | "5xx";

export const toDurationBucket = (
  durationMs: number,
): TelemetryDurationBucket => {
  if (!Number.isFinite(durationMs) || durationMs < 0) {
    return "unknown";
  }

  if (durationMs < 100) {
    return "lt100ms";
  }
  if (durationMs < 500) {
    return "100_499ms";
  }
  if (durationMs < 1000) {
    return "500_999ms";
  }
  if (durationMs < 5000) {
    return "1_4s";
  }
  if (durationMs < 15000) {
    return "5_14s";
  }

  return "15s_plus";
};

export const toCountBucket = (count: number): TelemetryCountBucket => {
  if (!Number.isFinite(count) || count < 0) {
    return "unknown";
  }

  const wholeCount = Math.floor(count);

  if (wholeCount === 0) {
    return "0";
  }
  if (wholeCount === 1) {
    return "1";
  }
  if (wholeCount < 10) {
    return "2_9";
  }
  if (wholeCount < 100) {
    return "10_99";
  }
  if (wholeCount < 1000) {
    return "100_999";
  }

  return "1000_plus";
};

export const toHttpStatusCategory = (
  statusCode: number | undefined,
): TelemetryHttpStatusCategory => {
  if (statusCode === undefined) {
    return "none";
  }

  if (!Number.isFinite(statusCode)) {
    return "unknown";
  }

  const statusClass = Math.floor(statusCode / 100);

  switch (statusClass) {
    case 1:
      return "1xx";
    case 2:
      return "2xx";
    case 3:
      return "3xx";
    case 4:
      return "4xx";
    case 5:
      return "5xx";
    default:
      return "unknown";
  }
};
