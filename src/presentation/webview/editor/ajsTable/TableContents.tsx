import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme, type Theme } from "@mui/material/styles";
import { type Table as ReactTable } from "@tanstack/react-table";
import { Row, SortingState, VisibilityState } from "@tanstack/table-core";
import { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import {
  toCountBucket,
  toDurationBucket,
} from "../../../../application/telemetry/telemetryBuckets";
import { useMyAppContext } from "../MyContexts";
import { ParameterSearchValuesByPath } from "./globalFilter";
import Header from "./Header";
import VirtualizedTable from "./VirtualizedTable";
import UnitDefinitionDialog from "../UnitDefinitionDialog";
import { CHANGE_DOCUMENT, REVEAL_UNIT } from "../../viewerHostMessages";
import {
  createViewerOperationRequest,
  createViewerPerformanceRequest,
  createViewerReadyRequest,
} from "../../viewerRequestMessages";
import UnitTreeSelector, {
  type UnitTreeFocusRequest,
} from "../shared/UnitTreeSelector";
import {
  navigateToFlow,
  openUnitTreeUnitInFlow,
  reduceTableRowSelection,
  selectUnitTreeUnitInTable,
} from "./navigation";
import type { TableGridFocusRequest } from "./tableNavigationModel";
import { getTableSearchResultPosition } from "./tableSearchState";
import type {
  TableSearchDirection,
  TableSearchState,
} from "./tableSearchState";
import UnitListDetailPanel from "./UnitListDetailPanel";
import {
  createUnitListDetailResolver,
  resolveUnitListDetail,
} from "./unitListDetail";
import {
  findRowIndexByIdentity,
  useTableRowRevealState,
} from "./tableRowReveal";
import { useTableSearchController } from "./tableSearchController";
import { useTableModelSetup } from "./tableModel";
import {
  createTableViewerData,
  findSelectedUnitId,
  parseTableViewerData,
  type TableRowView,
  type TableUnitMetadata,
  type TableViewerData,
} from "./tableViewerData";
import {
  ViewerAnnouncementHost,
  type ViewerAnnouncementHostHandle,
} from "../shared/viewerAnnouncements";
import { viewerThemeGlobalStyles } from "../shared/viewerThemeStyles";
import {
  formatUnitInformationMessage,
  unitInformationMessage,
} from "../unitInformationLocalization";
import type { TableGridFocus } from "./tableNavigationModel";

export type AjsTableSearchState = {
  query: string;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
};

type TableDocumentState = {
  viewerData: TableViewerData;
  changeDocument: (type: string, data: unknown) => void;
  documentRevision: number;
};

type TableViewerShellProps = {
  theme: Theme;
  table: ReactTable<TableRowView>;
  rows: Row<TableRowView>[];
  totalRowCount: number;
  searchQuery: string;
  searchState: TableSearchState;
  onSearchNavigate: (query: string, direction: TableSearchDirection) => void;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
  rowIndex: number | undefined;
  columnVisibility: VisibilityState;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  detailPaneClosed: boolean;
  closeDetailPane: VoidFunction;
  detailFocusRequestRevision: number;
  dialogData: UnitDefinitionDialogDto | undefined;
  setDialogData: React.Dispatch<
    React.SetStateAction<UnitDefinitionDialogDto | undefined>
  >;
  selectedAbsolutePath: string | undefined;
  selectedDetail: ReturnType<typeof resolveUnitListDetail>;
  selectedUnitId: string | undefined;
  selectRow: (absolutePath: string) => void;
  commitFocusedRow: (absolutePath?: string) => string | undefined;
  openDetailPane: (absolutePath: string) => void;
  handleDetailFocusRequest: (revision: number) => void;
  returnToGrid: VoidFunction;
  restoreGridFocusRequest: TableGridFocusRequest;
  focusTreeRequest: UnitTreeFocusRequest;
  rootUnits: TableViewerData["rootUnits"];
  unitById: ReadonlyMap<string, TableUnitMetadata>;
  selectTreeUnit: (unitId: string) => void;
  focusUnitTree: (absolutePath?: string) => void;
  onGridFocusChange: (focus: TableGridFocus) => void;
  documentRevision: number;
  openTreeUnitScope: (unitId: string) => void;
  onCopied: () => void;
  announcementHostRef: React.RefObject<ViewerAnnouncementHostHandle | null>;
  gridAriaLabel: string;
};

type ParsedTableDocumentState = {
  tableData: TableViewerData["tableData"];
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
  viewerData: TableViewerData;
};

const isSelectableTableFlowScopeUnit = (unit: {
  unitType: string;
  isRootJobnet: boolean;
}): boolean => unit.unitType === "n" && unit.isRootJobnet;

export const parseTableDocumentState = (
  data: unknown,
): ParsedTableDocumentState => {
  const viewerData = parseTableViewerData(data);
  return {
    tableData: viewerData.tableData,
    unitDefinitionByPath: viewerData.unitDefinitionByPath,
    viewerData,
  };
};

const useChangeDocument = (): TableDocumentState => {
  const [viewerData, setViewerData] = useState<TableViewerData>(() =>
    createTableViewerData(undefined, new Map()),
  );
  const [documentRevision, setDocumentRevision] = useState(0);
  const changeDocument = useCallback((type: string, data: unknown) => {
    try {
      const nextState = parseTableDocumentState(data);
      setViewerData(() => nextState.viewerData);
    } catch (error) {
      console.error("Failed to parse data:", error);
      setViewerData(() => createTableViewerData(undefined, new Map()));
    }
    setDocumentRevision((revision) => revision + 1);
  }, []);
  return { viewerData, changeDocument, documentRevision };
};

const useTableViewerTheme = (isDarkMode: boolean): Theme =>
  useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode],
  );

const reportTableOperation = (
  operation: Parameters<typeof createViewerOperationRequest>[0],
): void => {
  window.vscode.postMessage(createViewerOperationRequest(operation));
};

export const createTableRenderReadyEvent = (
  durationMs: number,
  rowCount: number,
) =>
  createViewerPerformanceRequest({
    operation: "table_render",
    result: "success",
    durationBucket: toDurationBucket(durationMs),
    rowCountBucket: toCountBucket(rowCount),
  });

const TableViewerShell = ({
  theme,
  table,
  rows,
  totalRowCount,
  searchQuery,
  searchState,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
  rowIndex,
  columnVisibility,
  parameterSearchValuesByPath,
  detailPaneClosed,
  closeDetailPane,
  detailFocusRequestRevision,
  dialogData,
  setDialogData,
  selectedAbsolutePath,
  selectedDetail,
  selectRow,
  commitFocusedRow,
  openDetailPane,
  handleDetailFocusRequest,
  returnToGrid,
  restoreGridFocusRequest,
  focusTreeRequest,
  selectedUnitId,
  rootUnits,
  unitById,
  selectTreeUnit,
  focusUnitTree,
  onGridFocusChange,
  documentRevision,
  openTreeUnitScope,
  onCopied,
  announcementHostRef,
  gridAriaLabel,
}: TableViewerShellProps) => (
  <>
    <ThemeProvider theme={theme}>
      <ViewerAnnouncementHost
        key={documentRevision}
        ref={announcementHostRef}
      />
      <CssBaseline />
      <GlobalStyles styles={viewerThemeGlobalStyles} />
      <Stack
        direction="column"
        spacing={0}
        sx={{
          width: "100%",
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Header
          table={table}
          columnVisibility={columnVisibility}
          searchedAbsolutePath={searchState.searchedAbsolutePath}
          searchResultPosition={getTableSearchResultPosition(searchState)}
          onSearchNavigate={onSearchNavigate}
          onSearchSubmit={onSearchSubmit}
          onSearchClear={onSearchClear}
          onCopied={onCopied}
          visibleRowCount={rows.length}
          totalRowCount={totalRowCount}
        />
        <Box
          sx={{
            width: "100%",
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            padding: 1.25,
            background: (theme) =>
              `radial-gradient(circle at top left, ${theme.palette.primary.light}12, transparent 28%), linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
            "body.vscode-high-contrast &": {
              background: "var(--vscode-editor-background, Canvas)",
            },
            boxSizing: "border-box",
          }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              width: "100%",
              height: "100%",
              minWidth: 0,
              minHeight: 0,
            }}
          >
            <UnitTreeSelector
              rootUnits={rootUnits}
              unitById={unitById}
              selectedUnitId={selectedUnitId}
              focusRequest={focusTreeRequest}
              autoScrollSelectedUnit={false}
              canOpenScopeUnit={isSelectableTableFlowScopeUnit}
              onOpenScope={openTreeUnitScope}
              onSelectUnit={selectTreeUnit}
            />
            <Box
              sx={{
                flex: 1,
                height: "100%",
                minWidth: 0,
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <VirtualizedTable
                headerGroups={table.getHeaderGroups()}
                rows={rows}
                rowIndex={rowIndex}
                columnVisibility={columnVisibility}
                searchQuery={searchQuery}
                parameterSearchValuesByPath={parameterSearchValuesByPath}
                selectedAbsolutePath={selectedAbsolutePath}
                selectRow={selectRow}
                commitFocusedRow={commitFocusedRow}
                focusUnitTree={focusUnitTree}
                openDetailPane={openDetailPane}
                restoreFocusRequest={restoreGridFocusRequest}
                documentRevision={documentRevision}
                onGridFocusChange={onGridFocusChange}
                gridAriaLabel={gridAriaLabel}
              />
            </Box>
            {selectedDetail && !detailPaneClosed && (
              <UnitListDetailPanel
                detail={selectedDetail}
                focusRequestRevision={detailFocusRequestRevision}
                onClose={closeDetailPane}
                onFocusRequestHandled={handleDetailFocusRequest}
                onOpenDefinition={() => {
                  reportTableOperation("definition.open");
                  setDialogData(selectedDetail.definition);
                }}
                onOpenFlow={() =>
                  navigateToFlow(selectedDetail.row.absolutePath)
                }
                onReturnFocus={returnToGrid}
              />
            )}
          </Stack>
        </Box>
      </Stack>
      {dialogData && (
        <UnitDefinitionDialog
          dialogData={dialogData}
          onClose={() => setDialogData(undefined)}
        />
      )}
    </ThemeProvider>
    {DEVELOPMENT && (
      <Accordion>
        <AccordionSummary>[DEV] TABLE STATE</AccordionSummary>
        <AccordionDetails>
          <Typography>{JSON.stringify(table.getState(), null, 2)}</Typography>
        </AccordionDetails>
      </Accordion>
    )}
  </>
);

const TableContents = () => {
  console.log("render TableContents.");

  const { isDarkMode, lang } = useMyAppContext();
  const renderReadyStartedAt = useRef(performance.now());
  const announcementHostRef = useRef<ViewerAnnouncementHostHandle>(null);
  const announceTable = useCallback((eventKey: string, message: string) => {
    announcementHostRef.current?.announce({ eventKey, message });
  }, []);

  const [dialogData, setDialogData] = useState<
    UnitDefinitionDialogDto | undefined
  >();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [detailPaneClosed, setDetailPaneClosed] = useState(false);
  const [detailFocusRequestRevision, setDetailFocusRequestRevision] =
    useState(0);
  const [restoreGridFocusRequest, setRestoreGridFocusRequest] =
    useState<TableGridFocusRequest>({ revision: 0 });
  const [focusTreeRequest, setFocusTreeRequest] =
    useState<UnitTreeFocusRequest>({ revision: 0 });
  const [selectedAbsolutePath, dispatchRowSelection] = useReducer(
    reduceTableRowSelection,
    undefined,
  );
  const committedAbsolutePathRef = useRef<string | undefined>(undefined);
  const focusedGridFocusRef = useRef<TableGridFocus | undefined>(undefined);
  const observedDocumentRevisionRef = useRef(0);
  const commitRowSelection = useCallback((absolutePath: string) => {
    if (committedAbsolutePathRef.current === absolutePath) return false;
    committedAbsolutePathRef.current = absolutePath;
    setDetailPaneClosed(false);
    reportTableOperation("unit.select");
    dispatchRowSelection({ type: "select", absolutePath });
    return true;
  }, []);
  const selectRow = useCallback(
    (absolutePath: string) => {
      commitRowSelection(absolutePath);
    },
    [commitRowSelection],
  );
  const commitFocusedRow = useCallback(
    (absolutePath?: string): string | undefined => {
      const focusedPath =
        focusedGridFocusRef.current?.kind === "cell"
          ? focusedGridFocusRef.current.absolutePath
          : undefined;
      const targetPath =
        absolutePath ?? focusedPath ?? committedAbsolutePathRef.current;
      if (!targetPath) return undefined;
      commitRowSelection(targetPath);
      return targetPath;
    },
    [commitRowSelection],
  );
  const requestGridFocus = useCallback((absolutePath?: string) => {
    setRestoreGridFocusRequest((request) => ({
      revision: request.revision + 1,
      absolutePath,
    }));
  }, []);
  const closeDetailPane = useCallback(() => {
    const targetPath = commitFocusedRow();
    setDetailPaneClosed(true);
    requestGridFocus(targetPath);
  }, [commitFocusedRow, requestGridFocus]);
  const openDetailPane = useCallback(() => {
    setDetailFocusRequestRevision((revision) => revision + 1);
  }, []);
  const handleDetailFocusRequest = useCallback((revision: number) => {
    setDetailFocusRequestRevision((current) =>
      current === revision ? 0 : current,
    );
  }, []);
  const returnToGrid = useCallback(() => {
    const targetPath = commitFocusedRow();
    requestGridFocus(targetPath);
  }, [commitFocusedRow, requestGridFocus]);
  const { viewerData, changeDocument, documentRevision } = useChangeDocument();
  const { tableData } = viewerData;
  if (observedDocumentRevisionRef.current !== documentRevision) {
    observedDocumentRevisionRef.current = documentRevision;
    committedAbsolutePathRef.current = undefined;
    focusedGridFocusRef.current = undefined;
  } else {
    committedAbsolutePathRef.current = selectedAbsolutePath;
  }
  const rowViews = tableData?.rows;
  const rowsRef = useRef<ReadonlyArray<Row<TableRowView>>>([]);
  const { handleJump, revealPath, revealUnit } = useTableRowRevealState(
    selectRow,
    rowsRef,
    requestGridFocus,
  );

  const selectTreeUnit = useCallback(
    (unitId: string) => {
      selectUnitTreeUnitInTable(unitId, viewerData.unitById, revealPath);
    },
    [revealPath, viewerData.unitById],
  );
  const openTreeUnitScope = useCallback(
    (unitId: string) => {
      openUnitTreeUnitInFlow(unitId, viewerData.unitById);
    },
    [viewerData.unitById],
  );

  const { table, parameterSearchValuesByPath } = useTableModelSetup({
    rowViews,
    parameterSearchValuesByPath: viewerData.parameterSearchValuesByPath,
    lang,
    handleJump,
    rowViewByPath: viewerData.rowViewByPath,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
  });

  const rows = table.getRowModel().rows;
  rowsRef.current = rows;
  const rowIndex = findRowIndexByIdentity(rows, selectedAbsolutePath);
  const selectedUnitId = findSelectedUnitId(
    selectedAbsolutePath,
    viewerData.unitByAbsolutePath,
  );
  const focusUnitTree = useCallback(
    (absolutePath?: string) => {
      const targetPath = absolutePath ?? committedAbsolutePathRef.current;
      const targetUnitId = targetPath
        ? viewerData.unitByAbsolutePath.get(targetPath)?.id
        : selectedUnitId;
      setFocusTreeRequest((request) => ({
        revision: request.revision + 1,
        targetUnitId,
      }));
    },
    [selectedUnitId, viewerData.unitByAbsolutePath],
  );
  const onGridFocusChange = useCallback((focus: TableGridFocus): void => {
    focusedGridFocusRef.current = focus;
  }, []);
  const resolveSelectedDetail = useMemo(
    () =>
      createUnitListDetailResolver(
        viewerData.rowViewByPath,
        viewerData.unitDefinitionByPath,
      ),
    [viewerData.rowViewByPath, viewerData.unitDefinitionByPath],
  );
  const selectedDetail = useMemo(
    () => resolveSelectedDetail(selectedAbsolutePath),
    [resolveSelectedDetail, selectedAbsolutePath],
  );

  const getTableUnitName = useCallback(
    (absolutePath: string): string =>
      viewerData.unitByAbsolutePath.get(absolutePath)?.name ?? absolutePath,
    [viewerData.unitByAbsolutePath],
  );

  const previousSelectedPathRef = useRef<string | undefined>(undefined);
  const hasObservedSelectedPathRef = useRef(false);
  useEffect(() => {
    if (!hasObservedSelectedPathRef.current) {
      hasObservedSelectedPathRef.current = true;
      previousSelectedPathRef.current = selectedAbsolutePath;
      return;
    }
    if (selectedAbsolutePath) {
      announceTable(
        `table:selected:${selectedAbsolutePath}`,
        formatUnitInformationMessage("a11y.announce.selected", lang, {
          unit: getTableUnitName(selectedAbsolutePath),
        }),
      );
    }
    previousSelectedPathRef.current = selectedAbsolutePath;
  }, [announceTable, getTableUnitName, lang, selectedAbsolutePath]);

  const {
    searchQuery,
    searchState,
    navigateSearch,
    submitSearch,
    resetSearch,
  } = useTableSearchController({
    rows,
    parameterSearchValuesByPath,
    revealPath,
  });

  const previousSearchSignatureRef = useRef<string | undefined>(undefined);
  const hasObservedSearchRef = useRef(false);
  useEffect(() => {
    const position = getTableSearchResultPosition(searchState);
    const signature = position
      ? `${searchState.searchedAbsolutePath ?? ""}:${position.current}:${position.total}`
      : undefined;
    if (!hasObservedSearchRef.current) {
      hasObservedSearchRef.current = true;
      previousSearchSignatureRef.current = signature;
      return;
    }
    if (!position) {
      announceTable(
        "table:search:cleared",
        unitInformationMessage("a11y.announce.searchCleared", lang),
      );
    } else if (position.total === 0) {
      announceTable(
        "table:search:no-results",
        unitInformationMessage("a11y.announce.searchNoResults", lang),
      );
    } else if (searchState.searchedAbsolutePath) {
      announceTable(
        `table:search:${signature}`,
        formatUnitInformationMessage("a11y.announce.searchResults", lang, {
          count: position.total,
          current: position.current,
          total: position.total,
          unit: getTableUnitName(searchState.searchedAbsolutePath),
        }),
      );
    }
    previousSearchSignatureRef.current = signature;
  }, [announceTable, getTableUnitName, lang, searchState]);

  const previousSortingSignatureRef = useRef<string | undefined>(undefined);
  const hasObservedSortingRef = useRef(false);
  useEffect(() => {
    const sort = sorting[0];
    const signature = sort
      ? `${sort.id}:${sort.desc ? "desc" : "asc"}`
      : undefined;
    if (!hasObservedSortingRef.current) {
      hasObservedSortingRef.current = true;
      previousSortingSignatureRef.current = signature;
      return;
    }
    announceTable(
      `table:sort:${signature ?? "none"}`,
      formatUnitInformationMessage("a11y.announce.sorted", lang, {
        direction: unitInformationMessage(
          sort
            ? sort.desc
              ? "a11y.sort.descending"
              : "a11y.sort.ascending"
            : "a11y.sort.none",
          lang,
        ),
      }),
    );
    previousSortingSignatureRef.current = signature;
  }, [announceTable, lang, sorting]);

  const copiedAnnouncementRevisionRef = useRef(0);
  const handleCopied = useCallback(() => {
    copiedAnnouncementRevisionRef.current += 1;
    announceTable(
      `table:copied:${copiedAnnouncementRevisionRef.current}`,
      unitInformationMessage("a11y.announce.csvCopied", lang),
    );
  }, [announceTable, lang]);

  useEffect(() => {
    dispatchRowSelection({ type: "documentChanged" });
    resetSearch();
  }, [resetSearch, tableData]);

  useEffect(() => {
    window.EventBridge.addCallback(CHANGE_DOCUMENT, changeDocument);
    const revealUnitFn = (_type: string, data: unknown) => {
      if (revealUnit(data)) resetSearch();
    };
    window.EventBridge.addCallback(REVEAL_UNIT, revealUnitFn);
    window.vscode.postMessage(
      createTableRenderReadyEvent(
        performance.now() - renderReadyStartedAt.current,
        rowViews?.length ?? 0,
      ),
    );
    window.vscode.postMessage(createViewerReadyRequest());
    return () => {
      window.EventBridge.removeCallback(CHANGE_DOCUMENT, changeDocument);
      window.EventBridge.removeCallback(REVEAL_UNIT, revealUnitFn);
    };
  }, [changeDocument, resetSearch, revealUnit]); // fire this when mount.

  const theme = useTableViewerTheme(isDarkMode);

  return (
    <TableViewerShell
      theme={theme}
      table={table}
      rows={rows}
      totalRowCount={rowViews?.length ?? 0}
      searchQuery={searchQuery}
      searchState={searchState}
      onSearchNavigate={navigateSearch}
      onSearchSubmit={submitSearch}
      onSearchClear={resetSearch}
      rowIndex={rowIndex}
      columnVisibility={columnVisibility}
      parameterSearchValuesByPath={parameterSearchValuesByPath}
      detailPaneClosed={detailPaneClosed}
      closeDetailPane={closeDetailPane}
      detailFocusRequestRevision={detailFocusRequestRevision}
      dialogData={dialogData}
      setDialogData={setDialogData}
      selectedAbsolutePath={selectedAbsolutePath}
      selectedDetail={selectedDetail}
      selectedUnitId={selectedUnitId}
      selectRow={selectRow}
      commitFocusedRow={commitFocusedRow}
      openDetailPane={openDetailPane}
      handleDetailFocusRequest={handleDetailFocusRequest}
      returnToGrid={returnToGrid}
      restoreGridFocusRequest={restoreGridFocusRequest}
      focusTreeRequest={focusTreeRequest}
      rootUnits={viewerData.rootUnits}
      unitById={viewerData.unitById}
      selectTreeUnit={selectTreeUnit}
      focusUnitTree={focusUnitTree}
      onGridFocusChange={onGridFocusChange}
      documentRevision={documentRevision}
      openTreeUnitScope={openTreeUnitScope}
      onCopied={handleCopied}
      announcementHostRef={announcementHostRef}
      gridAriaLabel={unitInformationMessage("a11y.table.grid", lang)}
    />
  );
};
export default memo(TableContents);
