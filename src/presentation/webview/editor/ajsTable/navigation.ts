import type { MouseEvent } from "react";
import type { TableUnitMetadata } from "./tableViewerData";
import { createViewerNavigationRequest } from "../../viewerRequestMessages";
import { isTableGridNavigationKey } from "./tableNavigationModel";
export {
  decideTableGridNavigation,
  decideTableGridRestoration,
  getTableGridFocusKey,
  isTableGridNavigationKey,
  moveTableGridFocus,
  resolveTableGridCommitPath,
  resolveTableGridFocus,
  resolveTableGridRestorationFocus,
  resolveUnitListGridShortcut,
} from "./tableNavigationModel";
export type {
  TableGridFocus,
  TableGridFocusRequest,
  TableGridNavigationContext,
  TableNavigationDecision,
  UnitListGridShortcut,
  UnitListGridShortcutContext,
} from "./tableNavigationModel";

type PostViewerMessage = (
  message: ReturnType<typeof createViewerNavigationRequest>,
) => void | PromiseLike<boolean>;

export type TableRowSelectionAction =
  | { type: "select"; absolutePath: string }
  | { type: "documentChanged" };

export type TableRowSelectionState = {
  absolutePath: string;
  selectedAbsolutePath: string | undefined;
  index: number;
  revealedRowIndex: number | undefined;
};

export const isTableGridNavigationEventOwnedByCell = (
  target: EventTarget | null,
  currentTarget: EventTarget | null,
  key: string,
  ctrlKey = false,
): boolean => {
  if (target === currentTarget) return true;
  if (!isTableGridNavigationKey(key, ctrlKey)) return false;
  const candidate = target as
    | { closest?: (selector: string) => unknown }
    | undefined;
  return candidate?.closest?.('[role="gridcell"]') === currentTarget;
};

export const getStickyColumnRevealScrollLeft = (
  currentScrollLeft: number,
  targetLeft: number,
  stickyColumnRight: number,
): number =>
  targetLeft < stickyColumnRight
    ? Math.max(0, currentScrollLeft - (stickyColumnRight - targetLeft))
    : currentScrollLeft;

export const reduceTableRowSelection = (
  currentAbsolutePath: string | undefined,
  action: TableRowSelectionAction,
): string | undefined => {
  if (action.type === "documentChanged") return undefined;
  if (action.absolutePath === currentAbsolutePath) return currentAbsolutePath;
  return action.absolutePath;
};

export const canNavigateToSelectedUnit = (
  absolutePath: string | undefined,
): absolutePath is string => !!absolutePath;

export const isTableRowSelected = ({
  absolutePath,
  selectedAbsolutePath,
}: TableRowSelectionState): boolean => absolutePath === selectedAbsolutePath;

export const navigateToFlow = (
  absolutePath: string,
  postMessage: PostViewerMessage = (message) =>
    window.vscode.postMessage(message),
): void => {
  postMessage(createViewerNavigationRequest("flow", absolutePath));
};

export const selectUnitTreeUnitInTable = (
  unitId: string,
  unitById: ReadonlyMap<string, TableUnitMetadata>,
  revealPath: (absolutePath: string) => void,
): void => {
  const unit = unitById.get(unitId);
  if (unit) revealPath(unit.absolutePath);
};

export const openUnitTreeUnitInFlow = (
  unitId: string,
  unitById: ReadonlyMap<string, TableUnitMetadata>,
  navigate: (absolutePath: string) => void = navigateToFlow,
): void => {
  const unit = unitById.get(unitId);
  if (unit) navigate(unit.absolutePath);
};

export const handleJumpLinkClick =
  (targetIdentity: string, handleJump: (identity: string) => void) =>
  (event: Pick<MouseEvent<HTMLElement>, "stopPropagation">): void => {
    event.stopPropagation();
    handleJump(targetIdentity);
  };
