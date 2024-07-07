import { Table as ReactTable } from '@tanstack/react-table';
import { UnitEntity } from '../../models/UnitEntities';
import { Parameter } from '../../models/ParameterEntities';
import { AccessorType } from '../../../ui-component/editor/ajsTable/tableColumnDef';

export const toCsv = (table: ReactTable<UnitEntity>): string => {
    const rows: Array<string> = [];
    // header
    table
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
        ))
        .reduce((rows, value) => {
            rows.push(value);
            return rows;
        }, rows);
    // data
    table
        .getRowModel()
        .rows
        .map((row, rowIndex) => {
            return row
                .getVisibleCells()
                .map((cell, cellIndex) => {
                    if (cellIndex === 0) {
                        return `"${rowIndex + 1}"`
                    }
                    const value = cell.getValue<AccessorType | undefined>();
                    if (value === undefined) {
                        return '';
                    } else if (Array.isArray(value)) {
                        return `"${value
                            .map(v => {
                                if (v instanceof Parameter) {
                                    return v.value()?.replace(/"/g, '""');
                                }
                                return v;
                            })
                            .join('\n')
                            }"`;
                    } else if (value instanceof Parameter) {
                        return `"${value.value()?.replace(/"/g, '""')}"`;
                    } else if (typeof value === 'string') {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return `"${String(value)}"`;
                })
                .join(',')
        })
        .reduce((rows, value) => {
            rows.push(value);
            return rows;
        }, rows);
    return rows.join('\n');
}