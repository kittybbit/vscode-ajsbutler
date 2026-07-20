export type ExportUnitListCsvInput = {
  headerRows: string[][];
  rows: ExportUnitListCsvRowInput[];
};

export type ExportUnitListCsvRowInput = {
  values: string[];
};

const escapeCsvValue = (value: string): string =>
  `"${value.replace(/"/g, '""')}"`;

const joinCsvRow = (values: string[]): string =>
  values.map(escapeCsvValue).join(",");

export const exportUnitListCsv = (input: ExportUnitListCsvInput): string => {
  const headerRows = input.headerRows.map(joinCsvRow);
  const dataRows = input.rows.map((row, rowIndex) =>
    joinCsvRow([String(rowIndex + 1), ...row.values]),
  );
  return [...headerRows, ...dataRows].join("\n");
};
