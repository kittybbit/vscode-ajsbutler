import type { KeyboardEvent } from "react";
import type { MouseEvent } from "react";
import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import { createNavigationEvent } from "../../../../shared/webviewEvents";

type PostViewerMessage = (
  message: ReturnType<typeof createNavigationEvent>,
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

export const reduceTableRowSelection = (
  currentAbsolutePath: string | undefined,
  action: TableRowSelectionAction,
): string | undefined => {
  if (action.type === "documentChanged") {
    return undefined;
  }
  if (action.absolutePath === currentAbsolutePath) {
    return currentAbsolutePath;
  }
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
  postMessage(createNavigationEvent("flow", absolutePath));
};

export const selectUnitTreeUnitInTable = (
  unitId: string,
  unitById: ReadonlyMap<string, AjsUnit>,
  revealPath: (absolutePath: string) => void,
): void => {
  const unit = unitById.get(unitId);
  if (unit) {
    revealPath(unit.absolutePath);
  }
};

export const openUnitTreeUnitInFlow = (
  unitId: string,
  unitById: ReadonlyMap<string, AjsUnit>,
  navigate: (absolutePath: string) => void = navigateToFlow,
): void => {
  const unit = unitById.get(unitId);
  if (unit) {
    navigate(unit.absolutePath);
  }
};

export const handleSelectTableRow =
  (
    absolutePath: string,
    selectRow: (absolutePath: string) => void,
    reportOperation?: () => void,
  ) =>
  (): void => {
    reportOperation?.();
    selectRow(absolutePath);
  };

export const handleJumpLinkClick =
  (targetIdentity: string, handleJump: (identity: string) => void) =>
  (event: Pick<MouseEvent<HTMLElement>, "stopPropagation">): void => {
    event.stopPropagation();
    handleJump(targetIdentity);
  };

const isRowActivationKey = (key: string): boolean =>
  key === "Enter" || key === " ";

const isOwnRowKeyboardEvent = (
  event: Pick<KeyboardEvent<HTMLElement>, "currentTarget" | "target">,
): boolean => event.target === event.currentTarget;

export const handleSelectTableRowKeyDown =
  (
    absolutePath: string,
    selectRow: (absolutePath: string) => void,
    reportOperation?: () => void,
  ) =>
  (
    event: Pick<
      KeyboardEvent<HTMLElement>,
      "currentTarget" | "key" | "preventDefault" | "target"
    >,
  ): void => {
    if (!isOwnRowKeyboardEvent(event) || !isRowActivationKey(event.key)) {
      return;
    }
    event.preventDefault();
    reportOperation?.();
    selectRow(absolutePath);
  };
