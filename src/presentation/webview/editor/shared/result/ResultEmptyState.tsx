import React from "react";
import Alert, { type AlertColor } from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export type ResultEmptyStateProps = Readonly<{
  children: React.ReactNode;
  title?: React.ReactNode;
  severity?: AlertColor;
  role?: "alert" | "status";
}>;

export const ResultEmptyState = ({
  children,
  title,
  severity = "info",
  role = "status",
}: ResultEmptyStateProps): React.ReactElement => (
  <Alert
    severity={severity}
    variant="outlined"
    role={role}
    data-result-empty-state="true"
  >
    {title !== undefined ? (
      <Typography component="strong" sx={{ display: "block" }}>
        {title}
      </Typography>
    ) : null}
    {children}
  </Alert>
);

export default ResultEmptyState;
