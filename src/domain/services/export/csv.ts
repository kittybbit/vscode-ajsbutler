import { Table as ReactTable } from '@tanstack/react-table';
import { UnitEntity } from '../../models/UnitEntities';
import { Parameter } from '../../models/ParameterEntities';

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
        .map(row => {
            return row
                .getVisibleCells()
                .map(cell => {
                    if (!cell) {
                        return '""';
                    }
                    const value = cell.getValue<Parameter | Parameter[] | string | boolean | number | undefined>();
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
                    } else if (typeof value === 'boolean' || typeof value === 'number') {
                        return `"${value}"`;
                    }
                    return `"${value}"`;
                })
                .join(',')
        })
        .reduce((rows, value) => {
            rows.push(value);
            return rows;
        }, rows);
    return rows.join('\n');
}