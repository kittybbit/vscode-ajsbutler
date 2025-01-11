import { Table as ReactTable } from '@tanstack/react-table';
import { UnitEntity } from '../../models/units/UnitEntities';
import Parameter from '../../models/parameters/Parameter';
import { AccessorType } from '@ui-component/editor/ajsTable/columnDefs/common';

const createHeader = (table: ReactTable<UnitEntity>) => table
    .getHeaderGroups()
    .map(headerGroup => (
        headerGroup
            .headers
            .map(header => {
                const isPlaceholder = header.isPlaceholder;
                const span = header.colSpan;
                const emptyHeader = span > 1 ? new Array(span).join(',""') : '';
                if (isPlaceholder) {
                    return '""' + emptyHeader;
                }
                return `"${header.getContext().column.columnDef.header?.toString()}"${emptyHeader}`;
            })
            .join(',')
    ));

const escapeValue = (value: string): string => value.replace(/"/g, '""');
const processValue = (value: AccessorType | undefined): string => {
    if (value === undefined) return ''; // Handle undefined values

    if (Array.isArray(value)) {
        // Handle array values
        return `"${value
            .map(v => (v instanceof Parameter
                ? escapeValue(v.value() || '')
                : String(v))).join('\n')}"`;
    }

    if (value instanceof Parameter) {
        // Handle Parameter type
        return `"${escapeValue(value.value() || '')}"`;
    }

    if (typeof value === 'string') {
        // Handle string type
        return `"${escapeValue(value)}"`;
    }

    // Fallback for other types
    return `"${String(value)}"`;
};
const createData = (table: ReactTable<UnitEntity>): string[] => {

    return table
        .getRowModel()
        .rows
        .map((row, rowIndex) => {
            // Process each row's cells
            return row
                .getVisibleCells()
                .map((cell, cellIndex) => {
                    // Handle the first column differently
                    if (cellIndex === 0) {
                        return `"${rowIndex + 1}"`;
                    }

                    // Process the value of the cell
                    const value = cell.getValue<AccessorType | undefined>();
                    return processValue(value);
                })
                .join(','); // Join cell values with a comma
        });
};

export const toCsv = (table: ReactTable<UnitEntity>): string => {
    // header
    const header = createHeader(table);
    // data
    const data = createData(table);
    return header.concat(data).join('\n');
}