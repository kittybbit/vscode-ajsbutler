import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

export type ResultSectionProps = Readonly<{
  title: React.ReactNode;
  children?: React.ReactNode;
  ariaLabel?: string;
  count?: React.ReactNode;
  dataGlobalCount?: number;
  dataVisibleCount?: number;
  dataTestId?: string;
  sx?: SxProps<Theme>;
}>;

export const ResultSection = ({
  title,
  children,
  ariaLabel,
  count,
  dataGlobalCount,
  dataVisibleCount,
  dataTestId,
  sx,
}: ResultSectionProps): React.ReactElement => (
  <Box
    component="section"
    aria-label={ariaLabel}
    data-global-count={dataGlobalCount}
    data-visible-count={dataVisibleCount}
    data-testid={dataTestId}
    sx={{ minWidth: 0, mb: 2, ...sx }}
  >
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      sx={{ alignItems: "center", flexWrap: "wrap", mb: 1 }}
    >
      <Typography component="h2" variant="h6" sx={{ overflowWrap: "anywhere" }}>
        {title}
      </Typography>
      {count !== undefined ? (
        <Chip size="small" label={count} aria-label={String(count)} />
      ) : null}
    </Stack>
    {children}
  </Box>
);

export default ResultSection;
