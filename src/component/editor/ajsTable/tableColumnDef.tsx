// import * as vscode from 'vscode';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import { Box, Chip, Rating } from '@mui/material';
import { CellContext, createColumnHelper } from '@tanstack/table-core';
import React from 'react';
import { Cftd, Cl, Cy, Ex, Ey, Gty, Ln, Op, Parameter, Prm, Sd, Sh, Shd, St, Sy, Wc, Wt } from '../../../domain/models/ParameterEntities';
import { G, J, N, Pj, Qj, Rj, Rn, Rp, UnitEntity } from '../../../domain/models/UnitEntities';
import { ajsTableColumnHeaderLang, paramDefinitionLang, tyDefinitionLang } from '../../../domain/services/i18n/nls';
import { ParamSymbol, TySymbol, WeekSymbol } from '../../../domain/values/AjsType';
import * as ajscolumn from '@resource/i18n/ajscolumn';

type BoxType = Parameter | PrimitiveType;
export type AccessorType = BoxType | BoxType[];

const box = (param: BoxType, index: number = 0, fn = (param: BoxType) => {
    if (param instanceof Parameter) {
        return param.value();
    }
    return new String(param).toString();
}) => {
    // String
    if (!(param instanceof Parameter)) {
        return <Box
            key={index}
            data-param={undefined}
            data-raw={param}
            data-inherited={false}
            data-defalut={false}
        >
            {fn(param)}
        </Box>
    }
    // Parameter
    return <Box
        key={index}
        data-param={param.parameter}
        data-raw={param.rawValue}
        data-inherited={param.inherited}
        data-defalut={param.isDefault}
        sx={
            () => {
                if (param.isDefault || param.inherited) {
                    return { color: 'text.disabled' }
                }
                return {}
            }
        }
    >
        {fn(param)}
    </Box>
};

// default setting of 
export const tableDefaultColumnDef = {
    enableHiding: true,
    enableSorting: true,
    cell: (props: CellContext<UnitEntity, unknown>) => {
        const param = props.getValue<AccessorType>();
        // undefined
        if (param === undefined) {
            return undefined;
        }
        if (Array.isArray(param)) {
            return <>{param.map((v, i) => box(v, i))}</>;
        }
        return box(param);
    },
};

export const tableColumnDef = (language: string | undefined = 'en') => {

    // column titles
    const ajsTableColumnHeader = ajsTableColumnHeaderLang(language);
    // tyDefinition
    const tyDefinition = tyDefinitionLang(language);
    // paramter
    const paramDefinition = paramDefinitionLang(language);

    /** accessorFn for cell method of tableDefaultColumnDef. */
    const defaultAccessorFn = <T extends AccessorType>(param: ParamSymbol) => {
        return (row: UnitEntity /*, index: number*/): T => {
            return row.params(param) as T;
        }
    };
    /** When ty matches, invoke accessorFn. */
    const tyAccessorFn = <T extends AccessorType>(targetTy: TySymbol[], accessorFn: (row: UnitEntity, index: number) => T) => {
        return (row: UnitEntity, index: number): T => {
            return targetTy.includes(row.ty.value())
                ? accessorFn(row, index)
                : undefined as T;
        }
    };

    const columnHelper = createColumnHelper<UnitEntity>();

    return [
        columnHelper.display({
            id: '#',
            header: '#',
            cell: props => <span tabIndex={0}>{props.row.index + 1}</span>,
            enableHiding: false,
            enableSorting: false,
            enableGlobalFilter: false,
        }),
        columnHelper.group(
            {
                id: 'group1', //Unit definition information
                header: ajsTableColumnHeader['group1'],
                columns: [
                    {
                        id: 'group1.col1',
                        header: ajsTableColumnHeader['group1.col1'],
                        accessorFn: row => row.name,
                    },
                    {
                        id: 'group1.col2',
                        header: ajsTableColumnHeader['group1.col2'],
                        accessorFn: row => row.parent ? row.parent.absolutePath() : '/',
                    },
                    {
                        id: 'group1.col3',
                        header: ajsTableColumnHeader['group1.col3'],
                        accessorFn: row => {
                            if (row.ty.value() === 'g') {
                                const gty = row.params<Gty>('gty')?.value();
                                return gty === 'p'
                                    ? tyDefinition['g']['gty']['p']
                                    : tyDefinition['g']['gty']['n'];
                            }
                            return tyDefinition[row.ty.value()].name
                        },
                    },
                    {
                        id: 'group1.col4',
                        header: ajsTableColumnHeader['group1.col4'],
                        accessorFn: defaultAccessorFn('cty'),
                    },
                    {
                        id: 'group1.col5',
                        header: ajsTableColumnHeader['group1.col5'],
                        accessorFn: row => row.parent?.el?.find(v => v.name === row.name)?.hv,
                    },
                    {
                        id: 'group1.col6',
                        header: ajsTableColumnHeader['group1.col6'],
                        accessorFn: row => row.sz,
                    }
                ]
            }),
        columnHelper.group({
            id: 'group2', //Unit common definition information
            header: ajsTableColumnHeader['group2'],
            columns: [
                {
                    id: 'group2.col1',
                    header: ajsTableColumnHeader['group2.col1'],
                    accessorFn: row => row.cm,
                },
                {
                    id: 'group2.col2',
                    header: ajsTableColumnHeader['group2.col2'],
                    accessorFn: row => {
                        const ar = row.previous();
                        return ar.map(v => v.f);
                    },
                    cell: props => props
                        .getValue<string[]>()
                        .map((v: string, i: number) => box(v, i)),
                },
                {
                    id: 'group2.col3',
                    header: ajsTableColumnHeader['group2.col3'],
                    accessorFn: row => {
                        const ar = row.previous();
                        return ar.map(v => v.relationType);
                    },
                    cell: props => props
                        .getValue<string[]>()
                        .map((v: string, i: number) => box(v, i)),
                },
                {
                    id: 'group2.col4',
                    header: ajsTableColumnHeader['group2.col4'],
                    accessorFn: defaultAccessorFn('ex'),
                },
                {
                    id: 'group2.col5',
                    header: ajsTableColumnHeader['group2.col5'],
                    accessorFn: defaultAccessorFn('ncl'),
                },
                {
                    id: 'group2.col6',
                    header: ajsTableColumnHeader['group2.col6'],
                    accessorFn: defaultAccessorFn('ncn'),
                },
                {
                    id: 'group2.col7',
                    header: ajsTableColumnHeader['group2.col7'],
                    accessorFn: defaultAccessorFn('ncs'),
                },
                {
                    id: 'group2.col8',
                    header: ajsTableColumnHeader['group2.col8'],
                    accessorFn: defaultAccessorFn('ncex'),
                },
                {
                    id: 'group2.col9',
                    header: ajsTableColumnHeader['group2.col9'],
                    accessorFn: defaultAccessorFn('nchn'),
                },
                {
                    id: 'group2.col10',
                    header: ajsTableColumnHeader['group2.col10'],
                    accessorFn: defaultAccessorFn('ncsv'),
                }
            ]
        }),
        columnHelper.group({
            id: 'group3', //Unit common attributes information
            header: ajsTableColumnHeader['group3'],
            columns: [
                {
                    id: 'group3.col1',
                    header: ajsTableColumnHeader['group3.col1'],
                    accessorFn: defaultAccessorFn('ha'),
                },
                {
                    id: 'group3.col2',
                    header: ajsTableColumnHeader['group3.col2'],
                    accessorFn: row => row.isRecovery(),
                    cell: param => {
                        const isRecovery = param.getValue<boolean | undefined>();
                        if (isRecovery === undefined) {
                            return undefined;
                        }
                        return isRecovery ? <Chip color='secondary' label='Recovery' />
                            : <Chip color='primary' label='Normal' />
                    }
                },
                {
                    id: 'group3.col3',
                    header: ajsTableColumnHeader['group3.col3'],
                    accessorFn: row => row.jp1Username,
                },
                {
                    id: 'group3.col4',
                    header: ajsTableColumnHeader['group3.col4'],
                    accessorFn: row => row.jp1ResourceGroup,
                }
            ]
        }),
        columnHelper.group({
            id: 'group4', //Manager unit definition information
            header: ajsTableColumnHeader['group4'],
            columns: [
                {
                    id: 'group4.col1',
                    header: ajsTableColumnHeader['group4.col1'],
                    accessorFn: tyAccessorFn(['mg', 'mn'], defaultAccessorFn('mh')),
                },
                {
                    id: 'group4.col2',
                    header: ajsTableColumnHeader['group4.col2'],
                    accessorFn: tyAccessorFn(['mg', 'mn'], defaultAccessorFn('mu')),
                }
            ]
        }),
        columnHelper.group({
            id: 'group5', //Job group definition information
            header: ajsTableColumnHeader['group5'],
            columns: [
                {
                    id: 'group5.col1',
                    header: ajsTableColumnHeader['group5.col1'],
                    accessorFn: tyAccessorFn(['g'], defaultAccessorFn('sdd')),
                },
                {
                    id: 'group5.col2',
                    header: ajsTableColumnHeader['group5.col2'],
                    accessorFn: tyAccessorFn(['g'], defaultAccessorFn('md')),
                },
                {
                    id: 'group5.col3',
                    header: ajsTableColumnHeader['group5.col3'],
                    accessorFn: tyAccessorFn(['g'], defaultAccessorFn('stt')),
                },
                {
                    id: 'group5.col4',
                    header: ajsTableColumnHeader['group5.col4'],
                    accessorFn: tyAccessorFn(['g'], defaultAccessorFn('gty')),
                    cell: param => {
                        const gty = param.getValue<Gty | undefined>();
                        if (gty === undefined) {
                            return undefined;
                        }
                        return gty.value() === 'n'
                            ? <Chip color='primary' label='Normal' />
                            : <Chip color='secondary' label='Planning' />;
                    }
                }
            ]
        }),
        columnHelper.group({
            id: 'group6', //Calendar definition information
            header: ajsTableColumnHeader['group6'],
            columns: [
                columnHelper.group({
                    id: 'group6.group1',
                    header: ajsTableColumnHeader['group6.group1'],
                    columns: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'].map((v, i) => {
                        const id = (`group6.group1.col${i + 1}`) as keyof typeof ajscolumn.ajscolumn_en;
                        return {
                            id: id,
                            header: ajsTableColumnHeader[id],
                            accessorFn: tyAccessorFn<boolean | undefined>(['g'], row => {
                                const g = row as G;
                                return g[v as WeekSymbol];
                            }),
                            cell: props => {
                                const result = props.getValue<boolean>();
                                if (result == undefined) {
                                    return undefined;
                                }
                                return result
                                    ? <DoneAllIcon fontSize='small' color='primary' />
                                    : <RemoveDoneIcon fontSize='small' color='primary' />
                            },
                        }
                    }),
                }),
                {
                    id: 'group6.col1',
                    header: ajsTableColumnHeader['group6.col1'],
                    accessorFn: tyAccessorFn<Op[] | undefined>(['g'], row => {
                        return row.params<Op[]>('op')?.filter(v => !v.isWeek);
                    }),
                    cell: props => {
                        const op = props.getValue<Op[] | undefined>();
                        return Array.isArray(op)
                            ? <>{op.map((v, i) => box(v, i))}</>
                            : undefined;
                    },
                },
                {
                    id: 'group6.col2',
                    header: ajsTableColumnHeader['group6.col2'],
                    accessorFn: tyAccessorFn<Cl[] | undefined>(['g'], row => {
                        return row.params<Cl[]>('cl')?.filter(v => !v.isWeek);
                    }),
                    cell: props => {
                        const cl = props.getValue<Cl[] | undefined>();
                        return Array.isArray(cl)
                            ? <>{cl.map((v, i) => box(v, i))}</>
                            : undefined;
                    },
                }
            ]
        }),
        columnHelper.group({
            id: 'group7', //Jobnet definition information
            header: ajsTableColumnHeader['group7'],
            columns: [
                {
                    id: 'group7.col1',
                    header: ajsTableColumnHeader['group7.col1'],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], defaultAccessorFn('mp')),
                },
                {
                    id: 'group7.col2',
                    header: ajsTableColumnHeader['group7.col2'],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], defaultAccessorFn('rg')),
                },
                {
                    id: 'group7.col3',
                    header: ajsTableColumnHeader['group7.col3'],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], defaultAccessorFn('rh')),
                },
                {
                    id: 'group7.col4',
                    header: ajsTableColumnHeader['group7.col4'],
                    accessorFn: tyAccessorFn(['n', 'rn'], row => (row as N | Rn)?.priority),
                    cell: props => {
                        const priority = props.getValue<number | undefined>();
                        return priority
                            ? <Rating value={priority} size='small' sx={{ position: 'inherit' }} readOnly />
                            : undefined;
                    }
                },
                {
                    id: 'group7.col5',
                    header: ajsTableColumnHeader['group7.col5'],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], defaultAccessorFn('cd')),
                },
                {
                    id: 'group7.col6',
                    header: ajsTableColumnHeader['group7.col6'],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], defaultAccessorFn('ms')),
                },
                {
                    id: 'group7.col7',
                    header: ajsTableColumnHeader['group7.col7'],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], defaultAccessorFn('fd')),
                }
            ]
        }),
        columnHelper.group({
            id: 'group8', //Jobnet connector definition information
            header: ajsTableColumnHeader['group8'],
            columns: [
                {
                    id: 'group8.col1',
                    header: ajsTableColumnHeader['group8.col1'],
                    accessorFn: tyAccessorFn(['nc'], defaultAccessorFn('ncr')),
                }
            ]
        }),
        columnHelper.group({
            id: 'group9', //Start-condition definition information
            header: ajsTableColumnHeader['group9'],
            columns: [
                {
                    id: 'group9.col1',
                    header: ajsTableColumnHeader['group9.col1'],
                    accessorFn: tyAccessorFn(['rc'], defaultAccessorFn('cond')),
                }
            ]
        }),
        columnHelper.group({
            id: 'group10', //Schedule definition information
            header: ajsTableColumnHeader['group10'],
            columns: [
                {
                    id: 'group10.col1',
                    header: ajsTableColumnHeader['group10.col1'],
                    accessorFn: defaultAccessorFn('de'),
                },
                {
                    id: 'group10.col2',
                    header: ajsTableColumnHeader['group10.col2'],
                    accessorFn: defaultAccessorFn('ed'),
                },
                {
                    id: 'group10.col3',
                    header: ajsTableColumnHeader['group10.col3'],
                    accessorFn: defaultAccessorFn('jc'),
                },
                {
                    id: 'group10.col4',
                    header: ajsTableColumnHeader['group10.col4'],
                    accessorFn: defaultAccessorFn('ejn'),
                },
                {
                    id: 'group10.col5',
                    header: ajsTableColumnHeader['group10.col5'],
                    accessorFn: defaultAccessorFn('ln'),
                    cell: props => {
                        const ln = props.getValue<Ln[]>();
                        return Array.isArray(ln)
                            ? <>{ln.map((v, i) => box(v, i, (v) => (v as Ln).parentRule))}</>
                            : undefined;
                    },
                },
                columnHelper.group({
                    id: 'group10.group1',
                    header: ajsTableColumnHeader['group10.group1'],
                    columns: [
                        {
                            id: 'group10.group1.col1',
                            header: ajsTableColumnHeader['group10.group1.col1'],
                            accessorFn: defaultAccessorFn('sd'),
                            cell: props => {
                                const sd = props.getValue<Sd[]>();
                                return Array.isArray(sd)
                                    ? <>{sd.map((v, i) => box(v, i, (v) => paramDefinition['sd'][(v as Sd).type]))}</>
                                    : undefined;
                            }
                        },
                        {
                            id: 'group10.group1.col2',
                            header: ajsTableColumnHeader['group10.group1.col2'],
                            accessorFn: defaultAccessorFn('sd'),
                            cell: props => {
                                const sd = props.getValue<Sd[]>();
                                return Array.isArray(sd)
                                    ? <>{sd.map((v, i) => box(v, i, (v) => (v as Sd).yearMonth ?? '\u00A0'))}</>
                                    : undefined;
                            }
                        },
                        {
                            id: 'group10.group1.col3',
                            header: ajsTableColumnHeader['group10.group1.col3'],
                            accessorFn: defaultAccessorFn('sd'),
                            cell: props => {
                                const sd = props.getValue<Sd[]>();
                                return Array.isArray(sd)
                                    ? <>{sd.map((v, i) => box(v, i, (v) => (v as Sd).day ?? '\u00A0'))}</>
                                    : undefined;
                            }
                        }
                    ]
                }),
                {
                    id: 'group10.col6',
                    header: ajsTableColumnHeader['group10.col6'],
                    accessorFn: defaultAccessorFn('st'),
                    cell: props => {
                        const st = props.getValue<St[]>();
                        return Array.isArray(st)
                            ? <>{st.map((v, i) => box(v, i, (v) => (v as St).time ?? '\u00A0'))}</>
                            : undefined;
                    }
                },
                {
                    id: 'grsoup10.col7',
                    header: ajsTableColumnHeader['group10.col7'],
                    accessorFn: defaultAccessorFn('cy'),
                    cell: props => {
                        const cy = props.getValue<Cy[]>();
                        return Array.isArray(cy)
                            ? <>{cy.map((v, i) => box(v, i, (v) => (v as Cy).cycle ?? '\u00A0'))}</>
                            : undefined;
                    }
                },
                {
                    id: 'group10.col8',
                    header: ajsTableColumnHeader['group10.col8'],
                    accessorFn: defaultAccessorFn('sh'),
                    cell: props => {
                        const sh = props.getValue<Sh[]>();
                        return Array.isArray(sh)
                            ? <>{sh.map((v, i) => box(v, i, (v) => (v as Sh).substitute ?? '\u00A0'))}</>
                            : undefined;
                    }
                },
                // FIXME
                {
                    id: 'group10.col9',
                    header: ajsTableColumnHeader['group10.col9'],
                    accessorFn: defaultAccessorFn('shd'),
                    cell: props => {
                        const shd = props.getValue<Shd[]>(); ``
                        return Array.isArray(shd)
                            ? <>{shd.map((v, i) => box(v, i, (v) => (v as Shd).shiftDays ?? '\u00A0'))}</>
                            : undefined;
                    }
                },
                {
                    id: 'group10.col10',
                    header: ajsTableColumnHeader['group10.col10'],
                    accessorFn: defaultAccessorFn('cftd'),
                    cell: props => {
                        const cftd = props.getValue<Cftd[]>();
                        return Array.isArray(cftd)
                            ? <>{cftd.map((v, i) => box(v, i, (v) => (v as Cftd).scheduleByDaysFromStart ?? '\u00A0'))}</>
                            : undefined;
                    }
                },
                {
                    id: 'group10.col11',
                    header: ajsTableColumnHeader['group10.col11'],
                    accessorFn: defaultAccessorFn('cftd'),
                    cell: props => {
                        const cftd = props.getValue<Cftd[]>();
                        return Array.isArray(cftd)
                            ? <>{cftd.map((v, i) => box(v, i, (v) => (v as Cftd).maxShiftableDays ?? '\u00A0'))}</>
                            : undefined;
                    }
                },
                columnHelper.group({
                    id: 'group10.group2',
                    header: ajsTableColumnHeader['group10.group2'],
                    columns: [
                        {
                            id: 'group10.group2.col1',
                            header: ajsTableColumnHeader['group10.group2.col1'],
                            accessorFn: defaultAccessorFn('sy'),
                            cell: props => {
                                const sy = props.getValue<Sy[]>();
                                return Array.isArray(sy)
                                    ? <>{sy.map((v, i) => box(v, i, (v) => (v as Sy).time ?? '\u00A0'))}</>
                                    : undefined;
                            }
                        },
                        {
                            id: 'group10.group2.col2',
                            header: ajsTableColumnHeader['group10.group2.col2'],
                            accessorFn: defaultAccessorFn('ey'),
                            cell: props => {
                                const ey = props.getValue<Ey[]>();
                                return Array.isArray(ey)
                                    ? <>{ey.map((v, i) => box(v, i, (v) => (v as Ey).time ?? '\u00A0'))}</>
                                    : undefined;
                            }
                        }
                    ]
                }),
                columnHelper.group({
                    id: 'group10.group3',
                    header: ajsTableColumnHeader['group10.group3'],
                    columns: [
                        {
                            id: 'group10.group3.col1',
                            header: ajsTableColumnHeader['group10.group3.col1'],
                            accessorFn: defaultAccessorFn('wc'),
                            cell: props => {
                                const wc = props.getValue<Wc[]>();
                                return Array.isArray(wc)
                                    ? <>{wc.map((v, i) => box(v, i, (v) => (v as Wc).numberOfTimes ?? '\u00A0'))}</>
                                    : undefined;
                            }
                        },
                        {
                            id: 'group10.group3.col2',
                            header: ajsTableColumnHeader['group10.group3.col2'],
                            accessorFn: defaultAccessorFn('wt'),
                            cell: props => {
                                const wt = props.getValue<Wt[]>();
                                return Array.isArray(wt)
                                    ? <>{wt.map((v, i) => box(v, i, (v) => (v as Wt).time ?? '\u00A0'))}</>
                                    : undefined;
                            }
                        }
                    ]
                })
            ]
        }),
        columnHelper.group({
            id: 'group11', //Basic job definition information
            header: ajsTableColumnHeader['group11'],
            columns: [
                {
                    id: 'group11.col1',
                    header: ajsTableColumnHeader['group11.col1'],
                    accessorFn: defaultAccessorFn('te'),
                },
                {
                    id: 'group11.col2',
                    header: ajsTableColumnHeader['group11.col2'],
                    accessorFn: defaultAccessorFn('sc'),
                },
                {
                    id: 'group11.col3',
                    header: ajsTableColumnHeader['group11.col3'],
                    accessorFn: defaultAccessorFn('prm'),
                },
                {
                    id: 'group11.col4',
                    header: ajsTableColumnHeader['group11.col4'],
                    accessorFn: defaultAccessorFn('env'),
                },
                {
                    id: 'group11.col5',
                    header: ajsTableColumnHeader['group11.col5'],
                    accessorFn: defaultAccessorFn('ev'),
                },
                {
                    id: 'group11.col6',
                    header: ajsTableColumnHeader['group11.col6'],
                    accessorFn: defaultAccessorFn('wkp'),
                },
                {
                    id: 'group11.col7',
                    header: ajsTableColumnHeader['group11.col7'],
                    accessorFn: defaultAccessorFn('si'),
                },
                columnHelper.group({
                    id: 'group11.group1',
                    header: ajsTableColumnHeader['group11.group1'],
                    columns: [
                        {
                            id: 'group11.group1.col1',
                            header: ajsTableColumnHeader['group11.group1.col1'],
                            accessorFn: defaultAccessorFn('so'),
                        },
                        {
                            id: 'group11.group1.col2',
                            header: ajsTableColumnHeader['group11.group1.col2'],
                            accessorFn: defaultAccessorFn('soa'),
                        }
                    ]
                }),
                columnHelper.group({
                    id: 'group11.group2',
                    header: ajsTableColumnHeader['group11.group2'],
                    columns: [
                        {
                            id: 'group11.group2.col1',
                            header: ajsTableColumnHeader['group11.group2.col1'],
                            accessorFn: defaultAccessorFn('se'),
                        },
                        {
                            id: 'group11.group2.col2',
                            header: ajsTableColumnHeader['group11.group2.col2'],
                            accessorFn: defaultAccessorFn('sea'),
                        }
                    ]
                }),
                {
                    id: 'group11.col8',
                    header: ajsTableColumnHeader['group11.col8'],
                    accessorFn: defaultAccessorFn('qm'),
                },
                {
                    id: 'group11.col9',
                    header: ajsTableColumnHeader['group11.col9'],
                    accessorFn: defaultAccessorFn('qu'),
                },
                {
                    id: 'group11.col10',
                    header: ajsTableColumnHeader['group11.col10'],
                    accessorFn: defaultAccessorFn('req'),
                },
                {
                    id: 'group11.col11',
                    header: ajsTableColumnHeader['group11.col11'],
                    accessorFn: row => {
                        return ['j', 'rj', 'pj', 'qj'].some(v => v === row.ty.value())
                            ? (row as J | Rj | Pj | Rp | Qj).priority
                            : undefined;
                    },
                    cell: props => {
                        const priority = props.getValue<number | undefined>();
                        return priority
                            ? <Rating value={priority} size='small' sx={{ position: 'inherit' }} readOnly />
                            : undefined;
                    }
                },
                columnHelper.group({
                    id: 'group11.group3',
                    header: ajsTableColumnHeader['group11.group3'],
                    columns: [
                        {
                            id: 'group11.group3.col1',
                            header: ajsTableColumnHeader['group11.group3.col1'],
                            accessorFn: defaultAccessorFn('jd'),
                        },
                        {
                            id: 'group11.group3.col2',
                            header: ajsTableColumnHeader['group11.group3.col2'],
                            accessorFn: defaultAccessorFn('wth'),
                        },
                        {
                            id: 'group11.group3.col3',
                            header: ajsTableColumnHeader['group11.group3.col3'],
                            accessorFn: defaultAccessorFn('tho'),
                        },
                        {
                            id: 'group11.group3.col4',
                            header: ajsTableColumnHeader['group11.group3.col4'],
                            accessorFn: defaultAccessorFn('jdf'),
                        }
                    ]
                }),
                {
                    id: 'group11.col12',
                    header: ajsTableColumnHeader['group11.col12'],
                    accessorFn: defaultAccessorFn('abr'),
                },
                columnHelper.group({
                    id: 'group11.group4',
                    header: ajsTableColumnHeader['group11.group4'],
                    columns: [
                        {
                            id: 'group11.group4.col1',
                            header: ajsTableColumnHeader['group11.group4.col1'],
                            accessorFn: defaultAccessorFn('rjs'),
                        },
                        {
                            id: 'group11.group4.col2',
                            header: ajsTableColumnHeader['group11.group4.col2'],
                            accessorFn: defaultAccessorFn('rje'),
                        }
                    ]
                }),
                {
                    id: 'group11.col13',
                    header: ajsTableColumnHeader['group11.col13'],
                    accessorFn: defaultAccessorFn('rec'),
                },
                {
                    id: 'group11.col14',
                    header: ajsTableColumnHeader['group11.col14'],
                    accessorFn: defaultAccessorFn('rei'),
                },
                {
                    id: 'group11.col15',
                    header: ajsTableColumnHeader['group11.col15'],
                    accessorFn: defaultAccessorFn('un'),
                }
            ]
        }),
        columnHelper.group({
            id: 'group12', //Judgment job definition information
            header: ajsTableColumnHeader['group12'],
            columns: [
                {
                    id: 'group12.col1',
                    header: ajsTableColumnHeader['group12.col1'],
                    accessorFn: defaultAccessorFn('ej'),
                },
                columnHelper.group({
                    id: 'group12.group1',
                    header: ajsTableColumnHeader['group12.group1'],
                    columns: [
                        {
                            id: 'group12.group1.col1',
                            header: ajsTableColumnHeader['group12.group1.col1'],
                            accessorFn: defaultAccessorFn('ejc'),
                        },
                        {
                            id: 'group12.group1.col2',
                            header: ajsTableColumnHeader['group12.group1.col2'],
                            accessorFn: defaultAccessorFn('ejl'),
                        },
                        {
                            id: 'group12.group1.col3',
                            header: ajsTableColumnHeader['group12.group1.col3'],
                            accessorFn: defaultAccessorFn('ejs'),
                        },
                        {
                            id: 'group12.group1.col4',
                            header: ajsTableColumnHeader['group12.group1.col4'],
                            accessorFn: defaultAccessorFn('ejm'),
                        },
                        {
                            id: 'group12.group1.col5',
                            header: ajsTableColumnHeader['group12.group1.col5'],
                            accessorFn: defaultAccessorFn('ejh'),
                        },
                        {
                            id: 'group12.group1.col6',
                            header: ajsTableColumnHeader['group12.group1.col6'],
                            accessorFn: defaultAccessorFn('ejg'),
                        },
                        {
                            id: 'group12.group1.col7',
                            header: ajsTableColumnHeader['group12.group1.col7'],
                            accessorFn: defaultAccessorFn('eju'),
                        },
                        {
                            id: 'group12.group1.col8',
                            header: ajsTableColumnHeader['group12.group1.col8'],
                            accessorFn: defaultAccessorFn('ejt'),
                        },
                        {
                            id: 'group12.group1.col9',
                            header: ajsTableColumnHeader['group12.group1.col9'],
                            accessorFn: defaultAccessorFn('eji'),
                        }
                    ]
                }),
                {
                    id: 'group12.col2',
                    header: ajsTableColumnHeader['group12.col2'],
                    accessorFn: defaultAccessorFn('ejv'),
                },
                {
                    id: 'group12.col3',
                    header: ajsTableColumnHeader['group12.col3'],
                    accessorFn: defaultAccessorFn('ejf'),
                }
            ]
        }),
        columnHelper.group({
            id: 'group13', //Event job definition information
            header: ajsTableColumnHeader['group13'],
            columns: [
                {
                    id: 'group13.col1',
                    header: ajsTableColumnHeader['group13.col1'],
                    accessorFn: defaultAccessorFn('tmitv'),
                },
                {
                    id: 'group13.col2',
                    header: ajsTableColumnHeader['group13.col2'],
                    accessorFn: defaultAccessorFn('etn'),
                },
                {
                    id: 'group13.col3',
                    header: ajsTableColumnHeader['group13.col3'],
                    accessorFn: defaultAccessorFn('flwf'),
                },
                columnHelper.group({
                    id: 'group13.group1',
                    header: ajsTableColumnHeader['group13.group1'],
                    columns: [
                        {
                            id: 'group13.group1.col1',
                            header: ajsTableColumnHeader['group13.group1.col1'],
                            accessorFn: defaultAccessorFn('flwc'),
                        },
                        {
                            id: 'group13.group1.col2',
                            header: ajsTableColumnHeader['group13.group1.col2'],
                            accessorFn: defaultAccessorFn('flco'),
                        }
                    ]
                }),
                {
                    id: 'group13.col4',
                    header: ajsTableColumnHeader['group13.col4'],
                    accessorFn: defaultAccessorFn('flwi'),
                },
                {
                    id: 'group13.col5',
                    header: ajsTableColumnHeader['group13.col5'],
                    accessorFn: defaultAccessorFn('evwid'),
                },
                {
                    id: 'group13.col6',
                    header: ajsTableColumnHeader['group13.col6'],
                    accessorFn: defaultAccessorFn('evhst'),
                },
                {
                    id: 'group13.col7',
                    header: ajsTableColumnHeader['group13.col7'],
                    accessorFn: defaultAccessorFn('evwms'),
                },
                {
                    id: 'group13.col8',
                    header: ajsTableColumnHeader['group13.col8'],
                    accessorFn: defaultAccessorFn('ets'),
                }
            ]
        }),
        columnHelper.group({
            id: 'group14', //Action job definition information
            header: ajsTableColumnHeader['group14'],
            columns: [
                {
                    id: 'group14.col1',
                    header: ajsTableColumnHeader['group14.col1'],
                    accessorFn: defaultAccessorFn('evsid'),
                },
                {
                    id: 'group14.col2',
                    header: ajsTableColumnHeader['group14.col2'],
                    accessorFn: defaultAccessorFn('evhst'),
                },
                {
                    id: 'group14.col3',
                    header: ajsTableColumnHeader['group14.col3'],
                    accessorFn: defaultAccessorFn('evsms'),
                },
                {
                    id: 'group14.col4',
                    header: ajsTableColumnHeader['group14.col4'],
                    accessorFn: defaultAccessorFn('evssv'),
                },
                {
                    id: 'group14.col5',
                    header: ajsTableColumnHeader['group14.col5'],
                    accessorFn: defaultAccessorFn('evsrt'),
                },
                {
                    id: 'group14.col6',
                    header: ajsTableColumnHeader['group14.col6'],
                    accessorFn: defaultAccessorFn('evspl'),
                },
                {
                    id: 'group14.col7',
                    header: ajsTableColumnHeader['group14.col7'],
                    accessorFn: defaultAccessorFn('evsrc'),
                },
                {
                    id: 'group14.col8',
                    header: ajsTableColumnHeader['group14.col8'],
                    accessorFn: defaultAccessorFn('pfm'),
                }
            ]
        }),
        columnHelper.group({
            id: 'group15', //Job common attribute information
            header: ajsTableColumnHeader['group15'],
            columns: [
                {
                    id: 'group15.col1',
                    header: ajsTableColumnHeader['group15.col1'],
                    accessorFn: defaultAccessorFn('eu'),
                },
                {
                    id: 'group15.col2',
                    header: ajsTableColumnHeader['group15.col2'],
                    accessorFn: defaultAccessorFn('etm'),
                },
                {
                    id: 'group15.col3',
                    header: ajsTableColumnHeader['group15.col3'],
                    accessorFn: defaultAccessorFn('fd'),
                },
                {
                    id: 'group15.col4',
                    header: ajsTableColumnHeader['group15.col4'],
                    accessorFn: defaultAccessorFn('jty'),
                },
                columnHelper.group({
                    id: 'group15.group1',
                    header: ajsTableColumnHeader['group15.group1'],
                    columns: [
                        {
                            id: 'group15.group1.col1',
                            header: ajsTableColumnHeader['group15.group1.col1'],
                            accessorFn: defaultAccessorFn('ts1'),
                        },
                        {
                            id: 'group15.group1.col2',
                            header: ajsTableColumnHeader['group15.group1.col2'],
                            accessorFn: defaultAccessorFn('td1'),
                        },
                        {
                            id: 'group15.group1.col3',
                            header: ajsTableColumnHeader['group15.group1.col3'],
                            accessorFn: defaultAccessorFn('top1'),
                        }
                    ]
                }),
                columnHelper.group({
                    id: 'group15.group2',
                    header: ajsTableColumnHeader['group15.group2'],
                    columns: [
                        {
                            id: 'group15.group2.col1',
                            header: ajsTableColumnHeader['group15.group2.col1'],
                            accessorFn: defaultAccessorFn('ts2'),
                        },
                        {
                            id: 'group15.group2.col2',
                            header: ajsTableColumnHeader['group15.group2.col2'],
                            accessorFn: defaultAccessorFn('td2'),
                        },
                        {
                            id: 'group15.group2.col3',
                            header: ajsTableColumnHeader['group15.group2.col3'],
                            accessorFn: defaultAccessorFn('top2'),
                        }
                    ]
                }),
                columnHelper.group({
                    id: 'group15.group3',
                    header: ajsTableColumnHeader['group15.group3'],
                    columns: [
                        {
                            id: 'group15.group3.col1',
                            header: ajsTableColumnHeader['group15.group3.col1'],
                            accessorFn: defaultAccessorFn('ts3'),
                        },
                        {
                            id: 'group15.group3.col2',
                            header: ajsTableColumnHeader['group15.group3.col2'],
                            accessorFn: defaultAccessorFn('td3'),
                        },
                        {
                            id: 'group15.group3.col3',
                            header: ajsTableColumnHeader['group15.group3.col3'],
                            accessorFn: defaultAccessorFn('top3'),
                        }
                    ]
                }),
                columnHelper.group({
                    id: 'group15.group4',
                    header: ajsTableColumnHeader['group15.group4'],
                    columns: [
                        {
                            id: 'group15.group4.col1',
                            header: ajsTableColumnHeader['group15.group4.col1'],
                            accessorFn: defaultAccessorFn('ts4'),
                        },
                        {
                            id: 'group15.group4.col2',
                            header: ajsTableColumnHeader['group15.group4.col2'],
                            accessorFn: defaultAccessorFn('td4'),
                        },
                        {
                            id: 'group15.group4.col3',
                            header: ajsTableColumnHeader['group15.group4.col3'],
                            accessorFn: defaultAccessorFn('top4'),
                        }
                    ]
                })
            ]
        }),
        columnHelper.group({
            id: 'group16', //Waiting condition definition information
            header: ajsTableColumnHeader['group16'],
            columns: [
                {
                    id: 'group16.col1',
                    header: ajsTableColumnHeader['group16.col1'],
                    accessorFn: defaultAccessorFn('eun'),
                },
                {
                    id: 'group16.col2',
                    header: ajsTableColumnHeader['group16.col2'],
                    accessorFn: defaultAccessorFn('mm'),
                },
                {
                    id: 'group16.col3',
                    header: ajsTableColumnHeader['group16.col3'],
                    accessorFn: defaultAccessorFn('nmg'),
                },
                {
                    id: 'group16.col4',
                    header: ajsTableColumnHeader['group16.col4'],
                    accessorFn: defaultAccessorFn('uem'),
                },
                {
                    id: 'group16.col5',
                    header: ajsTableColumnHeader['group16.col5'],
                    accessorFn: defaultAccessorFn('ega'),
                }
            ]
        }),
        columnHelper.group({
            id: 'group17', //Tool unit definition information
            header: ajsTableColumnHeader['group17'],
            columns: [
                columnHelper.group({
                    id: 'group17.group1',
                    header: ajsTableColumnHeader['group17.group1'],
                    columns: [
                        {
                            id: 'group17.group1.col1',
                            header: ajsTableColumnHeader['group17.group1.col1'],
                            accessorFn: row => ['cpj', 'rcpj'].includes(row.ty.value()) ? row.params<Prm>('prm') : undefined,
                        },
                        {
                            id: 'group17.group1.col2',
                            header: ajsTableColumnHeader['group17.group1.col2'],
                            accessorFn: row => ['cpj', 'rcpj'].includes(row.ty.value()) ? row.params('env') : undefined,
                        }
                    ]
                })
            ]
        }),
        columnHelper.group({
            id: 'group18', //Flexible job definition information
            header: ajsTableColumnHeader['group18'],
            columns: [
                {
                    id: 'group18.col1',
                    header: ajsTableColumnHeader['group18.col1'],
                    accessorFn: defaultAccessorFn('da'),
                },
                {
                    id: 'group18.col2',
                    header: ajsTableColumnHeader['group18.col2'],
                    accessorFn: defaultAccessorFn('fxg'),
                },
                {
                    id: 'group18.col3',
                    header: ajsTableColumnHeader['group18.col3'],
                    accessorFn: row => ['fxj', 'rfxj'].includes(row.ty.value()) ? row.params<Ex>('ex') : undefined,
                }
            ]
        }),
        columnHelper.group({
            id: 'group19', //Http connection job definition information
            header: ajsTableColumnHeader['group19'],
            columns: [
                {
                    id: 'group19.col1',
                    header: ajsTableColumnHeader['group19.col1'],
                    accessorFn: defaultAccessorFn('htcfl'),
                },
                {
                    id: 'group19.col2',
                    header: ajsTableColumnHeader['group19.col2'],
                    accessorFn: defaultAccessorFn('htknd'),
                },
                {
                    id: 'group19.col3',
                    header: ajsTableColumnHeader['group19.col3'],
                    accessorFn: defaultAccessorFn('htexm'),
                },
                {
                    id: 'group19.col4',
                    header: ajsTableColumnHeader['group19.col4'],
                    accessorFn: defaultAccessorFn('htrqf'),
                },
                {
                    id: 'group19.col5',
                    header: ajsTableColumnHeader['group19.col5'],
                    accessorFn: defaultAccessorFn('htrqu'),
                },
                {
                    id: 'group19.col6',
                    header: ajsTableColumnHeader['group19.col6'],
                    accessorFn: defaultAccessorFn('htrqm'),
                },
                {
                    id: 'group19.col7',
                    header: ajsTableColumnHeader['group19.col7'],
                    accessorFn: defaultAccessorFn('htstf'),
                },
                {
                    id: 'group19.col8',
                    header: ajsTableColumnHeader['group19.col8'],
                    accessorFn: defaultAccessorFn('htspt'),
                },
                {
                    id: 'group19.col9',
                    header: ajsTableColumnHeader['group19.col9'],
                    accessorFn: defaultAccessorFn('htrhf'),
                },
                {
                    id: 'group19.col10',
                    header: ajsTableColumnHeader['group19.col10'],
                    accessorFn: defaultAccessorFn('htrbf'),
                },
                {
                    id: 'group19.col11',
                    header: ajsTableColumnHeader['group19.col11'],
                    accessorFn: defaultAccessorFn('htcdm'),
                }
            ]
        }),
        columnHelper.group({
            id: 'group20', //Other definition information
            header: ajsTableColumnHeader['group20'],
            columns: [
                {
                    id: 'group20.col1',
                    header: ajsTableColumnHeader['group20.col1'],
                }
            ]
        }),
        // columnHelper.group({
        //     id: 'group21', //Custom job definition information
        //     header: ajsTableColumnHeader['group21'],
        //     columns: [
        //         {
        //             id: 'group21.col1',
        //             header: ajsTableColumnHeader['group21.col1'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col2',
        //             header: ajsTableColumnHeader['group21.col2'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col3',
        //             header: ajsTableColumnHeader['group21.col3'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col4',
        //             header: ajsTableColumnHeader['group21.col4'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col5',
        //             header: ajsTableColumnHeader['group21.col5'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col6',
        //             header: ajsTableColumnHeader['group21.col6'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col7',
        //             header: ajsTableColumnHeader['group21.col7'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col8',
        //             header: ajsTableColumnHeader['group21.col8'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col9',
        //             header: ajsTableColumnHeader['group21.col9'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col10',
        //             header: ajsTableColumnHeader['group21.col10'],
        //             accessorKey: undefined,
        //         },
        //         columnHelper.group({
        //             id: 'group21.group1',
        //             header: ajsTableColumnHeader['group21.group1'],
        //             columns: [
        //                 {
        //                     id: 'group21.group1.col1',
        //                     header: ajsTableColumnHeader['group21.group1.col1'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col2',
        //                     header: ajsTableColumnHeader['group21.group1.col2'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col3',
        //                     header: ajsTableColumnHeader['group21.group1.col3'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col4',
        //                     header: ajsTableColumnHeader['group21.group1.col4'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col5',
        //                     header: ajsTableColumnHeader['group21.group1.col5'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col6',
        //                     header: ajsTableColumnHeader['group21.group1.col6'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col7',
        //                     header: ajsTableColumnHeader['group21.group1.col7'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col8',
        //                     header: ajsTableColumnHeader['group21.group1.col8'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col9',
        //                     header: ajsTableColumnHeader['group21.group1.col9'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col10',
        //                     header: ajsTableColumnHeader['group21.group1.col10'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col11',
        //                     header: ajsTableColumnHeader['group21.group1.col11'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col12',
        //                     header: ajsTableColumnHeader['group21.group1.col12'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col13',
        //                     header: ajsTableColumnHeader['group21.group1.col13'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col14',
        //                     header: ajsTableColumnHeader['group21.group1.col14'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col15',
        //                     header: ajsTableColumnHeader['group21.group1.col15'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col16',
        //                     header: ajsTableColumnHeader['group21.group1.col16'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col17',
        //                     header: ajsTableColumnHeader['group21.group1.col17'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col18',
        //                     header: ajsTableColumnHeader['group21.group1.col18'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col19',
        //                     header: ajsTableColumnHeader['group21.group1.col19'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group1.col20',
        //                     header: ajsTableColumnHeader['group21.group1.col20'],
        //                     accessorKey: undefined,
        //                 }
        //             ]
        //         }),
        //         {
        //             id: 'group21.col11',
        //             header: ajsTableColumnHeader['group21.col11'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col12',
        //             header: ajsTableColumnHeader['group21.col12'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col13',
        //             header: ajsTableColumnHeader['group21.col13'],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: 'group21.col14',
        //             header: ajsTableColumnHeader['group21.col14'],
        //             accessorKey: undefined,
        //         },
        //         columnHelper.group({
        //             id: 'group21.group2',
        //             header: ajsTableColumnHeader['group21.group2'],
        //             columns: [
        //                 {
        //                     id: 'group21.group2.col1',
        //                     header: ajsTableColumnHeader['group21.group2.col1'],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: 'group21.group2.col2',
        //                     header: ajsTableColumnHeader['group21.group2.col2'],
        //                     accessorKey: undefined,
        //                 }
        //             ]
        //         }),
        //         {
        //             id: 'group21.col15',
        //             header: ajsTableColumnHeader['group21.col15'],
        //             accessorKey: undefined,
        //         }
        //     ]
        // })
    ]
};