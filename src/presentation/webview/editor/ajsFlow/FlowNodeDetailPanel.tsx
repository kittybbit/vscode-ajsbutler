import React, { FC, memo } from "react";
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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { unitTypeLabel } from "../../../../domain/services/i18n/nls";
import { useMyAppContext } from "../MyContexts";
import type { FlowNodeDetail } from "./flowNodeDetail";
import { useFlowNodeDetailPanelCollapse } from "./useFlowNodeDetailPanelCollapse";

type FlowNodeDetailPanelProps = {
  detail: FlowNodeDetail;
  onClose: VoidFunction;
  onOpenDefinition: VoidFunction;
  onOpenScope: VoidFunction;
};

const DetailRow: FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
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

const StateChip: FC<{ active: boolean; label: string }> = ({
  active,
  label,
}) => (
  <Chip
    size="small"
    color={active ? "primary" : "default"}
    variant={active ? "filled" : "outlined"}
    label={`${label}: ${active ? "Yes" : "No"}`}
  />
);

const FlowNodeDetailPanel: FC<FlowNodeDetailPanelProps> = ({
  detail,
  onClose,
  onOpenDefinition,
  onOpenScope,
}) => {
  const { lang = "en" } = useMyAppContext();
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down("md"));
  const { collapse, collapsed, expand } =
    useFlowNodeDetailPanelCollapse(isNarrow);
  const parent = detail.parentName
    ? `${detail.parentName}${detail.parentPath ? ` (${detail.parentPath})` : ""}`
    : "—";

  if (collapsed) {
    return (
      <Paper
        component="aside"
        aria-label="Collapsed selected flow node details"
        variant="outlined"
        sx={{
          width: 48,
          minWidth: 48,
          height: "100%",
          borderRadius: 3,
          boxSizing: "border-box",
        }}
      >
        <Stack spacing={1} alignItems="center" sx={{ paddingY: 1 }}>
          <Tooltip title="Expand node details" placement="left">
            <IconButton
              size="small"
              aria-label="Expand node details"
              onClick={expand}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close node details" placement="left">
            <IconButton
              size="small"
              aria-label="Close node details"
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
      aria-label="Selected flow node details"
      variant="outlined"
      sx={{
        width: 360,
        minWidth: 320,
        maxWidth: 380,
        height: "100%",
        overflow: "auto",
        borderRadius: 3,
        boxSizing: "border-box",
      }}
    >
      <Stack spacing={1.5} sx={{ padding: 2 }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Tooltip title={detail.name} placement="top-start">
              <Typography variant="h6" noWrap>
                {detail.name}
              </Typography>
            </Tooltip>
            <Typography variant="caption" color="text.secondary">
              {unitTypeLabel(detail.unitType, lang, detail.groupType)}
            </Typography>
          </Box>
          <Tooltip title="Collapse node details">
            <IconButton
              size="small"
              aria-label="Collapse node details"
              onClick={collapse}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            aria-label="Close node details"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider />
        <DetailRow label="Comment" value={detail.comment || "—"} />
        <DetailRow label="Absolute path" value={detail.absolutePath} />
        <DetailRow label="Parent unit" value={parent} />

        <Divider />
        <DetailRow label="Predecessors" value={detail.predecessorCount} />
        <DetailRow label="Successors" value={detail.successorCount} />
        <DetailRow label="Upstream" value={detail.upstreamCount} />
        <DetailRow label="Downstream" value={detail.downstreamCount} />

        <Divider />
        <Stack direction="row" gap={0.75} flexWrap="wrap">
          <StateChip active={detail.hasSchedule} label="Schedule" />
          <StateChip active={detail.hasWaitedFor} label="Waited for" />
          <StateChip
            active={detail.canExpandNested}
            label="Nested expandable"
          />
          <StateChip active={detail.isSearchMatch} label="Search match" />
          <StateChip
            active={detail.isCurrentSearchResult}
            label="Current search result"
          />
        </Stack>

        <Divider />
        <Button
          variant="outlined"
          startIcon={<DescriptionIcon />}
          onClick={onOpenDefinition}
        >
          Open definition details
        </Button>
        {detail.canOpenAsScope && (
          <Button
            variant="contained"
            startIcon={<FolderOpenIcon />}
            onClick={onOpenScope}
          >
            Open as graph scope
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default memo(FlowNodeDetailPanel);
