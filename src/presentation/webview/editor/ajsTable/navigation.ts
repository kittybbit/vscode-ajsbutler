import type { KeyboardEvent } from "react";
import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import { createNavigationEvent } from "../../../../shared/webviewEvents";

type PostViewerMessage = (
  message: ReturnType<typeof createNavigationEvent>,
) => void | PromiseLike<boolean>;

export type TableRowSelectionAction =
  | { type: "select"; absolutePath: string }
  | { type: "documentChanged" };

export const reduceTableRowSelection = (
  currentAbsolutePath: string | undefined,
  action: TableRowSelectionAction,
): string | undefined =>
  action.type === "select"
    ? action.absolutePath === currentAbsolutePath
      ? currentAbsolutePath
      : action.absolutePath
    : undefined;

export const canNavigateToSelectedUnit = (
  absolutePath: string | undefined,
): absolutePath is string => !!absolutePath;

export const isTableRowSelected = (
  absolutePath: string,
  selectedAbsolutePath: string | undefined,
  index: number,
  revealedRowIndex: number | undefined,
): boolean =>
  absolutePath === selectedAbsolutePath || index === revealedRowIndex;

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
  (absolutePath: string, selectRow: (absolutePath: string) => void) =>
  (): void => {
    selectRow(absolutePath);
  };

export const handleSelectTableRowKeyDown =
  (absolutePath: string, selectRow: (absolutePath: string) => void) =>
  (
    event: Pick<
      KeyboardEvent<HTMLElement>,
      "currentTarget" | "key" | "preventDefault" | "target"
    >,
  ): void => {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    selectRow(absolutePath);
  };
