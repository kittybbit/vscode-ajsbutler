export type ExportUnitListCsvInput = {
  headerRows: string[][];
  dataRows: string[][];
};

export type ExportUnitListCsvColumnInput<TRow> = {
  value: (row: TRow, rowIndex: number) => string;
};

export type ExportUnitListCsvRowsInput<TRow> = {
  headerRows: string[][];
  rows: TRow[];
  columns: ExportUnitListCsvColumnInput<TRow>[];
};

const escapeCsvValue = (value: string): string =>
  `"${value.replace(/"/g, '""')}"`;

const joinCsvRow = (values: string[]): string =>
  values.map(escapeCsvValue).join(",");

export const buildExportUnitListCsvInput = <TRow>(
  input: ExportUnitListCsvRowsInput<TRow>,
): ExportUnitListCsvInput => ({
  headerRows: input.headerRows,
  dataRows: input.rows.map((row, rowIndex) => [
    String(rowIndex + 1),
    ...input.columns.map((column) => column.value(row, rowIndex)),
  ]),
});

export const exportUnitListCsv = (input: ExportUnitListCsvInput): string => {
  const headerRows = input.headerRows.map(joinCsvRow);
  const dataRows = input.dataRows.map(joinCsvRow);
  return [...headerRows, ...dataRows].join("\n");
};

export const exportUnitListCsvRows = <TRow>(
  input: ExportUnitListCsvRowsInput<TRow>,
): string => exportUnitListCsv(buildExportUnitListCsvInput(input));
