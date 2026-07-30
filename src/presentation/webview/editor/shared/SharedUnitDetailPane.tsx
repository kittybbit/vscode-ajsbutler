import React, {
  FC,
  KeyboardEvent,
  ReactNode,
  RefObject,
  memo,
  useEffect,
  useRef,
} from "react";
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
  onReturnFocus?: VoidFunction;
  focusRequestRevision?: number;
  onFocusRequestHandled?: (revision: number) => void;
  rows?: readonly SharedUnitDetailPaneRow[];
  relationshipRows?: readonly SharedUnitDetailPaneRow[];
  chips?: readonly SharedUnitDetailPaneChip[];
  actions?: readonly SharedUnitDetailPaneAction[];
  children?: ReactNode;
  sx?: SxProps<Theme>;
};

export type DetailPaneShortcut = "close" | "return";

type DetailPaneShortcutContext = {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

const excludedShortcutTargetSelector =
  'a[href], button, input, select, textarea, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"]';

export const isDetailPaneShortcutTargetExcluded = (
  target: EventTarget | null,
): boolean => {
  const candidate = target as
    | { closest?: (selector: string) => unknown }
    | undefined;
  return Boolean(candidate?.closest?.(excludedShortcutTargetSelector));
};

export const resolveDetailPaneShortcut = ({
  key,
  altKey = false,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
}: DetailPaneShortcutContext): DetailPaneShortcut | undefined => {
  if (altKey || ctrlKey || metaKey || shiftKey) return undefined;
  if (key.toLowerCase() === "r") return "return";
  return key === "Escape" ? "close" : undefined;
};

export const resolveDetailPaneShortcutForTarget = (
  context: DetailPaneShortcutContext,
  target: EventTarget | null,
): DetailPaneShortcut | undefined => {
  const shortcut = resolveDetailPaneShortcut(context);
  return shortcut === "return" && isDetailPaneShortcutTargetExcluded(target)
    ? undefined
    : shortcut;
};

const paneWidth = 360;
const paneMinWidth = 320;
const paneMaxWidth = 380;
const collapsedPaneWidth = 48;

export const getSharedUnitDetailPaneActionLabels = (
  actions: readonly SharedUnitDetailPaneAction[] = [],
): string[] =>
  actions.filter((action) => !action.disabled).map((action) => action.label);

type SharedUnitDetailPaneLayoutProps = Pick<
  SharedUnitDetailPaneProps,
  | "ariaLabel"
  | "collapsedAriaLabel"
  | "closeAriaLabel"
  | "closeTooltip"
  | "collapseTooltip"
  | "expandTooltip"
  | "onClose"
  | "sx"
> & {
  focusTargetRef?: RefObject<HTMLElement | null>;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

type SharedUnitDetailPaneContentProps = Pick<
  SharedUnitDetailPaneProps,
  | "actions"
  | "chips"
  | "children"
  | "relationshipRows"
  | "rows"
  | "subtitle"
  | "title"
>;

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

const getStateChipColor = (active: boolean): "primary" | "default" =>
  active ? "primary" : "default";

const getStateChipVariant = (active: boolean): "filled" | "outlined" =>
  active ? "filled" : "outlined";

const formatStateChipLabel = ({ active, label }: SharedUnitDetailPaneChip) =>
  `${label}: ${active ? "Yes" : "No"}`;

const StateChip: FC<SharedUnitDetailPaneChip> = ({ active, label }) => (
  <Chip
    size="small"
    color={getStateChipColor(active)}
    variant={getStateChipVariant(active)}
    label={formatStateChipLabel({ active, label })}
  />
);

const CollapsedDetailPane: FC<
  Pick<
    SharedUnitDetailPaneLayoutProps,
    | "collapsedAriaLabel"
    | "closeAriaLabel"
    | "closeTooltip"
    | "expandTooltip"
    | "onClose"
  > & {
    onExpand: VoidFunction;
  }
> = ({
  collapsedAriaLabel,
  closeAriaLabel,
  closeTooltip,
  expandTooltip,
  onClose,
  onExpand,
}) => (
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
        <IconButton size="small" aria-label={expandTooltip} onClick={onExpand}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={closeTooltip} placement="left">
        <IconButton size="small" aria-label={closeAriaLabel} onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  </Paper>
);

const DetailPaneHeader: FC<
  Pick<
    SharedUnitDetailPaneProps,
    "closeAriaLabel" | "collapseTooltip" | "onClose" | "subtitle" | "title"
  > & {
    focusTargetRef?: RefObject<HTMLElement | null>;
    onCollapse: VoidFunction;
  }
> = ({
  closeAriaLabel,
  collapseTooltip,
  onClose,
  onCollapse,
  subtitle,
  title,
  focusTargetRef,
}) => (
  <Stack direction="row" spacing={1} alignItems="flex-start">
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Tooltip title={title} placement="top-start">
        <Typography ref={focusTargetRef} variant="h6" noWrap tabIndex={-1}>
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
        onClick={onCollapse}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    <IconButton size="small" aria-label={closeAriaLabel} onClick={onClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </Stack>
);

const DetailPaneSection: FC<{
  children: ReactNode;
  visible: boolean;
}> = ({ children, visible }) =>
  visible ? (
    <>
      <Divider />
      {children}
    </>
  ) : null;

const DetailRowsSection: FC<{
  rows: readonly SharedUnitDetailPaneRow[];
}> = ({ rows }) => (
  <DetailPaneSection visible={rows.length > 0}>
    {rows.map((row) => (
      <DetailRow key={row.label} {...row} />
    ))}
  </DetailPaneSection>
);

const StateChipsSection: FC<{
  chips: readonly SharedUnitDetailPaneChip[];
}> = ({ chips }) => (
  <DetailPaneSection visible={chips.length > 0}>
    <Stack direction="row" gap={0.75} flexWrap="wrap">
      {chips.map((chip) => (
        <StateChip key={chip.label} {...chip} />
      ))}
    </Stack>
  </DetailPaneSection>
);

const ActionsSection: FC<{
  actions: readonly SharedUnitDetailPaneAction[];
}> = ({ actions }) => (
  <DetailPaneSection visible={actions.length > 0}>
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
  </DetailPaneSection>
);

const ChildrenSection: FC<{
  children?: ReactNode;
}> = ({ children }) => (
  <DetailPaneSection visible={Boolean(children)}>{children}</DetailPaneSection>
);

const normalizeDetailPaneSx = (sx: SharedUnitDetailPaneProps["sx"]) => {
  if (!sx) {
    return [];
  }
  if (Array.isArray(sx)) {
    return sx;
  }
  return [sx];
};

const ExpandedDetailPane: FC<
  SharedUnitDetailPaneLayoutProps &
    SharedUnitDetailPaneContentProps & {
      onCollapse: VoidFunction;
    }
> = ({
  actions = [],
  ariaLabel,
  children,
  chips = [],
  closeAriaLabel = "Close details",
  collapseTooltip = "Collapse details",
  onClose,
  onCollapse,
  relationshipRows = [],
  rows = [],
  subtitle,
  sx,
  title,
  focusTargetRef,
  onKeyDown,
}) => (
  <Paper
    component="aside"
    aria-label={ariaLabel}
    variant="outlined"
    onKeyDown={onKeyDown}
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
      ...normalizeDetailPaneSx(sx),
    ]}
  >
    <Stack spacing={1.5} sx={{ padding: 2 }}>
      <DetailPaneHeader
        closeAriaLabel={closeAriaLabel}
        collapseTooltip={collapseTooltip}
        onClose={onClose}
        onCollapse={onCollapse}
        subtitle={subtitle}
        title={title}
        focusTargetRef={focusTargetRef}
      />
      <DetailRowsSection rows={rows} />
      <DetailRowsSection rows={relationshipRows} />
      <StateChipsSection chips={chips} />
      <ActionsSection actions={actions} />
      <ChildrenSection>{children}</ChildrenSection>
    </Stack>
  </Paper>
);

const SharedUnitDetailPane: FC<SharedUnitDetailPaneProps> = (props) => {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down("md"));
  const { collapse, collapsed, expand } = useResponsivePanelCollapse(isNarrow);
  const focusTargetRef = useRef<HTMLElement>(null);
  const focusRequestRevision = props.focusRequestRevision ?? 0;

  useEffect(() => {
    if (focusRequestRevision <= 0) return;
    if (collapsed) {
      expand();
      return;
    }
    if (!focusTargetRef.current) return;
    focusTargetRef.current.focus();
    props.onFocusRequestHandled?.(focusRequestRevision);
  }, [collapsed, expand, focusRequestRevision, props.onFocusRequestHandled]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!props.onReturnFocus) return;
    const shortcut = resolveDetailPaneShortcutForTarget(event, event.target);
    if (!shortcut) return;
    event.preventDefault();
    event.stopPropagation();
    if (shortcut === "return") {
      props.onReturnFocus?.();
      return;
    }
    props.onClose();
  };

  return collapsed ? (
    <CollapsedDetailPane
      collapsedAriaLabel={props.collapsedAriaLabel}
      closeAriaLabel={props.closeAriaLabel ?? "Close details"}
      closeTooltip={props.closeTooltip ?? "Close details"}
      expandTooltip={props.expandTooltip ?? "Expand details"}
      onClose={props.onClose}
      onExpand={expand}
    />
  ) : (
    <ExpandedDetailPane
      {...props}
      closeAriaLabel={props.closeAriaLabel ?? "Close details"}
      collapseTooltip={props.collapseTooltip ?? "Collapse details"}
      focusTargetRef={focusTargetRef}
      onKeyDown={handleKeyDown}
      onCollapse={collapse}
    />
  );
};

export default memo(SharedUnitDetailPane);
