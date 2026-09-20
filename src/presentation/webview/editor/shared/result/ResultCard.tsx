import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

export type ResultCardProps = Readonly<{
  title?: React.ReactNode;
  children?: React.ReactNode;
  ariaLabel?: string;
  dataAttributes?: Readonly<Record<string, string | number | undefined>>;
  sx?: SxProps<Theme>;
}> &
  Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title">;

export const ResultCard = React.forwardRef<HTMLDivElement, ResultCardProps>(
  ({ title, children, ariaLabel, dataAttributes, sx, ...cardProps }, ref) => (
    <Card
      ref={ref}
      {...cardProps}
      component="article"
      variant="outlined"
      aria-label={ariaLabel}
      {...dataAttributes}
      sx={{ minWidth: 0, overflowWrap: "anywhere", ...sx }}
    >
      <CardContent sx={{ minWidth: 0, "&:last-child": { pb: 2 } }}>
        {title !== undefined ? (
          <Typography component="h3" variant="subtitle1" sx={{ mb: 1 }}>
            {title}
          </Typography>
        ) : null}
        {children}
      </CardContent>
    </Card>
  ),
);
ResultCard.displayName = "ResultCard";

export default ResultCard;
