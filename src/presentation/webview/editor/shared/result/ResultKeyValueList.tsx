import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

export type ResultKeyValue = Readonly<{
  label: React.ReactNode;
  value: React.ReactNode;
  id?: string;
}>;

export type ResultKeyValueListProps = Readonly<{
  items: readonly ResultKeyValue[];
  ariaLabel?: string;
  dense?: boolean;
}>;

type KeyValueSpacing = Readonly<{
  columnGap: number;
  rowGap: number;
  narrowMargin: number;
}>;

const regularSpacing: KeyValueSpacing = {
  columnGap: 1.5,
  rowGap: 0.5,
  narrowMargin: 0.75,
};
const denseSpacing: KeyValueSpacing = {
  columnGap: 1,
  rowGap: 0.25,
  narrowMargin: 0.5,
};

const keyValueListSx = (dense: boolean): SxProps<Theme> => {
  const spacing = dense ? denseSpacing : regularSpacing;
  return {
    display: "grid",
    gridTemplateColumns: "minmax(7rem, max-content) minmax(0, 1fr)",
    columnGap: spacing.columnGap,
    rowGap: spacing.rowGap,
    m: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
    "@media (max-width: 32rem)": {
      display: "block",
      "& > div": { mb: spacing.narrowMargin },
    },
  };
};

const ResultKeyValueRow = ({
  item,
  dense,
}: Readonly<{
  item: ResultKeyValue;
  dense: boolean;
}>): React.ReactElement => (
  <Box
    component="div"
    data-result-key-value-row="true"
    sx={{
      display: "grid",
      gridColumn: "1 / -1",
      gridTemplateColumns: "minmax(7rem, max-content) minmax(0, 1fr)",
      minWidth: 0,
      overflowWrap: "anywhere",
      "@media (max-width: 32rem)": {
        display: "block",
        mb: dense ? 0.5 : 0.75,
      },
    }}
  >
    <Typography component="dt" variant="body2" color="text.secondary">
      {item.label}
    </Typography>
    <Typography component="dd" variant="body2" sx={{ m: 0 }}>
      {item.value}
    </Typography>
  </Box>
);

export const ResultKeyValueList = ({
  items,
  ariaLabel,
  dense = false,
}: ResultKeyValueListProps): React.ReactElement => (
  <Box component="dl" aria-label={ariaLabel} sx={keyValueListSx(dense)}>
    {items.map((item, index) => (
      <ResultKeyValueRow key={item.id ?? index} item={item} dense={dense} />
    ))}
  </Box>
);

export default ResultKeyValueList;
