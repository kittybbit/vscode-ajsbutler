// import * as vscode from 'vscode';
import React from "react"
import { G, J, N, Pj, Qj, Rj, Rn, Rp, UnitEntity } from "../../../domain/models/UnitEntities"
import { Abr, Ar, Cd, Cftd, Cl, Cond, Cty, Cy, Da, De, Ed, Ega, Ej, Ejc, Ejf, Ejg, Ejh, Eji, Ejl, Ejm, Ejn, Ejs, Ejt, Eju, Ejv, Env, Etm, Etn, Ets, Eu, Eun, Ev, Evhst, Evsid, Evsms, Evspl, Evsrc, Evsrt, Evssv, Evwid, Evwms, Ex, Ey, Fd, Flco, Flwc, Flwf, Flwi, Fxg, Gty, Ha, Htcdm, Htcfl, Htexm, Htknd, Htrbf, Htrhf, Htrqf, Htrqm, Htrqu, Htspt, Htstf, Jc, Jd, Jdf, Jty, Ln, Md, Mh, Mm, Mp, Ms, Mu, Ncex, Nchn, Ncl, Ncn, Ncr, Ncs, Ncsv, Nmg, Op, Pfm, Prm, Qm, Qu, Rec, Rei, Req, Rg, Rh, Rje, Rjs, Sc, Sd, Sdd, Se, Sea, Sh, Shd, Si, So, Soa, St, Stt, Sy, Td1, Td2, Td3, Td4, Te, Tho, Tmitv, Top1, Top2, Top3, Top4, Ts1, Ts2, Ts3, Ts4, Uem, Un, Wc, Wkp, Wt, Wth } from "../../../domain/models/ParameterEntities";
import { createColumnHelper } from "@tanstack/table-core";
import CheckIcon from '@mui/icons-material/Check';
import { ajsTableColumnHeaderLang, tyDefinitionLang, paramDefinitionLang } from '../../../domain/services/i18n/nls';
import { Chip, Rating } from "@mui/material";
import { TyType } from "../../../domain/values/AjsType";

export const tableDefaultColumnDef = {
    enableHiding: true,
    enableSorting: true,
};

/** When ty matches, invoke accessorFn. */
const tyAccessorFn = (targetTy: TyType[], accessorFn: (row: UnitEntity, index: number) => unknown) => (row: UnitEntity, index: number): unknown => {
    return targetTy.includes(row.ty.value())
        ? accessorFn(row, index)
        : undefined;
};

export const tableColumnDef = (language: string | undefined = 'en') => {

    // column titles
    const ajsTableColumnHeader = ajsTableColumnHeaderLang(language);
    // tyDefinition
    const tyDefinition = tyDefinitionLang(language);
    // paramter
    const paramDefinition = paramDefinitionLang(language);

    const columnHelper = createColumnHelper<UnitEntity>();

    return [
        columnHelper.display({
            id: "#",
            header: "#",
            cell: props => <span tabIndex={0}>{props.row.index + 1}</span>,
            enableHiding: false,
            enableSorting: false,
            enableGlobalFilter: false,
        }),
        columnHelper.group(
            {
                id: "group1", //Unit definition information
                header: ajsTableColumnHeader["group1"],
                columns: [
                    {
                        id: "group1.col1",
                        header: ajsTableColumnHeader["group1.col1"],
                        accessorKey: "name",
                    },
                    {
                        id: "group1.col2",
                        header: ajsTableColumnHeader["group1.col2"],
                        accessorFn: row => row.parent ? row.parent.absolutePath() : '/',
                    },
                    {
                        id: "group1.col3",
                        header: ajsTableColumnHeader["group1.col3"],
                        accessorFn: row => {
                            if (row.ty.value() === "g") {
                                const gty = row.params<Gty>("gty")?.value();
                                return gty === "p" ? tyDefinition["g"]["gty"]["p"] : tyDefinition["g"]["gty"]["n"];
                            }
                            return tyDefinition[row.ty.value()].name
                        },
                    },
                    {
                        id: "group1.col4",
                        header: ajsTableColumnHeader["group1.col4"],
                        accessorFn: row => row.params<Cty>('cty')?.value(),
                    },
                    {
                        id: "group1.col5",
                        header: ajsTableColumnHeader["group1.col5"],
                        accessorFn: row => row.parent?.el?.find(v => v.name === row.name)?.hv,
                    },
                    {
                        id: "group1.col6",
                        header: ajsTableColumnHeader["group1.col6"],
                        accessorFn: row => row.sz?.value(),
                    }
                ]
            }),
        columnHelper.group({
            id: "group2", //Unit common definition information
            header: ajsTableColumnHeader["group2"],
            columns: [
                {
                    id: "group2.col1",
                    header: ajsTableColumnHeader["group2.col1"],
                    accessorFn: row => row.cm?.value(),
                },
                {
                    id: "group2.col2",
                    header: ajsTableColumnHeader["group2.col2"],
                    accessorFn: row => row.previous(),
                    cell: props => <>{props.getValue<Ar[]>().map((v: Ar, i: number) => <div key={i} data-raw={v.rawValue}>{v.f}</div>)}</>,
                },
                {
                    id: "group2.col3",
                    header: ajsTableColumnHeader["group2.col3"],
                    accessorFn: row => row.previous(),
                    cell: props => <>{props.getValue<Ar[]>().map((v: Ar, i: number) => <div key={i} data-raw={v.rawValue}>{v.relationType}</div>)}</>,
                },
                {
                    id: "group2.col4",
                    header: ajsTableColumnHeader["group2.col4"],
                    accessorFn: row => row.params<Ex>("ex")?.value(),
                },
                {
                    id: "group2.col5",
                    header: ajsTableColumnHeader["group2.col5"],
                    accessorFn: row => row.params<Ncl>("ncl")?.value(),
                },
                {
                    id: "group2.col6",
                    header: ajsTableColumnHeader["group2.col6"],
                    accessorFn: row => row.params<Ncn>("ncn")?.value(),
                },
                {
                    id: "group2.col7",
                    header: ajsTableColumnHeader["group2.col7"],
                    accessorFn: row => row.params<Ncs>("ncs")?.value(),
                },
                {
                    id: "group2.col8",
                    header: ajsTableColumnHeader["group2.col8"],
                    accessorFn: row => row.params<Ncex>("ncex")?.value(),
                },
                {
                    id: "group2.col9",
                    header: ajsTableColumnHeader["group2.col9"],
                    accessorFn: row => row.params<Nchn>("nchn")?.value(),
                },
                {
                    id: "group2.col10",
                    header: ajsTableColumnHeader["group2.col10"],
                    accessorFn: row => row.params<Ncsv>("ncsv")?.value(),
                }
            ]
        }),
        columnHelper.group({
            id: "group3", //Unit common attributes information
            header: ajsTableColumnHeader["group3"],
            columns: [
                {
                    id: "group3.col1",
                    header: ajsTableColumnHeader["group3.col1"],
                    accessorFn: row => row.params<Ha>("ha")?.value(),
                },
                {
                    id: "group3.col2",
                    header: ajsTableColumnHeader["group3.col2"],
                    accessorFn: row => row.isRecovery(),
                    cell: param => {
                        const isRecovery = param.getValue<boolean | undefined>();
                        if (isRecovery === undefined) {
                            return undefined;
                        }
                        return isRecovery ? <Chip color="secondary" label="Recovery" />
                            : <Chip color="primary" label="Normal" />
                    }
                },
                {
                    id: "group3.col3",
                    header: ajsTableColumnHeader["group3.col3"],
                    accessorKey: "jp1Username",
                },
                {
                    id: "group3.col4",
                    header: ajsTableColumnHeader["group3.col4"],
                    accessorKey: "jp1ResourceGroup",
                }
            ]
        }),
        columnHelper.group({
            id: "group4", //Manager unit definition information
            header: ajsTableColumnHeader["group4"],
            columns: [
                {
                    id: "group4.col1",
                    header: ajsTableColumnHeader["group4.col1"],
                    accessorFn: tyAccessorFn(['mg', 'mn'], row => row.params<Mh>("mh")?.value()),
                },
                {
                    id: "group4.col2",
                    header: ajsTableColumnHeader["group4.col2"],
                    accessorFn: tyAccessorFn(['mg', 'mn'], row => row.params<Mu>("mu")?.value()),
                }
            ]
        }),
        columnHelper.group({
            id: "group5", //Job group definition information
            header: ajsTableColumnHeader["group5"],
            columns: [
                {
                    id: "group5.col1",
                    header: ajsTableColumnHeader["group5.col1"],
                    accessorFn: tyAccessorFn(['g'], row => row.params<Sdd>("sdd")?.value()),
                },
                {
                    id: "group5.col2",
                    header: ajsTableColumnHeader["group5.col2"],
                    accessorFn: tyAccessorFn(['g'], row => row.params<Md>("md")?.value()),
                },
                {
                    id: "group5.col3",
                    header: ajsTableColumnHeader["group5.col3"],
                    accessorFn: tyAccessorFn(['g'], row => row.params<Stt>("stt")?.value()),
                },
                {
                    id: "group5.col4",
                    header: ajsTableColumnHeader["group5.col4"],
                    accessorFn: tyAccessorFn(['g'], row => row.params<Gty>("gty")?.value()),
                    cell: param => param.getValue<string | undefined>()
                        ? param.getValue<string>() === "n"
                            ? <Chip color="primary" label="Normal" />
                            : <Chip color="secondary" label="Planning" />
                        : undefined
                }
            ]
        }),
        columnHelper.group({
            id: "group6", //Calendar definition information
            header: ajsTableColumnHeader["group6"],
            columns: [
                columnHelper.group({
                    id: "group6.group1",
                    header: ajsTableColumnHeader["group6.group1"],
                    columns: [
                        {
                            id: "group6.group1.col1",
                            header: ajsTableColumnHeader["group6.group1.col1"],
                            accessorFn: tyAccessorFn(['g'], row => {
                                const ty = row.ty.value();
                                if (ty !== 'g') {
                                    return false;
                                }
                                const g = row as G;
                                return g.su;
                            }),
                            cell: props => props.getValue<boolean>()
                                ? <CheckIcon fontSize="small" color="primary" />
                                : undefined,
                        },
                        {
                            id: "group6.group1.col2",
                            header: ajsTableColumnHeader["group6.group1.col2"],
                            accessorFn: tyAccessorFn(['g'], row => {
                                const ty = row.ty.value();
                                if (ty !== 'g') {
                                    return false;
                                }
                                const g = row as G;
                                return g.mo;
                            }),
                            cell: props => props.getValue<boolean>()
                                ? <CheckIcon fontSize="small" color="primary" />
                                : undefined,
                        },
                        {
                            id: "group6.group1.col3",
                            header: ajsTableColumnHeader["group6.group1.col3"],
                            accessorFn: row => {
                                const ty = row.ty.value();
                                if (ty !== 'g') {
                                    return false;
                                }
                                const g = row as G;
                                return g.tu;
                            },
                            cell: props => props.getValue<boolean>()
                                ? <CheckIcon fontSize="small" color="primary" />
                                : undefined,
                        },
                        {
                            id: "group6.group1.col4",
                            header: ajsTableColumnHeader["group6.group1.col4"],
                            accessorFn: row => {
                                const ty = row.ty.value();
                                if (ty !== 'g') {
                                    return false;
                                }
                                const g = row as G;
                                return g.we;
                            },
                            cell: props => props.getValue<boolean>()
                                ? <CheckIcon fontSize="small" color="primary" />
                                : undefined,
                        },
                        {
                            id: "group6.group1.col5",
                            header: ajsTableColumnHeader["group6.group1.col5"],
                            accessorFn: row => {
                                const ty = row.ty.value();
                                if (ty !== 'g') {
                                    return false;
                                }
                                const g = row as G;
                                return g.th;
                            },
                            cell: props => props.getValue<boolean>()
                                ? <CheckIcon fontSize="small" color="primary" />
                                : undefined,
                        },
                        {
                            id: "group6.group1.col6",
                            header: ajsTableColumnHeader["group6.group1.col6"],
                            accessorFn: tyAccessorFn(['g'], row => {
                                const ty = row.ty.value();
                                if (ty !== 'g') {
                                    return false;
                                }
                                const g = row as G;
                                return g.fr;
                            }),
                            cell: props => props.getValue<boolean>()
                                ? <CheckIcon fontSize="small" color="primary" />
                                : undefined,
                        },
                        {
                            id: "group6.group1.col7",
                            header: ajsTableColumnHeader["group6.group1.col7"],
                            accessorFn: tyAccessorFn(['g'], row => {
                                const ty = row.ty.value();
                                if (ty !== 'g') {
                                    return false;
                                }
                                const g = row as G;
                                return g.sa;
                            }),
                            cell: props => props.getValue<boolean>()
                                ? <CheckIcon fontSize="small" color="primary" />
                                : undefined,
                        }
                    ]
                }),
                {
                    id: "group6.col1",
                    header: ajsTableColumnHeader["group6.col1"],
                    accessorFn: tyAccessorFn(['g'], row => row.params("op")),
                    cell: props => {
                        const op = props.getValue<Op[]>();
                        return Array.isArray(op)
                            ? <>{op.filter(v => !v.isWeek).map((v, i) => <div key={i} data-raw={v.rawValue}>{v.value()}</div>)}</>
                            : undefined;
                    },
                },
                {
                    id: "group6.col2",
                    header: ajsTableColumnHeader["group6.col2"],
                    accessorFn: tyAccessorFn(['g'], row => row.params("cl")),
                    cell: props => {
                        const cl = props.getValue<Cl[]>();
                        return Array.isArray(cl)
                            ? <>{cl.filter(v => !v.isWeek).map((v, i) => <div key={i} data-raw={v.rawValue}>{v.value()}</div>)}</>
                            : undefined;
                    },
                }
            ]
        }),
        columnHelper.group({
            id: "group7", //Jobnet definition information
            header: ajsTableColumnHeader["group7"],
            columns: [
                {
                    id: "group7.col1",
                    header: ajsTableColumnHeader["group7.col1"],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], row => row.params<Mp>("mp")?.value()),
                },
                {
                    id: "group7.col2",
                    header: ajsTableColumnHeader["group7.col2"],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], row => row.params<Rg>("rg")?.value()),
                },
                {
                    id: "group7.col3",
                    header: ajsTableColumnHeader["group7.col3"],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], row => row.params<Rh>("rh")?.value()),
                },
                {
                    id: "group7.col4",
                    header: ajsTableColumnHeader["group7.col4"],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], row => {
                        return ['n', 'rn'].some(v => v === row.ty.value())
                            ? (row as N | Rn).priority
                            : undefined;
                    }),
                    cell: props => {
                        const priority = props.getValue<number | undefined>();
                        return priority
                            ? <Rating value={priority} size="small" sx={{ position: "inherit" }} readOnly />
                            : undefined;
                    }
                },
                {
                    id: "group7.col5",
                    header: ajsTableColumnHeader["group7.col5"],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], row => row.params<Cd>("cd")?.value()),
                },
                {
                    id: "group7.col6",
                    header: ajsTableColumnHeader["group7.col6"],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], row => row.params<Ms>("ms")?.value()),
                },
                {
                    id: "group7.col7",
                    header: ajsTableColumnHeader["group7.col7"],
                    accessorFn: tyAccessorFn(['n', 'rn', 'rm', 'rr'], row => row.params<Fd>("fd")?.value()),
                }
            ]
        }),
        columnHelper.group({
            id: "group8", //Jobnet connector definition information
            header: ajsTableColumnHeader["group8"],
            columns: [
                {
                    id: "group8.col1",
                    header: ajsTableColumnHeader["group8.col1"],
                    accessorFn: tyAccessorFn(['nc'], row => row.params<Ncr>("ncr")?.value()),
                }
            ]
        }),
        columnHelper.group({
            id: "group9", //Start-condition definition information
            header: ajsTableColumnHeader["group9"],
            columns: [
                {
                    id: "group9.col1",
                    header: ajsTableColumnHeader["group9.col1"],
                    accessorFn: tyAccessorFn(['rc'], row => row.params<Cond>("cond")?.value()),
                }
            ]
        }),
        columnHelper.group({
            id: "group10", //Schedule definition information
            header: ajsTableColumnHeader["group10"],
            columns: [
                {
                    id: "group10.col1",
                    header: ajsTableColumnHeader["group10.col1"],
                    accessorFn: row => row.params<De>("de")?.value(),
                },
                {
                    id: "group10.col2",
                    header: ajsTableColumnHeader["group10.col2"],
                    accessorFn: row => row.params<Ed>("ed")?.value(),
                },
                {
                    id: "group10.col3",
                    header: ajsTableColumnHeader["group10.col3"],
                    accessorFn: row => row.params<Jc>("jc")?.value(),
                },
                {
                    id: "group10.col4",
                    header: ajsTableColumnHeader["group10.col4"],
                    accessorFn: row => row.params<Ejn>("ejn")?.value(),
                },
                {
                    id: "group10.col5",
                    header: ajsTableColumnHeader["group10.col5"],
                    accessorFn: row => row.params('ln'),
                    cell: props => {
                        const ln = props.getValue<Ln[]>();
                        return Array.isArray(ln)
                            ? <>{ln.map((v, i) => <div key={i} data-raw={v.rawValue}>{v.parentRule}</div>)}</>
                            : undefined;
                    },
                },
                columnHelper.group({
                    id: "group10.group1",
                    header: ajsTableColumnHeader["group10.group1"],
                    columns: [
                        {
                            id: "group10.group1.col1",
                            header: ajsTableColumnHeader["group10.group1.col1"],
                            accessorFn: row => row.params("sd"),
                            cell: props => {
                                const sd = props.getValue<Sd[]>();
                                return Array.isArray(sd)
                                    ? <>{sd.map((v, i) => <div key={i} data-raw={v.rawValue}>{paramDefinition['sd'][v.type]}</div>)}</>
                                    : undefined;
                            }
                        },
                        {
                            id: "group10.group1.col2",
                            header: ajsTableColumnHeader["group10.group1.col2"],
                            accessorFn: row => row.params("sd"),
                            cell: props => {
                                const sd = props.getValue<Sd[]>();
                                return Array.isArray(sd)
                                    ? <>{sd.map((v, i) => <div key={i} data-raw={v.rawValue}>{v.yearMonth ?? '\u00A0'}</div>)}</>
                                    : undefined;
                            }
                        },
                        {
                            id: "group10.group1.col3",
                            header: ajsTableColumnHeader["group10.group1.col3"],
                            accessorFn: row => row.params("sd"),
                            cell: props => {
                                const sd = props.getValue<Sd[]>();
                                return Array.isArray(sd)
                                    ? <>{sd.map((v, i) => <div key={i} data-raw={v.rawValue}>{v.day ?? '\u00A0'}</div>)}</>
                                    : undefined;
                            }
                        }
                    ]
                }),
                {
                    id: "group10.col6",
                    header: ajsTableColumnHeader["group10.col6"],
                    accessorFn: row => row.params("st"),
                    cell: props => {
                        const st = props.getValue<St[]>();
                        return Array.isArray(st)
                            ? <>{st.map((v, i) => <div key={i} data-raw={v.rawValue ?? '\u00A0'}>{v.time ?? '\u00A0'}</div>)}</>
                            : undefined;
                    }
                },
                {
                    id: "grsoup10.col7",
                    header: ajsTableColumnHeader["group10.col7"],
                    accessorFn: row => row.params("cy"),
                    cell: props => {
                        const cy = props.getValue<Array<Cy | null>>();
                        return Array.isArray(cy)
                            ? <>{cy.map((v, i) => <div key={i} data-raw={(v && v.rawValue) ?? '\u00A0'}>{(v && v.cycle) ?? '\u00A0'}</div>)}</>
                            : undefined;
                    }
                },
                {
                    id: "group10.col8",
                    header: ajsTableColumnHeader["group10.col8"],
                    accessorFn: row => row.params("sh"),
                    cell: props => {
                        const sh = props.getValue<Array<Sh | null>>();
                        return Array.isArray(sh)
                            ? <>{sh.map((v, i) => <div key={i} data-raw={(v && v.rawValue) ?? '\u00A0'}>{(v && v.substitute) ?? '\u00A0'}</div>)}</>
                            : undefined;
                    }
                },
                // FIXME
                {
                    id: "group10.col9",
                    header: ajsTableColumnHeader["group10.col9"],
                    accessorFn: row => row.params("shd"),
                    cell: props => {
                        const shd = props.getValue<Array<Shd | null>>(); ``
                        return Array.isArray(shd)
                            ? <>{shd.map((v, i) => <div key={i} data-raw={(v && v.rawValue) ?? '\u00A0'}>{(v && v.shiftDays) ?? '\u00A0'}</div>)}</>
                            : undefined;
                    }
                },
                {
                    id: "group10.col10",
                    header: ajsTableColumnHeader["group10.col10"],
                    accessorFn: row => row.params("cftd"),
                    cell: props => {
                        const cftd = props.getValue<Array<Cftd | null>>();
                        return Array.isArray(cftd)
                            ? <>{cftd.map((v, i) => <div key={i} data-raw={(v && v.rawValue) ?? '\u00A0'}>{(v && v.scheduleByDaysFromStart) ?? '\u00A0'}</div>)}</>
                            : undefined;
                    }
                },
                {
                    id: "group10.col11",
                    header: ajsTableColumnHeader["group10.col11"],
                    accessorFn: row => row.params("cftd"),
                    cell: props => {
                        const cftd = props.getValue<Array<Cftd | null>>();
                        return Array.isArray(cftd)
                            ? <>{cftd.map((v, i) => <div key={i} data-raw={(v && v.rawValue) ?? '\u00A0'}>{(v && v.maxShiftableDays) ?? '\u00A0'}</div>)}</>
                            : undefined;
                    }
                },
                columnHelper.group({
                    id: "group10.group2",
                    header: ajsTableColumnHeader["group10.group2"],
                    columns: [
                        {
                            id: "group10.group2.col1",
                            header: ajsTableColumnHeader["group10.group2.col1"],
                            accessorFn: row => row.params("sy"),
                            cell: props => {
                                const sy = props.getValue<Array<Sy | null>>();
                                return Array.isArray(sy)
                                    ? <>{sy.map((v, i) => <div key={i} data-raw={(v && v.rawValue) ?? '\u00A0'}>{(v && v.time) ?? '\u00A0'}</div>)}</>
                                    : undefined;
                            }
                        },
                        {
                            id: "group10.group2.col2",
                            header: ajsTableColumnHeader["group10.group2.col2"],
                            accessorFn: row => row.params("ey"),
                            cell: props => {
                                const ey = props.getValue<Array<Ey | null>>();
                                return Array.isArray(ey)
                                    ? <>{ey.map((v, i) => <div key={i} data-raw={(v && v.rawValue) ?? '\u00A0'}>{(v && v.time) ?? '\u00A0'}</div>)}</>
                                    : undefined;
                            }
                        }
                    ]
                }),
                columnHelper.group({
                    id: "group10.group3",
                    header: ajsTableColumnHeader["group10.group3"],
                    columns: [
                        {
                            id: "group10.group3.col1",
                            header: ajsTableColumnHeader["group10.group3.col1"],
                            accessorFn: row => row.params("wc"),
                            cell: props => {
                                const wc = props.getValue<Array<Wc | null>>();
                                return Array.isArray(wc)
                                    ? <>{wc.map((v, i) => <div key={i} data-raw={(v && v.rawValue) ?? '\u00A0'}>{(v && v.numberOfTimes) ?? '\u00A0'}</div>)}</>
                                    : undefined;
                            }
                        },
                        {
                            id: "group10.group3.col2",
                            header: ajsTableColumnHeader["group10.group3.col2"],
                            accessorFn: row => row.params("wt"),
                            cell: props => {
                                const wt = props.getValue<Array<Wt | null>>();
                                return Array.isArray(wt)
                                    ? <>{wt.map((v, i) => <div key={i} data-raw={(v && v.rawValue) ?? '\u00A0'}>{(v && v.time) ?? '\u00A0'}</div>)}</>
                                    : undefined;
                            }
                        }
                    ]
                })
            ]
        }),
        columnHelper.group({
            id: "group11", //Basic job definition information
            header: ajsTableColumnHeader["group11"],
            columns: [
                {
                    id: "group11.col1",
                    header: ajsTableColumnHeader["group11.col1"],
                    accessorFn: row => row.params<Te>("te")?.value(),
                },
                {
                    id: "group11.col2",
                    header: ajsTableColumnHeader["group11.col2"],
                    accessorFn: row => row.params<Sc>("sc")?.value(),
                },
                {
                    id: "group11.col3",
                    header: ajsTableColumnHeader["group11.col3"],
                    accessorFn: row => row.params<Prm>("prm")?.value(),
                },
                {
                    id: "group11.col4",
                    header: ajsTableColumnHeader["group11.col4"],
                    accessorFn: row => row.params("env"),
                    cell: props => {
                        const env = props.getValue<Env[]>();
                        return Array.isArray(env)
                            ? <>{env.map((v, i) => <div key={i} data-raw={v.rawValue}>{v.value() ?? '\u00A0'}</div>)}</>
                            : undefined;
                    }
                },
                {
                    id: "group11.col5",
                    header: ajsTableColumnHeader["group11.col5"],
                    accessorFn: row => row.params<Ev>("ev")?.value(),
                },
                {
                    id: "group11.col6",
                    header: ajsTableColumnHeader["group11.col6"],
                    accessorFn: row => row.params<Wkp>("wkp")?.value(),
                },
                {
                    id: "group11.col7",
                    header: ajsTableColumnHeader["group11.col7"],
                    accessorFn: row => row.params<Si>("si")?.value(),
                },
                columnHelper.group({
                    id: "group11.group1",
                    header: ajsTableColumnHeader["group11.group1"],
                    columns: [
                        {
                            id: "group11.group1.col1",
                            header: ajsTableColumnHeader["group11.group1.col1"],
                            accessorFn: row => row.params<So>("so")?.value(),
                        },
                        {
                            id: "group11.group1.col2",
                            header: ajsTableColumnHeader["group11.group1.col2"],
                            accessorFn: row => row.params<Soa>("soa")?.value(),
                        }
                    ]
                }),
                columnHelper.group({
                    id: "group11.group2",
                    header: ajsTableColumnHeader["group11.group2"],
                    columns: [
                        {
                            id: "group11.group2.col1",
                            header: ajsTableColumnHeader["group11.group2.col1"],
                            accessorFn: row => row.params<Se>("se")?.value(),
                        },
                        {
                            id: "group11.group2.col2",
                            header: ajsTableColumnHeader["group11.group2.col2"],
                            accessorFn: row => row.params<Sea>("sea")?.value(),
                        }
                    ]
                }),
                {
                    id: "group11.col8",
                    header: ajsTableColumnHeader["group11.col8"],
                    accessorFn: row => row.params<Qm>("qm")?.value(),
                },
                {
                    id: "group11.col9",
                    header: ajsTableColumnHeader["group11.col9"],
                    accessorFn: row => row.params<Qu>("qu")?.value(),
                },
                {
                    id: "group11.col10",
                    header: ajsTableColumnHeader["group11.col10"],
                    accessorFn: row => row.params<Req>("req")?.value(),
                },
                {
                    id: "group11.col11",
                    header: ajsTableColumnHeader["group11.col11"],
                    accessorFn: row => {
                        return ['j', 'rj', 'pj', 'qj'].some(v => v === row.ty.value())
                            ? (row as J | Rj | Pj | Rp | Qj).priority
                            : undefined;
                    },
                    cell: props => {
                        const priority = props.getValue<number | undefined>();
                        return priority
                            ? <Rating value={priority} size="small" sx={{ position: "inherit" }} readOnly />
                            : undefined;
                    }
                },
                columnHelper.group({
                    id: "group11.group3",
                    header: ajsTableColumnHeader["group11.group3"],
                    columns: [
                        {
                            id: "group11.group3.col1",
                            header: ajsTableColumnHeader["group11.group3.col1"],
                            accessorFn: row => row.params<Jd>("jd")?.value(),
                        },
                        {
                            id: "group11.group3.col2",
                            header: ajsTableColumnHeader["group11.group3.col2"],
                            accessorFn: row => row.params<Wth>("wth")?.value(),
                        },
                        {
                            id: "group11.group3.col3",
                            header: ajsTableColumnHeader["group11.group3.col3"],
                            accessorFn: row => row.params<Tho>("tho")?.value(),
                        },
                        {
                            id: "group11.group3.col4",
                            header: ajsTableColumnHeader["group11.group3.col4"],
                            accessorFn: row => row.params<Jdf>("jdf")?.value(),
                        }
                    ]
                }),
                {
                    id: "group11.col12",
                    header: ajsTableColumnHeader["group11.col12"],
                    accessorFn: row => row.params<Abr>("abr")?.value(),
                },
                columnHelper.group({
                    id: "group11.group4",
                    header: ajsTableColumnHeader["group11.group4"],
                    columns: [
                        {
                            id: "group11.group4.col1",
                            header: ajsTableColumnHeader["group11.group4.col1"],
                            accessorFn: row => row.params<Rjs>("rjs")?.value(),
                        },
                        {
                            id: "group11.group4.col2",
                            header: ajsTableColumnHeader["group11.group4.col2"],
                            accessorFn: row => row.params<Rje>("rje")?.value(),
                        }
                    ]
                }),
                {
                    id: "group11.col13",
                    header: ajsTableColumnHeader["group11.col13"],
                    accessorFn: row => row.params<Rec>("rec")?.value(),
                },
                {
                    id: "group11.col14",
                    header: ajsTableColumnHeader["group11.col14"],
                    accessorFn: row => row.params<Rei>("rei")?.value(),
                },
                {
                    id: "group11.col15",
                    header: ajsTableColumnHeader["group11.col15"],
                    accessorFn: row => row.params<Un>("un")?.value(),
                }
            ]
        }),
        columnHelper.group({
            id: "group12", //Judgment job definition information
            header: ajsTableColumnHeader["group12"],
            columns: [
                {
                    id: "group12.col1",
                    header: ajsTableColumnHeader["group12.col1"],
                    accessorFn: row => row.params<Ej>("ej")?.value(),
                },
                columnHelper.group({
                    id: "group12.group1",
                    header: ajsTableColumnHeader["group12.group1"],
                    columns: [
                        {
                            id: "group12.group1.col1",
                            header: ajsTableColumnHeader["group12.group1.col1"],
                            accessorFn: row => row.params<Ejc>("ejc")?.value(),
                        },
                        {
                            id: "group12.group1.col2",
                            header: ajsTableColumnHeader["group12.group1.col2"],
                            accessorFn: row => row.params<Ejl>("ejl")?.value(),
                        },
                        {
                            id: "group12.group1.col3",
                            header: ajsTableColumnHeader["group12.group1.col3"],
                            accessorFn: row => row.params<Ejs>("ejs")?.value(),
                        },
                        {
                            id: "group12.group1.col4",
                            header: ajsTableColumnHeader["group12.group1.col4"],
                            accessorFn: row => row.params<Ejm>("ejm")?.value(),
                        },
                        {
                            id: "group12.group1.col5",
                            header: ajsTableColumnHeader["group12.group1.col5"],
                            accessorFn: row => row.params<Ejh>("ejh")?.value(),
                        },
                        {
                            id: "group12.group1.col6",
                            header: ajsTableColumnHeader["group12.group1.col6"],
                            accessorFn: row => row.params<Ejg>("ejg")?.value(),
                        },
                        {
                            id: "group12.group1.col7",
                            header: ajsTableColumnHeader["group12.group1.col7"],
                            accessorFn: row => row.params<Eju>("eju")?.value(),
                        },
                        {
                            id: "group12.group1.col8",
                            header: ajsTableColumnHeader["group12.group1.col8"],
                            accessorFn: row => row.params<Ejt>("ejt")?.value(),
                        },
                        {
                            id: "group12.group1.col9",
                            header: ajsTableColumnHeader["group12.group1.col9"],
                            accessorFn: row => row.params<Eji>("eji")?.value(),
                        }
                    ]
                }),
                {
                    id: "group12.col2",
                    header: ajsTableColumnHeader["group12.col2"],
                    accessorFn: row => row.params<Ejv>("ejv")?.value(),
                },
                {
                    id: "group12.col3",
                    header: ajsTableColumnHeader["group12.col3"],
                    accessorFn: row => row.params<Ejf>("ejf")?.value(),
                }
            ]
        }),
        columnHelper.group({
            id: "group13", //Event job definition information
            header: ajsTableColumnHeader["group13"],
            columns: [
                {
                    id: "group13.col1",
                    header: ajsTableColumnHeader["group13.col1"],
                    accessorFn: row => row.params<Tmitv>("tmitv")?.value(),
                },
                {
                    id: "group13.col2",
                    header: ajsTableColumnHeader["group13.col2"],
                    accessorFn: row => row.params<Etn>("etn")?.value(),
                },
                {
                    id: "group13.col3",
                    header: ajsTableColumnHeader["group13.col3"],
                    accessorFn: row => row.params<Flwf>("flwf")?.value(),
                },
                columnHelper.group({
                    id: "group13.group1",
                    header: ajsTableColumnHeader["group13.group1"],
                    columns: [
                        {
                            id: "group13.group1.col1",
                            header: ajsTableColumnHeader["group13.group1.col1"],
                            accessorFn: row => row.params<Flwc>("flwc")?.value(),
                        },
                        {
                            id: "group13.group1.col2",
                            header: ajsTableColumnHeader["group13.group1.col2"],
                            accessorFn: row => row.params<Flco>("flco")?.value(),
                        }
                    ]
                }),
                {
                    id: "group13.col4",
                    header: ajsTableColumnHeader["group13.col4"],
                    accessorFn: row => row.params<Flwi>("flwi")?.value(),
                },
                {
                    id: "group13.col5",
                    header: ajsTableColumnHeader["group13.col5"],
                    accessorFn: row => row.params<Evwid>("evwid")?.value(),
                },
                {
                    id: "group13.col6",
                    header: ajsTableColumnHeader["group13.col6"],
                    accessorFn: row => row.params<Evhst>("evhst")?.value(),
                },
                {
                    id: "group13.col7",
                    header: ajsTableColumnHeader["group13.col7"],
                    accessorFn: row => row.params<Evwms>("evwms")?.value(),
                },
                {
                    id: "group13.col8",
                    header: ajsTableColumnHeader["group13.col8"],
                    accessorFn: row => row.params<Ets>("ets")?.value(),
                }
            ]
        }),
        columnHelper.group({
            id: "group14", //Action job definition information
            header: ajsTableColumnHeader["group14"],
            columns: [
                {
                    id: "group14.col1",
                    header: ajsTableColumnHeader["group14.col1"],
                    accessorFn: row => row.params<Evsid>("evsid")?.value(),
                },
                {
                    id: "group14.col2",
                    header: ajsTableColumnHeader["group14.col2"],
                    accessorFn: row => row.params<Evhst>("evhst")?.value(),
                },
                {
                    id: "group14.col3",
                    header: ajsTableColumnHeader["group14.col3"],
                    accessorFn: row => row.params<Evsms>("evsms")?.value(),
                },
                {
                    id: "group14.col4",
                    header: ajsTableColumnHeader["group14.col4"],
                    accessorFn: row => row.params<Evssv>("evssv")?.value(),
                },
                {
                    id: "group14.col5",
                    header: ajsTableColumnHeader["group14.col5"],
                    accessorFn: row => row.params<Evsrt>("evsrt")?.value(),
                },
                {
                    id: "group14.col6",
                    header: ajsTableColumnHeader["group14.col6"],
                    accessorFn: row => row.params<Evspl>("evspl")?.value(),
                },
                {
                    id: "group14.col7",
                    header: ajsTableColumnHeader["group14.col7"],
                    accessorFn: row => row.params<Evsrc>("evsrc")?.value(),
                },
                {
                    id: "group14.col8",
                    header: ajsTableColumnHeader["group14.col8"],
                    accessorFn: row => row.params<Pfm>("pfm")?.value(),
                }
            ]
        }),
        columnHelper.group({
            id: "group15", //Job common attribute information
            header: ajsTableColumnHeader["group15"],
            columns: [
                {
                    id: "group15.col1",
                    header: ajsTableColumnHeader["group15.col1"],
                    accessorFn: row => row.params<Eu>("eu")?.value(),
                },
                {
                    id: "group15.col2",
                    header: ajsTableColumnHeader["group15.col2"],
                    accessorFn: row => row.params<Etm>("etm")?.value(),
                },
                {
                    id: "group15.col3",
                    header: ajsTableColumnHeader["group15.col3"],
                    accessorFn: row => row.params<Fd>("fd")?.value(),
                },
                {
                    id: "group15.col4",
                    header: ajsTableColumnHeader["group15.col4"],
                    accessorFn: row => row.params<Jty>("jty")?.value(),
                },
                columnHelper.group({
                    id: "group15.group1",
                    header: ajsTableColumnHeader["group15.group1"],
                    columns: [
                        {
                            id: "group15.group1.col1",
                            header: ajsTableColumnHeader["group15.group1.col1"],
                            accessorFn: row => row.params<Ts1>("ts1")?.value(),
                        },
                        {
                            id: "group15.group1.col2",
                            header: ajsTableColumnHeader["group15.group1.col2"],
                            accessorFn: row => row.params<Td1>("td1")?.value(),
                        },
                        {
                            id: "group15.group1.col3",
                            header: ajsTableColumnHeader["group15.group1.col3"],
                            accessorFn: row => row.params<Top1>("top1")?.value(),
                        }
                    ]
                }),
                columnHelper.group({
                    id: "group15.group2",
                    header: ajsTableColumnHeader["group15.group2"],
                    columns: [
                        {
                            id: "group15.group2.col1",
                            header: ajsTableColumnHeader["group15.group2.col1"],
                            accessorFn: row => row.params<Ts2>("ts2")?.value(),
                        },
                        {
                            id: "group15.group2.col2",
                            header: ajsTableColumnHeader["group15.group2.col2"],
                            accessorFn: row => row.params<Td2>("td2")?.value(),
                        },
                        {
                            id: "group15.group2.col3",
                            header: ajsTableColumnHeader["group15.group2.col3"],
                            accessorFn: row => row.params<Top2>("top2")?.value(),
                        }
                    ]
                }),
                columnHelper.group({
                    id: "group15.group3",
                    header: ajsTableColumnHeader["group15.group3"],
                    columns: [
                        {
                            id: "group15.group3.col1",
                            header: ajsTableColumnHeader["group15.group3.col1"],
                            accessorFn: row => row.params<Ts3>("ts3")?.value(),
                        },
                        {
                            id: "group15.group3.col2",
                            header: ajsTableColumnHeader["group15.group3.col2"],
                            accessorFn: row => row.params<Td3>("td3")?.value(),
                        },
                        {
                            id: "group15.group3.col3",
                            header: ajsTableColumnHeader["group15.group3.col3"],
                            accessorFn: row => row.params<Top3>("top3")?.value(),
                        }
                    ]
                }),
                columnHelper.group({
                    id: "group15.group4",
                    header: ajsTableColumnHeader["group15.group4"],
                    columns: [
                        {
                            id: "group15.group4.col1",
                            header: ajsTableColumnHeader["group15.group4.col1"],
                            accessorFn: row => row.params<Ts4>("ts4")?.value(),
                        },
                        {
                            id: "group15.group4.col2",
                            header: ajsTableColumnHeader["group15.group4.col2"],
                            accessorFn: row => row.params<Td4>("td4")?.value(),
                        },
                        {
                            id: "group15.group4.col3",
                            header: ajsTableColumnHeader["group15.group4.col3"],
                            accessorFn: row => row.params<Top4>("top4")?.value(),
                        }
                    ]
                })
            ]
        }),
        columnHelper.group({
            id: "group16", //Waiting condition definition information
            header: ajsTableColumnHeader["group16"],
            columns: [
                {
                    id: "group16.col1",
                    header: ajsTableColumnHeader["group16.col1"],
                    accessorFn: row => row.params<Eun>("eun"),
                    cell: props => {
                        const eun = props.getValue<Eun[]>();
                        return Array.isArray(eun)
                            ? <>{eun.map((v, i) => <div key={i} data-raw={v.rawValue}>{v.value() ?? '\u00A0'}</div>)}</>
                            : undefined;
                    }
                },
                {
                    id: "group16.col2",
                    header: ajsTableColumnHeader["group16.col2"],
                    accessorFn: row => row.params<Eun>("eun") ? row.params<Mm>("mm")?.value() : undefined,
                },
                {
                    id: "group16.col3",
                    header: ajsTableColumnHeader["group16.col3"],
                    accessorFn: row => row.params<Eun>("eun") ? row.params<Nmg>("nmg")?.value() : undefined,
                },
                {
                    id: "group16.col4",
                    header: ajsTableColumnHeader["group16.col4"],
                    accessorFn: row => row.params<Eun>("eun") ? row.params<Uem>("uem")?.value() : undefined,
                },
                {
                    id: "group16.col5",
                    header: ajsTableColumnHeader["group16.col5"],
                    accessorFn: row => row.params<Eun>("eun") ? row.params<Ega>("ega")?.value() : undefined,
                }
            ]
        }),
        columnHelper.group({
            id: "group17", //Tool unit definition information
            header: ajsTableColumnHeader["group17"],
            columns: [
                columnHelper.group({
                    id: "group17.group1",
                    header: ajsTableColumnHeader["group17.group1"],
                    columns: [
                        {
                            id: "group17.group1.col1",
                            header: ajsTableColumnHeader["group17.group1.col1"],
                            accessorFn: row => ['cpj', 'rcpj'].includes(row.ty.value()) ? row.params<Prm>("prm")?.value() : undefined,
                        },
                        {
                            id: "group17.group1.col2",
                            header: ajsTableColumnHeader["group17.group1.col2"],
                            accessorFn: row => ['cpj', 'rcpj'].includes(row.ty.value()) ? row.params("env") : undefined,
                            cell: props => {
                                const env = props.getValue<Env[]>();
                                return Array.isArray(env)
                                    ? <>{env.map((v, i) => <div key={i} data-raw={v.rawValue}>{v.value() ?? '\u00A0'}</div>)}</>
                                    : undefined;
                            }
                        }
                    ]
                })
            ]
        }),
        columnHelper.group({
            id: "group18", //Flexible job definition information
            header: ajsTableColumnHeader["group18"],
            columns: [
                {
                    id: "group18.col1",
                    header: ajsTableColumnHeader["group18.col1"],
                    accessorFn: row => row.params<Da>("da")?.value(),
                },
                {
                    id: "group18.col2",
                    header: ajsTableColumnHeader["group18.col2"],
                    accessorFn: row => row.params<Fxg>("fxg")?.value(),
                },
                {
                    id: "group18.col3",
                    header: ajsTableColumnHeader["group18.col3"],
                    accessorFn: row => ['fxj', 'rfxj'].includes(row.ty.value()) ? row.params<Ex>("ex")?.value() : undefined,
                }
            ]
        }),
        columnHelper.group({
            id: "group19", //Http connection job definition information
            header: ajsTableColumnHeader["group19"],
            columns: [
                {
                    id: "group19.col1",
                    header: ajsTableColumnHeader["group19.col1"],
                    accessorFn: row => row.params<Htcfl>("htcfl")?.value(),
                },
                {
                    id: "group19.col2",
                    header: ajsTableColumnHeader["group19.col2"],
                    accessorFn: row => row.params<Htknd>("htknd")?.value(),
                },
                {
                    id: "group19.col3",
                    header: ajsTableColumnHeader["group19.col3"],
                    accessorFn: row => row.params<Htexm>("htexm")?.value(),
                },
                {
                    id: "group19.col4",
                    header: ajsTableColumnHeader["group19.col4"],
                    accessorFn: row => row.params<Htrqf>("htrqf")?.value(),
                },
                {
                    id: "group19.col5",
                    header: ajsTableColumnHeader["group19.col5"],
                    accessorFn: row => row.params<Htrqu>("htrqu")?.value(),
                },
                {
                    id: "group19.col6",
                    header: ajsTableColumnHeader["group19.col6"],
                    accessorFn: row => row.params<Htrqm>("htrqm")?.value(),
                },
                {
                    id: "group19.col7",
                    header: ajsTableColumnHeader["group19.col7"],
                    accessorFn: row => row.params<Htstf>("htstf")?.value(),
                },
                {
                    id: "group19.col8",
                    header: ajsTableColumnHeader["group19.col8"],
                    accessorFn: row => row.params<Htspt>("htspt")?.value(),
                },
                {
                    id: "group19.col9",
                    header: ajsTableColumnHeader["group19.col9"],
                    accessorFn: row => row.params<Htrhf>("htrhf")?.value(),
                },
                {
                    id: "group19.col10",
                    header: ajsTableColumnHeader["group19.col10"],
                    accessorFn: row => row.params<Htrbf>("htrbf")?.value(),
                },
                {
                    id: "group19.col11",
                    header: ajsTableColumnHeader["group19.col11"],
                    accessorFn: row => row.params<Htcdm>("htcdm")?.value(),
                }
            ]
        }),
        columnHelper.group({
            id: "group20", //Other definition information
            header: ajsTableColumnHeader["group20"],
            columns: [
                {
                    id: "group20.col1",
                    header: ajsTableColumnHeader["group20.col1"],
                    accessorKey: undefined,
                }
            ]
        }),
        // columnHelper.group({
        //     id: "group21", //Custom job definition information
        //     header: ajsTableColumnHeader["group21"],
        //     columns: [
        //         {
        //             id: "group21.col1",
        //             header: ajsTableColumnHeader["group21.col1"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col2",
        //             header: ajsTableColumnHeader["group21.col2"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col3",
        //             header: ajsTableColumnHeader["group21.col3"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col4",
        //             header: ajsTableColumnHeader["group21.col4"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col5",
        //             header: ajsTableColumnHeader["group21.col5"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col6",
        //             header: ajsTableColumnHeader["group21.col6"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col7",
        //             header: ajsTableColumnHeader["group21.col7"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col8",
        //             header: ajsTableColumnHeader["group21.col8"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col9",
        //             header: ajsTableColumnHeader["group21.col9"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col10",
        //             header: ajsTableColumnHeader["group21.col10"],
        //             accessorKey: undefined,
        //         },
        //         columnHelper.group({
        //             id: "group21.group1",
        //             header: ajsTableColumnHeader["group21.group1"],
        //             columns: [
        //                 {
        //                     id: "group21.group1.col1",
        //                     header: ajsTableColumnHeader["group21.group1.col1"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col2",
        //                     header: ajsTableColumnHeader["group21.group1.col2"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col3",
        //                     header: ajsTableColumnHeader["group21.group1.col3"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col4",
        //                     header: ajsTableColumnHeader["group21.group1.col4"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col5",
        //                     header: ajsTableColumnHeader["group21.group1.col5"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col6",
        //                     header: ajsTableColumnHeader["group21.group1.col6"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col7",
        //                     header: ajsTableColumnHeader["group21.group1.col7"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col8",
        //                     header: ajsTableColumnHeader["group21.group1.col8"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col9",
        //                     header: ajsTableColumnHeader["group21.group1.col9"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col10",
        //                     header: ajsTableColumnHeader["group21.group1.col10"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col11",
        //                     header: ajsTableColumnHeader["group21.group1.col11"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col12",
        //                     header: ajsTableColumnHeader["group21.group1.col12"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col13",
        //                     header: ajsTableColumnHeader["group21.group1.col13"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col14",
        //                     header: ajsTableColumnHeader["group21.group1.col14"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col15",
        //                     header: ajsTableColumnHeader["group21.group1.col15"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col16",
        //                     header: ajsTableColumnHeader["group21.group1.col16"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col17",
        //                     header: ajsTableColumnHeader["group21.group1.col17"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col18",
        //                     header: ajsTableColumnHeader["group21.group1.col18"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col19",
        //                     header: ajsTableColumnHeader["group21.group1.col19"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group1.col20",
        //                     header: ajsTableColumnHeader["group21.group1.col20"],
        //                     accessorKey: undefined,
        //                 }
        //             ]
        //         }),
        //         {
        //             id: "group21.col11",
        //             header: ajsTableColumnHeader["group21.col11"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col12",
        //             header: ajsTableColumnHeader["group21.col12"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col13",
        //             header: ajsTableColumnHeader["group21.col13"],
        //             accessorKey: undefined,
        //         },
        //         {
        //             id: "group21.col14",
        //             header: ajsTableColumnHeader["group21.col14"],
        //             accessorKey: undefined,
        //         },
        //         columnHelper.group({
        //             id: "group21.group2",
        //             header: ajsTableColumnHeader["group21.group2"],
        //             columns: [
        //                 {
        //                     id: "group21.group2.col1",
        //                     header: ajsTableColumnHeader["group21.group2.col1"],
        //                     accessorKey: undefined,
        //                 },
        //                 {
        //                     id: "group21.group2.col2",
        //                     header: ajsTableColumnHeader["group21.group2.col2"],
        //                     accessorKey: undefined,
        //                 }
        //             ]
        //         }),
        //         {
        //             id: "group21.col15",
        //             header: ajsTableColumnHeader["group21.col15"],
        //             accessorKey: undefined,
        //         }
        //     ]
        // })
    ]
};