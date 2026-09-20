import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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

export const ResultKeyValueList = ({
  items,
  ariaLabel,
  dense = false,
}: ResultKeyValueListProps): React.ReactElement => (
  <Box
    component="dl"
    aria-label={ariaLabel}
    sx={{
      display: dense ? "flex" : "grid",
      ...(dense
        ? { flexWrap: "wrap", gap: 1 }
        : {
            gridTemplateColumns: "minmax(7rem, max-content) minmax(0, 1fr)",
            columnGap: 1.5,
            rowGap: 0.5,
          }),
      m: 0,
      minWidth: 0,
      overflowWrap: "anywhere",
      "@media (max-width: 32rem)": {
        display: "block",
        "& > div": { mb: 0.75 },
      },
    }}
  >
    {items.map((item, index) => (
      <Box
        component="div"
        key={item.id ?? index}
        sx={{
          minWidth: 0,
          ...(dense ? { display: "inline-flex", gap: 0.5 } : {}),
        }}
      >
        <Typography
          component="dt"
          variant="body2"
          color="text.secondary"
          sx={dense ? { flexShrink: 0 } : undefined}
        >
          {item.label}
        </Typography>
        <Typography component="dd" variant="body2" sx={{ m: 0 }}>
          {item.value}
        </Typography>
      </Box>
    ))}
  </Box>
);

export default ResultKeyValueList;
