import React, { FC, ReactNode, memo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { useResponsivePanelCollapse } from "./useResponsivePanelCollapse";

export type SharedUnitDetailPaneRow = {
  label: string;
  value: ReactNode;
};

export type SharedUnitDetailPaneChip = {
  active: boolean;
  label: string;
};

export type SharedUnitDetailPaneAction = {
  label: string;
  onClick: VoidFunction;
  icon?: ReactNode;
  variant?: "contained" | "outlined" | "text";
  disabled?: boolean;
};

type SharedUnitDetailPaneProps = {
  title: string;
  subtitle?: ReactNode;
  ariaLabel: string;
  collapsedAriaLabel: string;
  closeAriaLabel?: string;
  collapseTooltip?: string;
  expandTooltip?: string;
  closeTooltip?: string;
  onClose: VoidFunction;
  rows?: readonly SharedUnitDetailPaneRow[];
  relationshipRows?: readonly SharedUnitDetailPaneRow[];
  chips?: readonly SharedUnitDetailPaneChip[];
  actions?: readonly SharedUnitDetailPaneAction[];
  children?: ReactNode;
  sx?: SxProps<Theme>;
};

const paneWidth = 360;
const paneMinWidth = 320;
const paneMaxWidth = 380;
const collapsedPaneWidth = 48;

export const getSharedUnitDetailPaneActionLabels = (
  actions: readonly SharedUnitDetailPaneAction[] = [],
): string[] =>
  actions.filter((action) => !action.disabled).map((action) => action.label);

const DetailRow: FC<SharedUnitDetailPaneRow> = ({ label, value }) => (
  <Stack direction="row" spacing={1} justifyContent="space-between">
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{ textAlign: "right", overflowWrap: "anywhere" }}
    >
      {value}
    </Typography>
  </Stack>
);

const StateChip: FC<SharedUnitDetailPaneChip> = ({ active, label }) => (
  <Chip
    size="small"
    color={active ? "primary" : "default"}
    variant={active ? "filled" : "outlined"}
    label={`${label}: ${active ? "Yes" : "No"}`}
  />
);

const SharedUnitDetailPane: FC<SharedUnitDetailPaneProps> = ({
  title,
  subtitle,
  ariaLabel,
  collapsedAriaLabel,
  closeAriaLabel = "Close details",
  collapseTooltip = "Collapse details",
  expandTooltip = "Expand details",
  closeTooltip = "Close details",
  onClose,
  rows = [],
  relationshipRows = [],
  chips = [],
  actions = [],
  children,
  sx,
}) => {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down("md"));
  const { collapse, collapsed, expand } = useResponsivePanelCollapse(isNarrow);

  if (collapsed) {
    return (
      <Paper
        component="aside"
        aria-label={collapsedAriaLabel}
        variant="outlined"
        sx={{
          width: collapsedPaneWidth,
          minWidth: collapsedPaneWidth,
          height: "100%",
          borderRadius: 3,
          boxSizing: "border-box",
        }}
      >
        <Stack spacing={1} alignItems="center" sx={{ paddingY: 1 }}>
          <Tooltip title={expandTooltip} placement="left">
            <IconButton
              size="small"
              aria-label={expandTooltip}
              onClick={expand}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={closeTooltip} placement="left">
            <IconButton
              size="small"
              aria-label={closeAriaLabel}
              onClick={onClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      component="aside"
      aria-label={ariaLabel}
      variant="outlined"
      sx={[
        {
          width: paneWidth,
          minWidth: paneMinWidth,
          maxWidth: paneMaxWidth,
          height: "100%",
          overflow: "auto",
          borderRadius: 3,
          boxSizing: "border-box",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Stack spacing={1.5} sx={{ padding: 2 }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Tooltip title={title} placement="top-start">
              <Typography variant="h6" noWrap>
                {title}
              </Typography>
            </Tooltip>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Tooltip title={collapseTooltip}>
            <IconButton
              size="small"
              aria-label={collapseTooltip}
              onClick={collapse}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            aria-label={closeAriaLabel}
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {rows.length > 0 && (
          <>
            <Divider />
            {rows.map((row) => (
              <DetailRow key={row.label} {...row} />
            ))}
          </>
        )}

        {relationshipRows.length > 0 && (
          <>
            <Divider />
            {relationshipRows.map((row) => (
              <DetailRow key={row.label} {...row} />
            ))}
          </>
        )}

        {chips.length > 0 && (
          <>
            <Divider />
            <Stack direction="row" gap={0.75} flexWrap="wrap">
              {chips.map((chip) => (
                <StateChip key={chip.label} {...chip} />
              ))}
            </Stack>
          </>
        )}

        {actions.length > 0 && (
          <>
            <Divider />
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant ?? "outlined"}
                startIcon={action.icon}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </>
        )}

        {children && (
          <>
            <Divider />
            {children}
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default memo(SharedUnitDetailPane);
