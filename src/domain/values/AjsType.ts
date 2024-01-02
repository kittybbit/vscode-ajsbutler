/** unit types */
export const Ty = ['g', 'mg', 'n', 'rn', 'rm', 'rr', 'rc', 'mn', 'j', 'rj', 'pj', 'rp', 'qj', 'rq',
    'jdj', 'rjdj', 'orj', 'rorj', 'evwj', 'revwj', 'flwj', 'rflwj', 'mlwj', 'rmlwj', 'mqwj', 'rmqwj',
    'mswj', 'rmswj', 'lfwj', 'rlfwj', 'ntwj', 'rntwj', 'tmwj', 'rtmwj', 'evsj', 'revsj', 'mlsj',
    'rmlsj', 'mqsj', 'rmqsj', 'mssj', 'rmssj', 'cmsj', 'rcmsj', 'pwlj', 'rpwlj', 'pwrj', 'rpwrj',
    'cj', 'rcj', 'cpj', 'rcpj', 'fxj', 'rfxj', 'htpj', 'rhtpj', 'nc'] as const;
export type TyType = typeof Ty[number];
export const isTy = (ty: string): ty is TyType => Ty.some((v) => v === ty);

/** unit definition parameter type */
export const Params = ['ab', 'abr', 'ar', 'cd', 'cftd', 'cgs', 'cl', 'cm', 'cmaif', 'cmsts', 'cond',
    'cty', 'cy', 'da', 'de', 'ed', 'ega', 'ej', 'ejc', 'ejf', 'ejg', 'ejh', 'eji', 'ejl', 'ejm', 'ejn',
    'ejs', 'ejt', 'eju', 'ejv', 'el', 'env', 'etm', 'etn', 'ets', 'eu', 'eun', 'ev', 'evdet', 'evesc',
    'evgid', 'evgrp', 'evhst', 'evipa', 'evpid', 'evsfr', 'evsid', 'evsms', 'evspl', 'evsrc', 'evsrt',
    'evssv', 'evtmc', 'evuid', 'evusr', 'evwfr', 'evwid', 'evwms', 'evwsv', 'ex', 'ey', 'f', 'fd',
    'flco', 'flwc', 'flwf', 'flwi', 'fxg', 'gty', 'ha', 'htcdm', 'htcfl', 'htexm', 'htknd', 'htrbf',
    'htrhf', 'htrqf', 'htrqm', 'htrqu', 'htspt', 'htstf', 'jc', 'jd', 'jdf', 'jpoif', 'jty', 'lfcre',
    'lfdft', 'lffnm', 'lfhds', 'lfmks', 'lfmxl', 'lfrft', 'lfsiv', 'lfsrc', 'lftpd', 'ln', 'mcs', 'md',
    'mh', 'mladr', 'mlafl', 'mlatf', 'mlftx', 'mllst', 'mlprf', 'mlsav', 'mlsbj', 'mlsfd', 'mlstx',
    'mltxt', 'mm', 'mp', 'mqcor', 'mqdsc', 'mqeqn', 'mqhld', 'mqmdl', 'mqmdn', 'mqmfn', 'mqmgr', 'mqpgm',
    'mqpri', 'mqprm', 'mqque', 'mqsfn', 'ms', 'msapl', 'mshld', 'msjnl', 'mslbl', 'mslmt', 'msmod',
    'mspri', 'msqlb', 'msqpt', 'msrer', 'mssvf', 'mstfn', 'msttp', 'msunr', 'mu', 'ncex', 'nchn', 'ncl',
    'ncn', 'ncr', 'ncs', 'ncsv', 'ni', 'nmg', 'ntcls', 'ntdis', 'nteid', 'ntevt', 'ntlgt', 'ntncl',
    'ntnei', 'ntnsr', 'ntolg', 'ntsrc', 'op', 'pfm', 'pr', 'prm', 'pwlf', 'pwlt', 'pwrf', 'pwrh', 'pwrn',
    'pwrp', 'pwrr', 'pwrw', 'qm', 'qu', 'rec', 'rei', 'req', 'rg', 'rh', 'rje', 'rjs', 'sc', 'sd', 'sdd',
    'se', 'sea', 'sh', 'shd', 'si', 'so', 'soa', 'st', 'stt', 'sy', 'sz', 't', 'td1', 'td2', 'td3', 'td4',
    'te', 'tho', 'tmitv', 'top1', 'top2', 'top3', 'top4', 'ts1', 'ts2', 'ts3', 'ts4', 'ty', 'uem', 'un',
    'unit', 'wc', 'wkp', 'wt', 'wth'] as const;
export type ParamsType = typeof Params[number];
export const isParams = (param: string): param is ParamsType => Params.some((v) => v === param);

/** week */
export const Week = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'] as const;
export type WeekType = typeof Week[number];
export const isWeek = (week?: string): week is WeekType => Week.some((v) => v === week);