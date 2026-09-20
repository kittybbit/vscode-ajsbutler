import React from "react";
import Chip from "@mui/material/Chip";

export type ResultStatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export type ResultStatusChipProps = Readonly<{
  label: React.ReactNode;
  tone?: ResultStatusTone;
  ariaLabel?: string;
  role?: "status" | "img";
  ariaLive?: "off" | "polite" | "assertive";
  dataTestId?: string;
  dataFact?: string;
}>;

const toneColor = {
  neutral: "default",
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
} as const;

export const ResultStatusChip = ({
  label,
  tone = "neutral",
  ariaLabel,
  role,
  ariaLive,
  dataTestId,
  dataFact,
}: ResultStatusChipProps): React.ReactElement => (
  <Chip
    component="span"
    size="small"
    variant="outlined"
    color={toneColor[tone]}
    label={label}
    aria-label={ariaLabel ?? String(label)}
    role={role}
    aria-live={ariaLive}
    data-testid={dataTestId}
    data-fact={dataFact}
    data-result-status="true"
    data-result-tone={tone}
  />
);

export default ResultStatusChip;
