export type ExportUnitListCsvInput = {
  headerRows: string[][];
  dataRows: string[][];
};

const escapeCsvValue = (value: string): string =>
  `"${value.replace(/"/g, '""')}"`;

const joinCsvRow = (values: string[]): string =>
  values.map(escapeCsvValue).join(",");

export const exportUnitListCsv = (input: ExportUnitListCsvInput): string => {
  const headerRows = input.headerRows.map(joinCsvRow);
  const dataRows = input.dataRows.map(joinCsvRow);
  return [...headerRows, ...dataRows].join("\n");
};
