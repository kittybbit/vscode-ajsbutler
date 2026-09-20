import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type ResultComparisonProps = Readonly<{
  beforeLabel: string;
  afterLabel: string;
  before: React.ReactNode;
  after: React.ReactNode;
  ariaLabel?: string;
  dataTestId?: string;
}>;

const ComparisonSide = ({
  label,
  side,
  value,
}: Readonly<{
  label: string;
  side: "before" | "after";
  value: React.ReactNode;
}>): React.ReactElement => (
  <Box
    component="article"
    data-result-comparison-side={side}
    sx={{
      minWidth: 0,
      overflowWrap: "anywhere",
      border: 1,
      borderColor: "divider",
      borderRadius: 1,
      p: 1,
    }}
  >
    <Typography component="h3" variant="subtitle2" sx={{ mb: 0.5 }}>
      {label}
    </Typography>
    <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>{value ?? "—"}</Box>
  </Box>
);

export const ResultComparison = ({
  beforeLabel,
  afterLabel,
  before,
  after,
  ariaLabel,
  dataTestId,
}: ResultComparisonProps): React.ReactElement => (
  <Box
    component="section"
    role="group"
    aria-label={ariaLabel ?? `${beforeLabel} / ${afterLabel}`}
    data-result-comparison-label={ariaLabel ?? `${beforeLabel} / ${afterLabel}`}
    data-testid={dataTestId}
    data-result-comparison="true"
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "repeat(2, minmax(0, 1fr))",
      },
      gap: 1,
      minWidth: 0,
    }}
  >
    <ComparisonSide label={beforeLabel} side="before" value={before} />
    <ComparisonSide label={afterLabel} side="after" value={after} />
  </Box>
);

export default ResultComparison;
