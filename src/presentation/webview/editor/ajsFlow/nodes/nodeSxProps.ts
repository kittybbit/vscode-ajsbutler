import type { SxProps, Theme } from "@mui/material/styles";
import type { AjsNode } from "./AjsNode";

type NodeVisualState = Pick<
  AjsNode,
  | "isCurrent"
  | "isAncestor"
  | "isRootJobnet"
  | "isSearchMatch"
  | "isCurrentSearchResult"
  | "isSelected"
  | "nestedPanel"
>;

type NestedPanel = NonNullable<NodeVisualState["nestedPanel"]>;

type VisualStateSelector = (visualState: NodeVisualState) => boolean;
type ThemeValue = (theme: Theme) => string;
type VisualStateRule<Kind extends string> = {
  readonly kind: Kind;
  readonly matches: VisualStateSelector;
};

const currentNodeRule = {
  kind: "current",
  matches: ({ isCurrent }: NodeVisualState) => Boolean(isCurrent),
} as const;

const selectedSearchResultNodeRule = {
  kind: "selectedSearchResult",
  matches: ({ isSelected, isCurrentSearchResult }: NodeVisualState) =>
    Boolean(isSelected && isCurrentSearchResult),
} as const;

const selectedNodeRule = {
  kind: "selected",
  matches: ({ isSelected }: NodeVisualState) => Boolean(isSelected),
} as const;

const currentSearchResultNodeRule = {
  kind: "currentSearchResult",
  matches: ({ isCurrentSearchResult }: NodeVisualState) =>
    Boolean(isCurrentSearchResult),
} as const;

const searchMatchNodeRule = {
  kind: "searchMatch",
  matches: ({ isSearchMatch }: NodeVisualState) => Boolean(isSearchMatch),
} as const;

const ancestorNodeRule = {
  kind: "ancestor",
  matches: ({ isAncestor }: NodeVisualState) => Boolean(isAncestor),
} as const;

const rootJobnetNodeRule = {
  kind: "rootJobnet",
  matches: ({ isRootJobnet }: NodeVisualState) => Boolean(isRootJobnet),
} as const;

const resolveVisualKind = <Kind extends string>(
  visualState: NodeVisualState,
  rules: readonly VisualStateRule<Kind>[],
  defaultKind: Kind,
): Kind =>
  rules.find(({ matches }) => matches(visualState))?.kind ?? defaultKind;

const nodeBorderRadius = ({ isAncestor }: NodeVisualState): string =>
  isAncestor ? "1.35em" : "50%";

type BorderWidthKind =
  | "selectedSearchResult"
  | "selected"
  | "currentSearchResult"
  | "current"
  | "rootJobnet"
  | "default";

const borderWidthRules: readonly VisualStateRule<BorderWidthKind>[] = [
  selectedSearchResultNodeRule,
  selectedNodeRule,
  currentSearchResultNodeRule,
  currentNodeRule,
  rootJobnetNodeRule,
];

const borderWidthByKind: Record<BorderWidthKind, string> = {
  selectedSearchResult: "3px",
  selected: "3px",
  currentSearchResult: "3px",
  current: "3px",
  rootJobnet: "2px",
  default: "1px",
};

const nodeBorderWidth = (visualState: NodeVisualState): string =>
  borderWidthByKind[
    resolveVisualKind(visualState, borderWidthRules, "default")
  ];

type BorderColorKind =
  | "selectedSearchResult"
  | "selected"
  | "currentSearchResult"
  | "current"
  | "searchMatch"
  | "rootJobnet"
  | "default";

const borderColorRules: readonly VisualStateRule<BorderColorKind>[] = [
  selectedSearchResultNodeRule,
  selectedNodeRule,
  currentSearchResultNodeRule,
  currentNodeRule,
  searchMatchNodeRule,
  rootJobnetNodeRule,
];

const borderColorByKind: Record<BorderColorKind, ThemeValue> = {
  selectedSearchResult: (theme) => theme.palette.secondary.main,
  selected: (theme) => theme.palette.secondary.main,
  currentSearchResult: (theme) => theme.palette.success.dark,
  current: (theme) => theme.palette.info.main,
  searchMatch: (theme) => theme.palette.success.main,
  rootJobnet: (theme) => theme.palette.primary.main,
  default: (theme) => theme.palette.divider,
};

const nodeBorderColor = (visualState: NodeVisualState): ThemeValue =>
  borderColorByKind[
    resolveVisualKind(visualState, borderColorRules, "default")
  ];

type BackgroundKind =
  | "selectedSearchResult"
  | "selected"
  | "currentSearchResult"
  | "current"
  | "searchMatch"
  | "ancestor"
  | "rootJobnet"
  | "default";

const backgroundRules: readonly VisualStateRule<BackgroundKind>[] = [
  selectedSearchResultNodeRule,
  selectedNodeRule,
  currentSearchResultNodeRule,
  currentNodeRule,
  searchMatchNodeRule,
  ancestorNodeRule,
  rootJobnetNodeRule,
];

const backgroundByKind: Record<BackgroundKind, ThemeValue> = {
  selectedSearchResult: (theme) =>
    `linear-gradient(160deg, ${theme.palette.secondary.light}26 0%, ${theme.palette.success.light}16 48%, ${theme.palette.background.paper} 100%)`,
  selected: (theme) =>
    `linear-gradient(160deg, ${theme.palette.secondary.light}24 0%, ${theme.palette.background.paper} 100%)`,
  currentSearchResult: (theme) =>
    `linear-gradient(160deg, ${theme.palette.success.light}32 0%, ${theme.palette.background.paper} 100%)`,
  current: (theme) =>
    `linear-gradient(160deg, ${theme.palette.info.light}22 0%, ${theme.palette.background.paper} 58%, ${theme.palette.background.default} 100%)`,
  searchMatch: (theme) =>
    `linear-gradient(180deg, ${theme.palette.success.light}20 0%, ${theme.palette.background.paper} 100%)`,
  ancestor: (theme) =>
    `linear-gradient(180deg, ${theme.palette.warning.light}1f 0%, ${theme.palette.background.paper} 100%)`,
  rootJobnet: (theme) =>
    `linear-gradient(180deg, ${theme.palette.primary.light}18 0%, ${theme.palette.background.paper} 100%)`,
  default: (theme) => theme.palette.background.paper,
};

const nodeBackground = (visualState: NodeVisualState): ThemeValue =>
  backgroundByKind[resolveVisualKind(visualState, backgroundRules, "default")];

type BoxShadowKind =
  | "selectedSearchResult"
  | "selected"
  | "currentSearchResult"
  | "current"
  | "searchMatch"
  | "ancestor"
  | "default";

const boxShadowRules: readonly VisualStateRule<BoxShadowKind>[] = [
  selectedSearchResultNodeRule,
  selectedNodeRule,
  currentSearchResultNodeRule,
  currentNodeRule,
  searchMatchNodeRule,
  ancestorNodeRule,
];

const boxShadowByKind: Record<BoxShadowKind, ThemeValue> = {
  selectedSearchResult: (theme) =>
    `0 0 0 4px ${theme.palette.secondary.light}38, 0 0 0 7px ${theme.palette.success.light}20, ${theme.shadows[7]}`,
  selected: (theme) =>
    `0 0 0 4px ${theme.palette.secondary.light}38, ${theme.shadows[7]}`,
  currentSearchResult: (theme) =>
    `0 0 0 4px ${theme.palette.success.light}38, ${theme.shadows[6]}`,
  current: (theme) =>
    `0 0 0 4px ${theme.palette.info.light}30, ${theme.shadows[6]}`,
  searchMatch: (theme) =>
    `0 0 0 3px ${theme.palette.success.light}30, ${theme.shadows[4]}`,
  ancestor: (theme) => theme.shadows[4],
  default: (theme) => theme.shadows[2],
};

const nodeBoxShadow = (visualState: NodeVisualState): ThemeValue =>
  boxShadowByKind[resolveVisualKind(visualState, boxShadowRules, "default")];

const nestedPanelSxProps = (nestedPanel?: NestedPanel) => {
  if (!nestedPanel) {
    return undefined;
  }
  return {
    content: '""',
    position: "absolute",
    left: `${nestedPanel.panelOffsetXPx}px`,
    top: `${nestedPanel.panelOffsetYPx}px`,
    width: `${nestedPanel.panelWidthPx}px`,
    height: `${nestedPanel.panelHeightPx}px`,
    borderRadius: "1.5em",
    border: (theme) => `1px solid ${theme.palette.primary.light}`,
    background: (theme) =>
      `linear-gradient(180deg, ${theme.palette.primary.light}10 0%, ${theme.palette.background.paper}cc 100%)`,
    boxShadow: (theme) => `inset 0 0 0 1px ${theme.palette.divider}`,
    pointerEvents: "none",
    zIndex: -1,
  };
};

type ButtonColorKind =
  | "selectedSearchResult"
  | "selected"
  | "currentSearchResult"
  | "current"
  | "searchMatch"
  | "default";

const buttonColorRules: readonly VisualStateRule<ButtonColorKind>[] = [
  selectedSearchResultNodeRule,
  selectedNodeRule,
  currentSearchResultNodeRule,
  currentNodeRule,
  searchMatchNodeRule,
];

const buttonColorByKind: Record<ButtonColorKind, ThemeValue> = {
  selectedSearchResult: (theme) => theme.palette.secondary.dark,
  selected: (theme) => theme.palette.secondary.dark,
  currentSearchResult: (theme) => theme.palette.success.dark,
  current: (theme) => theme.palette.info.dark,
  searchMatch: (theme) => theme.palette.success.dark,
  default: (theme) => theme.palette.text.secondary,
};

const nodeButtonColor = (visualState: NodeVisualState): ThemeValue =>
  buttonColorByKind[
    resolveVisualKind(visualState, buttonColorRules, "default")
  ];

export const buildNodeSxProps = (
  visualState: NodeVisualState,
): SxProps<Theme> => ({
  position: "relative",
  zIndex: 1,
  overflow: "visible",
  width: "7.25em",
  minHeight: "7.25em",
  paddingX: "0.55em",
  paddingY: "0.45em",
  borderRadius: nodeBorderRadius(visualState),
  borderWidth: nodeBorderWidth(visualState),
  borderStyle: "solid",
  borderColor: nodeBorderColor(visualState),
  background: nodeBackground(visualState),
  boxShadow: nodeBoxShadow(visualState),
  justifyContent: "center",
  alignItems: "center",
  gap: "0.15em",
  transition:
    "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
  },
  "&::after": nestedPanelSxProps(visualState.nestedPanel),
  "& button": {
    color: nodeButtonColor(visualState),
  },
});
