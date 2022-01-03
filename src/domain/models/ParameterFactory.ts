import { isParams } from "../values/AjsType";
import { Ab, Abr, Ar, Cd, Cftd, Cgs, Cl, Cm, Cmaif, Cmsts, Cond, Cty, Cy, Da, De, Ed, Ega, Ej, Ejc, Ejf, Ejg, Ejh, Eji, Ejl, Ejm, Ejn, Ejs, Ejt, Eju, Ejv, El, Env, Etm, Etn, Ets, Eu, Eun, Ev, Evdet, Evesc, Evgid, Evgrp, Evhst, Evipa, Evpid, Evsfr, Evsid, Evsms, Evspl, Evsrc, Evsrt, Evssv, Evtmc, Evuid, Evusr, Evwfr, Evwid, Evwms, Evwsv, Ex, Ey, F, Fd, Flco, Flwc, Flwf, Flwi, Fxg, Gty, Ha, Htcdm, Htcfl, Htexm, Htknd, Htrbf, Htrhf, Htrqf, Htrqm, Htrqu, Htspt, Htstf, Jc, Jd, Jdf, Jpoif, Jty, Lfcre, Lfdft, Lffnm, Lfhds, Lfmks, Lfmxl, Lfrft, Lfsiv, Lfsrc, Lftpd, Ln, Mcs, Md, Mh, Mladr, Mlafl, Mlatf, Mlftx, Mllst, Mlprf, Mlsav, Mlsbj, Mlsfd, Mlstx, Mltxt, Mm, Mp, Mqcor, Mqdsc, Mqeqn, Mqhld, Mqmdl, Mqmdn, Mqmfn, Mqmgr, Mqpgm, Mqpri, Mqprm, Mqque, Mqsfn, Ms, Msapl, Mshld, Msjnl, Mslbl, Mslmt, Msmod, Mspri, Msqlb, Msqpt, Msrer, Mssvf, Mstfn, Msttp, Msunr, Mu, Ncex, Nchn, Ncl, Ncn, Ncr, Ncs, Ncsv, Ni, Nmg, Ntcls, Ntdis, Nteid, Ntevt, Ntlgt, Ntncl, Ntnei, Ntnsr, Ntolg, Ntsrc, Op, ParamBase, Pfm, Pr, Prm, Pwlf, Pwlt, Pwrf, Pwrh, Pwrn, Pwrp, Pwrr, Pwrw, Qm, Qu, Rec, Rei, Req, Rg, Rh, Rje, Rjs, Rule, Sc, Sd, Sdd, Se, Sea, Sh, Shd, Si, So, Soa, St, Stt, Sy, Sz, T, Td1, Td2, Td3, Td4, Te, Tho, Tmitv, Top1, Top2, Top3, Top4, Ts1, Ts2, Ts3, Ts4, Ty, Uem, Un, Unit, Wc, Wkp, Wt, Wth } from "./ParameterEntities";
import { UnitEntity } from "./UnitEntities";

type ParamArg = ParamBase & {
    'inherit'?: boolean; // need to get parent value
    'defaultRawValue'?: string | string[];
}

/** Create a parameter value map with rule numbers as keys. */
const mapByRule = (params: Array<Rule> | undefined) => {
    return params
        ? params.reduce((work, param) => {
            work[String(param.rule)] = param;
            return work;
        }, {} as { [rule: string]: Rule })
        : undefined;
};

const adjustToSdItemCount = (sd: Array<Sd> | undefined, param: Array<Exclude<Rule, Sd>> | undefined, fn: (rule: number) => Rule | null): Array<Rule | null> | undefined => {
    const sdMap = mapByRule(sd);
    if (sdMap === undefined) {
        return undefined;
    }
    const paramMap = mapByRule(param);
    const newParams: Array<Rule | null> = [];
    Object.keys(sdMap).forEach(sdRule => {
        const rule = sdMap[sdRule].rule;
        newParams.push((paramMap && paramMap[String(rule)]) ?? fn(rule));
    });
    return newParams;
}

export class ParamFactory {
    static ab(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ab',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ab(param) : undefined;
    }
    static abr(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'abr',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Abr(param) : undefined;
    }
    static ar(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'ar',
        });
        return params ? params.map(param => new Ar(param)) : undefined;
    }
    static cd(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'cd',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Cd(param) : undefined;
    }
    static cftd(unit: UnitEntity, defaultRawValue: string) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'cftd',
            'defaultRawValue': defaultRawValue
        });
        const values = params ? params.map(param => new Cftd(param)).sort((a, b) => a.rule - b.rule) : undefined;
        // adjust
        return adjustToSdItemCount(unit.params('sd'), values, (rule) => new Cftd({
            'unit': unit,
            'parameter': 'cftd',
            'inherited': false,
            'defaultRawValue': `${rule},${defaultRawValue}`,
            'position': -1,
        }));
    }
    static cgs(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'cgs',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Cgs(param) : undefined;
    }
    static cl(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'cl',
            'inherit': true,
        });
        return params ? params.map(param => new Cl(param)) : undefined;
    }
    static cm(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'cm',
        });
        return param ? new Cm(param) : undefined;
    }
    static cmaif(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'cmaif',
        });
        return param ? new Cmaif(param) : undefined;
    }
    static cmsts(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'cmsts',
        });
        return param ? new Cmsts(param) : undefined;
    }
    static cond(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'cond',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Cond(param) : undefined;
    }
    static cty(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'cty',
        });
        return param ? new Cty(param) : undefined;
    }
    static cy(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'cy',
        });
        const values = params ? params.map(param => new Cy(param)).sort((a, b) => a.rule - b.rule) : undefined;
        // adjust
        return adjustToSdItemCount(unit.params('sd'), values, () => null);
    }
    static da(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'da',
        });
        return param ? new Da(param) : undefined;
    }
    static de(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'de',
            'defaultRawValue': defaultRawValue
        });
        return param ? new De(param) : undefined;
    }
    static ed(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ed',
        });
        return param ? new Ed(param) : undefined;
    }
    static ega(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ega',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ega(param) : undefined;
    }
    static ej(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ej',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ej(param) : undefined;
    }
    static ejc(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejc',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ejc(param) : undefined;
    }
    static ejf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejf',
        });
        return param ? new Ejf(param) : undefined;
    }
    static ejg(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejg',
        });
        return param ? new Ejg(param) : undefined;
    }
    static ejh(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejh',
        });
        return param ? new Ejh(param) : undefined;
    }
    static eji(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'eji',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Eji(param) : undefined;
    }
    static ejl(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejl',
        });
        return param ? new Ejl(param) : undefined;
    }
    static ejm(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejm',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ejm(param) : undefined;
    }
    static ejn(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejn',
        });
        return param ? new Ejn(param) : undefined;
    }
    static ejs(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejs',
        });
        return param ? new Ejs(param) : undefined;
    }
    static ejt(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejt',
        });
        return param ? new Ejt(param) : undefined;
    }
    static eju(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'eju',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Eju(param) : undefined;
    }
    static ejv(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ejv',
        });
        return param ? new Ejv(param) : undefined;
    }
    static el(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'el',
        });
        return params ? params.map(param => new El(param)) : undefined;
    }
    static env(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'env',
        });
        return params ? params.map(param => new Env(param)) : undefined;
    }
    static etm(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'etm',
        });
        return param ? new Etm(param) : undefined;
    }
    static etn(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'etn',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Etn(param) : undefined;
    }
    static ets(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ets',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Ets(param) : undefined;
    }
    static eu(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'eu',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Eu(param) : undefined;
    }
    static eun(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'eun',
        });
        return params ? params.map(param => new Eun(param)) : undefined;
    }
    static ev(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ev',
        });
        return param ? new Ev(param) : undefined;
    }
    static evdet(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evdet',
        });
        return param ? new Evdet(param) : undefined;
    }
    static evesc(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evesc',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Evesc(param) : undefined;
    }
    static evgid(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evgid',
        });
        return param ? new Evgid(param) : undefined;
    }
    static evgrp(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evgrp',
        });
        return param ? new Evgrp(param) : undefined;
    }
    static evhst(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evhst',
        });
        return param ? new Evhst(param) : undefined;
    }
    static evipa(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evipa',
        });
        return param ? new Evipa(param) : undefined;
    }
    static evpid(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evpid',
        });
        return param ? new Evpid(param) : undefined;
    }
    static evsfr(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evsfr',
        });
        return param ? new Evsfr(param) : undefined;
    }
    static evsid(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evsid',
        });
        return param ? new Evsid(param) : undefined;
    }
    static evsms(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evsms',
        });
        return param ? new Evsms(param) : undefined;
    }
    static evspl(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evspl',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Evspl(param) : undefined;
    }
    static evsrc(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evsrc',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Evsrc(param) : undefined;
    }
    static evsrt(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evsrt',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Evsrt(param) : undefined;
    }
    static evssv(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evssv',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Evssv(param) : undefined;
    }
    static evtmc(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evtmc',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Evtmc(param) : undefined;
    }
    static evuid(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evuid',
        });
        return param ? new Evuid(param) : undefined;
    }
    static evusr(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evusr',
        });
        return param ? new Evusr(param) : undefined;
    }
    static evwfr(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evwfr',
        });
        return param ? new Evwfr(param) : undefined;
    }
    static evwid(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evwid',
        });
        return param ? new Evwid(param) : undefined;
    }
    static evwms(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evwms',
        });
        return param ? new Evwms(param) : undefined;
    }
    static evwsv(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'evwsv',
        });
        return param ? new Evwsv(param) : undefined;
    }
    static ex(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ex',
        });
        return param ? new Ex(param) : undefined;
    }
    static ey(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'ey',
        });
        const values = params ? params.map(param => new Ey(param)).sort((a, b) => a.rule - b.rule) : undefined;
        // adjust
        return adjustToSdItemCount(unit.params('sd'), values, () => null);
    }
    static f(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'f',
        });
        return param ? new F(param) : undefined;
    }
    static fd(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'fd',
        });
        return param ? new Fd(param) : undefined;
    }
    static flco(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'flco',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Flco(param) : undefined;
    }
    static flwc(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'flwc',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Flwc(param) : undefined;
    }
    static flwf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'flwf',
        });
        return param ? new Flwf(param) : undefined;
    }
    static flwi(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'flwi',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Flwi(param) : undefined;
    }
    static fxg(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'fxg',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Fxg(param) : undefined;
    }
    static gty(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'gty',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Gty(param) : undefined;
    }
    static ha(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ha',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ha(param) : undefined;
    }
    static htcdm(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htcdm',
        });
        return param ? new Htcdm(param) : undefined;
    }
    static htcfl(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htcfl',
        });
        return param ? new Htcfl(param) : undefined;
    }
    static htexm(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htexm',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Htexm(param) : undefined;
    }
    static htknd(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htknd',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Htknd(param) : undefined;
    }
    static htrbf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htrbf',
        });
        return param ? new Htrbf(param) : undefined;
    }
    static htrhf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htrhf',
        });
        return param ? new Htrhf(param) : undefined;
    }
    static htrqf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htrqf',
        });
        return param ? new Htrqf(param) : undefined;
    }
    static htrqm(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htrqm',
        });
        return param ? new Htrqm(param) : undefined;
    }
    static htrqu(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htrqu',
        });
        return param ? new Htrqu(param) : undefined;
    }
    static htspt(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htspt',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Htspt(param) : undefined;
    }
    static htstf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'htstf',
        });
        return param ? new Htstf(param) : undefined;
    }
    static jc(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'jc',
        });
        return param ? new Jc(param) : undefined;
    }
    static jd(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'jd',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Jd(param) : undefined;
    }
    static jdf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'jdf',
        });
        return param ? new Jdf(param) : undefined;
    }
    static jpoif(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'jpoif',
        });
        return params ? params.map(param => new Jpoif(param)) : undefined;
    }
    static jty(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'jty',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Jty(param) : undefined;
    }
    static lfcre(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lfcre',
        });
        return param ? new Lfcre(param) : undefined;
    }
    static lfdft(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lfdft',
        });
        return param ? new Lfdft(param) : undefined;
    }
    static lffnm(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lffnm',
        });
        return param ? new Lffnm(param) : undefined;
    }
    static lfhds(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lfhds',
        });
        return param ? new Lfhds(param) : undefined;
    }
    static lfmks(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lfmks',
        });
        return param ? new Lfmks(param) : undefined;
    }
    static lfmxl(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lfmxl',
        });
        return param ? new Lfmxl(param) : undefined;
    }
    static lfrft(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lfrft',
        });
        return param ? new Lfrft(param) : undefined;
    }
    static lfsiv(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lfsiv',
        });
        return param ? new Lfsiv(param) : undefined;
    }
    static lfsrc(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lfsrc',
        });
        return param ? new Lfsrc(param) : undefined;
    }
    static lftpd(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'lftpd',
        });
        return param ? new Lftpd(param) : undefined;
    }
    static ln(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'ln',
        });
        return params ? params.map(param => new Ln(param)).sort((a, b) => a.rule - b.rule) : undefined;
    }
    static mcs(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mcs',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Mcs(param) : undefined;
    }
    static md(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'md',
            'inherit': true,
            'defaultRawValue': defaultRawValue
        });
        return param ? new Md(param) : undefined;
    }
    static mh(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mh',
        });
        return param ? new Mh(param) : undefined;
    }
    static mladr(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'mladr',
        });
        return params ? params.map(param => new Mladr(param)) : undefined;
    }
    static mlafl(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mlafl',
        });
        return param ? new Mlafl(param) : undefined;
    }
    static mlatf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mlatf',
        });
        return param ? new Mlatf(param) : undefined;
    }
    static mlftx(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mlftx',
        });
        return param ? new Mlftx(param) : undefined;
    }
    static mllst(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mllst',
        });
        return param ? new Mllst(param) : undefined;
    }
    static mlprf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mlprf',
        });
        return param ? new Mlprf(param) : undefined;
    }
    static mlsav(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mlsav',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Mlsav(param) : undefined;
    }
    static mlsbj(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'mlsbj',
        });
        return params ? params.map(param => new Mlsbj(param)) : undefined;
    }
    static mlsfd(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mlsfd',
        });
        return param ? new Mlsfd(param) : undefined;
    }
    static mlstx(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mlstx',
        });
        return param ? new Mlstx(param) : undefined;
    }
    static mltxt(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'mltxt',
        });
        return params ? params.map(param => new Mltxt(param)) : undefined;
    }
    static mm(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mm',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Mm(param) : undefined;
    }
    static mp(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mp',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Mp(param) : undefined;
    }
    static mqcor(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqcor',
        });
        return param ? new Mqcor(param) : undefined;
    }
    static mqdsc(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqdsc',
        });
        return param ? new Mqdsc(param) : undefined;
    }
    static mqeqn(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqeqn',
        });
        return param ? new Mqeqn(param) : undefined;
    }
    static mqhld(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqhld',
        });
        return param ? new Mqhld(param) : undefined;
    }
    static mqmdl(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqmdl',
        });
        return param ? new Mqmdl(param) : undefined;
    }
    static mqmdn(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqmdn',
        });
        return param ? new Mqmdn(param) : undefined;
    }
    static mqmfn(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqmfn',
        });
        return param ? new Mqmfn(param) : undefined;
    }
    static mqmgr(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqmgr',
        });
        return param ? new Mqmgr(param) : undefined;
    }
    static mqpgm(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqpgm',
        });
        return param ? new Mqpgm(param) : undefined;
    }
    static mqpri(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqpri',
        });
        return param ? new Mqpri(param) : undefined;
    }
    static mqprm(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqprm',
        });
        return param ? new Mqprm(param) : undefined;
    }
    static mqque(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqque',
        });
        return param ? new Mqque(param) : undefined;
    }
    static mqsfn(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mqsfn',
        });
        return param ? new Mqsfn(param) : undefined;
    }
    static ms(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ms',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ms(param) : undefined;
    }
    static msapl(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'msapl',
        });
        return param ? new Msapl(param) : undefined;
    }
    static mshld(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mshld',
        });
        return param ? new Mshld(param) : undefined;
    }
    static msjnl(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'msjnl',
        });
        return param ? new Msjnl(param) : undefined;
    }
    static mslbl(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mslbl',
        });
        return param ? new Mslbl(param) : undefined;
    }
    static mslmt(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mslmt',
        });
        return param ? new Mslmt(param) : undefined;
    }
    static msmod(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'msmod',
        });
        return param ? new Msmod(param) : undefined;
    }
    static mspri(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mspri',
        });
        return param ? new Mspri(param) : undefined;
    }
    static msqlb(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'msqlb',
        });
        return param ? new Msqlb(param) : undefined;
    }
    static msqpt(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'msqpt',
        });
        return param ? new Msqpt(param) : undefined;
    }
    static msrer(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'msrer',
        });
        return param ? new Msrer(param) : undefined;
    }
    static mssvf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mssvf',
        });
        return param ? new Mssvf(param) : undefined;
    }
    static mstfn(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mstfn',
        });
        return param ? new Mstfn(param) : undefined;
    }
    static msttp(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'msttp',
        });
        return param ? new Msttp(param) : undefined;
    }
    static msunr(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'msunr',
        });
        return param ? new Msunr(param) : undefined;
    }
    static mu(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'mu',
        });
        return param ? new Mu(param) : undefined;
    }
    static ncex(unit: UnitEntity, defaultRawValue?: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ncex',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ncex(param) : undefined;
    }
    static nchn(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'nchn',
        });
        return param ? new Nchn(param) : undefined;
    }
    static ncl(unit: UnitEntity, defaultRawValue?: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ncl',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ncl(param) : undefined;
    }
    static ncn(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ncn',
        });
        return param ? new Ncn(param) : undefined;
    }
    static ncr(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ncr',
        });
        return param ? new Ncr(param) : undefined;
    }
    static ncs(unit: UnitEntity, defaultRawValue?: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ncs',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Ncs(param) : undefined;
    }
    static ncsv(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ncsv',
        });
        return param ? new Ncsv(param) : undefined;
    }
    static ni(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ni',
            'defaultRawValue': defaultRawValue,
            'inherit': true
        });
        return param ? new Ni(param) : undefined;
    }
    static nmg(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'nmg',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Nmg(param) : undefined;
    }
    static ntcls(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ntcls',
        });
        return param ? new Ntcls(param) : undefined;
    }
    static ntdis(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ntdis',
        });
        return param ? new Ntdis(param) : undefined;
    }
    static nteid(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'nteid',
        });
        return param ? new Nteid(param) : undefined;
    }
    static ntevt(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ntevt',
        });
        return param ? new Ntevt(param) : undefined;
    }
    static ntlgt(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ntlgt',
        });
        return param ? new Ntlgt(param) : undefined;
    }
    static ntncl(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ntncl',
        });
        return param ? new Ntncl(param) : undefined;
    }
    static ntnei(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ntnei',
        });
        return param ? new Ntnei(param) : undefined;
    }
    static ntnsr(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ntnsr',
        });
        return param ? new Ntnsr(param) : undefined;
    }
    static ntolg(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ntolg',
        });
        return param ? new Ntolg(param) : undefined;
    }
    static ntsrc(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ntsrc',
        });
        return param ? new Ntsrc(param) : undefined;
    }
    static op(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'op',
            'inherit': true,
        });
        return params ? params.map(param => new Op(param)) : undefined;
    }
    static pfm(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pfm',
            'defaultRawValue': defaultRawValue,
        });
        return param ? new Pfm(param) : undefined;
    }
    static pr(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pr',
            'defaultRawValue': defaultRawValue,
            'inherit': true
        });
        return param ? new Pr(param) : undefined;
    }
    static prm(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'prm',
        });
        return param ? new Prm(param) : undefined;
    }
    static pwlf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pwlf',
        });
        return param ? new Pwlf(param) : undefined;
    }
    static pwlt(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pwlt',
        });
        return param ? new Pwlt(param) : undefined;
    }
    static pwrf(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pwrf',
        });
        return param ? new Pwrf(param) : undefined;
    }
    static pwrh(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pwrh',
        });
        return param ? new Pwrh(param) : undefined;
    }
    static pwrn(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pwrn',
        });
        return param ? new Pwrn(param) : undefined;
    }
    static pwrp(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pwrp',
        });
        return param ? new Pwrp(param) : undefined;
    }
    static pwrr(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pwrr',
        });
        return param ? new Pwrr(param) : undefined;
    }
    static pwrw(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'pwrw',
        });
        return param ? new Pwrw(param) : undefined;
    }
    static qm(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'qm',
        });
        return param ? new Qm(param) : undefined;
    }
    static qu(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'qu',
        });
        return param ? new Qu(param) : undefined;
    }
    static rec(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'rec',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Rec(param) : undefined;
    }
    static rei(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'rei',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Rei(param) : undefined;
    }
    static req(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'req',
        });
        return param ? new Req(param) : undefined;
    }
    static rg(unit: UnitEntity, defaultRawValue?: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'rg',
            'defaultRawValue': defaultRawValue,
            'inherit': true
        });
        return param ? new Rg(param) : undefined;
    }
    static rh(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'rh',
        });
        return param ? new Rh(param) : undefined;
    }
    static rje(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'rje',
        });
        return param ? new Rje(param) : undefined;
    }
    static rjs(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'rjs',
        });
        return param ? new Rjs(param) : undefined;
    }
    static sc(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'sc',
        });
        return param ? new Sc(param) : undefined;
    }
    static sd(unit: UnitEntity, defaultRawValue?: string) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'sd',
            'defaultRawValue': defaultRawValue
        });
        return params ? params.map(param => new Sd(param)).sort((a, b) => a.rule - b.rule) : undefined;
    }
    static sdd(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'sdd',
            'defaultRawValue': defaultRawValue,
            'inherit': true,
        });
        return param ? new Sdd(param) : undefined;
    }
    static se(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'se',
        });
        return param ? new Se(param) : undefined;
    }
    static sea(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'sea',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Sea(param) : undefined;
    }
    static sh(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'sh',
        });
        const values = params ? params.map(param => new Sh(param)).sort((a, b) => a.rule - b.rule) : undefined;
        // adjust
        return adjustToSdItemCount(unit.params('sd'), values, () => null);
    }
    static shd(unit: UnitEntity, defaultRawValue: string) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'shd',
            'defaultRawValue': defaultRawValue,
        });
        const values = params ? params.map(param => new Shd(param)).sort((a, b) => a.rule - b.rule) : undefined;
        // adjust
        return adjustToSdItemCount(unit.params('sd'), values, (rule) => new Shd({
            'unit': unit,
            'parameter': 'shd',
            'inherited': false,
            'defaultRawValue': `${rule},${defaultRawValue}`,
            'position': -1,
        }));
    }
    static si(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'si',
        });
        return param ? new Si(param) : undefined;
    }
    static so(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'so',
        });
        return param ? new So(param) : undefined;
    }
    static soa(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'soa',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Soa(param) : undefined;
    }
    static st(unit: UnitEntity, defaultRawValue: string) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'st',
            'defaultRawValue': defaultRawValue,
        });
        const values = params ? params.map(param => new St(param)).sort((a, b) => a.rule - b.rule) : undefined;
        // adjust
        return adjustToSdItemCount(unit.params('sd'), values, (rule) => new St({
            'unit': unit,
            'parameter': 'st',
            'inherited': false,
            'defaultRawValue': `${rule},${defaultRawValue}`,
            'position': -1,
        }));
    }
    static stt(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'stt',
            'inherit': true,
            'defaultRawValue': defaultRawValue
        });
        return param ? new Stt(param) : undefined;
    }
    static sy(unit: UnitEntity) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'sy',
        });
        const values = params ? params.map(param => new Sy(param)).sort((a, b) => a.rule - b.rule) : undefined;
        // adjust
        return adjustToSdItemCount(unit.params('sd'), values, () => null);
    }
    static sz(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'sz',
        });
        return param ? new Sz(param) : undefined;
    }
    static t(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 't',
        });
        return param ? new T(param) : undefined;
    }
    static td1(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'td1',
        });
        return param ? new Td1(param) : undefined;
    }
    static td2(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'td2',
        });
        return param ? new Td2(param) : undefined;
    }
    static td3(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'td3',
        });
        return param ? new Td3(param) : undefined;
    }
    static td4(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'td4',
        });
        return param ? new Td4(param) : undefined;
    }
    static te(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'te',
        });
        return param ? new Te(param) : undefined;
    }
    static tho(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'tho',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Tho(param) : undefined;
    }
    static tmitv(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'tmitv',
        });
        return param ? new Tmitv(param) : undefined;
    }
    static top1(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'top1',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Top1(param) : undefined;
    }
    static top2(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'top2',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Top2(param) : undefined;
    }
    static top3(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'top3',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Top3(param) : undefined;
    }
    static top4(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'top4',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Top4(param) : undefined;
    }
    static ts1(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ts1',
        });
        return param ? new Ts1(param) : undefined;
    }
    static ts2(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ts2',
        });
        return param ? new Ts2(param) : undefined;
    }
    static ts3(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ts3',
        });
        return param ? new Ts3(param) : undefined;
    }
    static ts4(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ts4',
        });
        return param ? new Ts4(param) : undefined;
    }
    static ty(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'ty',
        });
        if (param) {
            return new Ty(param);
        } else {
            throw new Error('Ty parameter should be specified.');
        }
    }
    static uem(unit: UnitEntity, defaultRawValue: string) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'uem',
            'defaultRawValue': defaultRawValue
        });
        return param ? new Uem(param) : undefined;
    }
    static un(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'un',
        });
        return param ? new Un(param) : undefined;
    }
    static unit(unit1: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit1,
            'parameter': 'unit',
        });
        return param ? new Unit(param) : undefined;
    }
    static wc(unit: UnitEntity, defaultRawValue: string) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'wc',
            'defaultRawValue': defaultRawValue
        });
        const values = params ? params.map(param => new Wc(param)).sort((a, b) => a.rule - b.rule) : undefined;
        // adjust
        return adjustToSdItemCount(unit.params('sd'), values, (rule) => new Wc({
            'unit': unit,
            'parameter': 'wc',
            'inherited': false,
            'defaultRawValue': `${rule},${defaultRawValue}`,
            'position': -1,
        }));
    }
    static wkp(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'wkp',
        });
        return param ? new Wkp(param) : undefined;
    }
    static wt(unit: UnitEntity, defaultRawValue: string) {
        const params = this.#checkAndGetArray({
            'unit': unit,
            'parameter': 'wt',
            'defaultRawValue': defaultRawValue
        });
        const values = params ? params.map(param => new Wt(param)).sort((a, b) => a.rule - b.rule) : undefined;
        // adjust
        return adjustToSdItemCount(unit.params('sd'), values, (rule) => new Wt({
            'unit': unit,
            'parameter': 'wt',
            'inherited': false,
            'defaultRawValue': `${rule},${defaultRawValue}`,
            'position': -1,
        }));
    }
    static wth(unit: UnitEntity) {
        const param = this.#checkAndGet({
            'unit': unit,
            'parameter': 'wt',
        });
        return param ? new Wth(param) : undefined;
    }

    /** checkAndGet */
    static #checkAndGet(arg: ParamArg) {
        const params = this.#checkAndGetArray(arg);
        if (params === undefined) {
            return undefined;
        } else if (params.length === 1) {
            return params[0];
        }
        throw new Error(`unexpected array. (${arg.parameter})`);
    }
    /** checkAndArray */
    static #checkAndGetArray(arg: ParamArg) {

        if (!isParams(arg.parameter)) {
            throw new Error(`${arg.parameter} is not unit definition parameter.`);
        }

        // my parameter
        const actualParams = arg.unit.parameters
            .map((v, i) => { return { parameter: v, index: i } })
            .filter((v) => v.parameter.key === arg.parameter)
            .map((v) => {
                return {
                    'unit': arg.unit,
                    'parameter': arg.parameter,
                    'inherited': false,
                    'rawValue': v.parameter.value,
                    'position': v.index,
                };
            });
        if (actualParams.length !== 0) {
            return actualParams;
        }

        // inherited parameter
        if (arg.inherit) {
            let parent = arg.unit.parent;
            while (parent) {
                const parentParams = parent.parameters
                    .map((v, i) => { return { parameter: v, index: i } })
                    .filter((v) => v.parameter.key === arg.parameter)
                    .map((v) => {
                        return {
                            'unit': arg.unit,
                            'parameter': arg.parameter,
                            'inherited': true,
                            'rawValue': v.parameter.value,
                            'position': -1,
                        };
                    });
                if (parentParams.length !== 0) {
                    return parentParams;
                }
                parent = parent.parent;
            }
        }

        // default parameter
        if (Array.isArray(arg.defaultRawValue)) {
            return arg.defaultRawValue.map(v => {
                return {
                    'unit': arg.unit,
                    'parameter': arg.parameter,
                    'inherited': false,
                    'defaultRawValue': v,
                    'position': -1,
                };
            });
        } else if (arg.defaultRawValue) {
            return [{
                'unit': arg.unit,
                'parameter': arg.parameter,
                'inherited': false,
                'defaultRawValue': arg.defaultRawValue,
                'position': -1,
            }];
        }

        // no effective value
        return undefined;
    }
}