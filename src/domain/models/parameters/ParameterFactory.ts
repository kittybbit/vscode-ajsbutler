import {
  Ab,
  Abr,
  Ar,
  Cd,
  Cftd,
  Cgs,
  Cl,
  Cm,
  Cmaif,
  Cmsts,
  Cond,
  Cty,
  Cy,
  Da,
  De,
  Ed,
  Ega,
  Ej,
  Ejc,
  Ejf,
  Ejg,
  Ejh,
  Eji,
  Ejl,
  Ejm,
  Ejn,
  Ejs,
  Ejt,
  Eju,
  Ejv,
  El,
  Env,
  Etm,
  Etn,
  Ets,
  Eu,
  Eun,
  Ev,
  Evdet,
  Evesc,
  Evgid,
  Evgrp,
  Evhst,
  Evipa,
  Evpid,
  Evsfr,
  Evsid,
  Evsms,
  Evspl,
  Evsrc,
  Evsrt,
  Evssv,
  Evtmc,
  Evuid,
  Evusr,
  Evwfr,
  Evwid,
  Evwms,
  Evwsv,
  Ex,
  Ey,
  F,
  Fd,
  Flco,
  Flwc,
  Flwf,
  Flwi,
  Fxg,
  Gty,
  Ha,
  Htcdm,
  Htcfl,
  Htexm,
  Htknd,
  Htrbf,
  Htrhf,
  Htrqf,
  Htrqm,
  Htrqu,
  Htspt,
  Htstf,
  Jc,
  Jd,
  Jdf,
  Jpoif,
  Jty,
  Lfcre,
  Lfdft,
  Lffnm,
  Lfhds,
  Lfmks,
  Lfmxl,
  Lfrft,
  Lfsiv,
  Lfsrc,
  Lftpd,
  Ln,
  Mcs,
  Md,
  Mh,
  Mladr,
  Mlafl,
  Mlatf,
  Mlftx,
  Mllst,
  Mlprf,
  Mlsav,
  Mlsbj,
  Mlsfd,
  Mlstx,
  Mltxt,
  Mm,
  Mp,
  Mqcor,
  Mqdsc,
  Mqeqn,
  Mqhld,
  Mqmdl,
  Mqmdn,
  Mqmfn,
  Mqmgr,
  Mqpgm,
  Mqpri,
  Mqprm,
  Mqque,
  Mqsfn,
  Ms,
  Msapl,
  Mshld,
  Msjnl,
  Mslbl,
  Mslmt,
  Msmod,
  Mspri,
  Msqlb,
  Msqpt,
  Msrer,
  Mssvf,
  Mstfn,
  Msttp,
  Msunr,
  Mu,
  Ncex,
  Nchn,
  Ncl,
  Ncn,
  Ncr,
  Ncs,
  Ncsv,
  Ni,
  Nmg,
  Ntcls,
  Ntdis,
  Nteid,
  Ntevt,
  Ntlgt,
  Ntncl,
  Ntnei,
  Ntnsr,
  Ntolg,
  Ntsrc,
  Op,
  Pfm,
  Pr,
  Prm,
  Pwlf,
  Pwlt,
  Pwrf,
  Pwrh,
  Pwrn,
  Pwrp,
  Pwrr,
  Pwrw,
  Qm,
  Qu,
  Rec,
  Rei,
  Req,
  Rg,
  Rh,
  Rje,
  Rjs,
  Sc,
  Sd,
  Sdd,
  Se,
  Sea,
  Sh,
  Shd,
  Si,
  So,
  Soa,
  St,
  Stt,
  Sy,
  Sz,
  T,
  Td1,
  Td2,
  Td3,
  Td4,
  Te,
  Tho,
  Tmitv,
  Top1,
  Top2,
  Top3,
  Top4,
  Ts1,
  Ts2,
  Ts3,
  Ts4,
  Ty,
  Uem,
  Un,
  Unit,
  Wc,
  Wkp,
  Wt,
  Wth,
} from "../parameters";
import { Cj } from "../units/Cj";
import { J } from "../units/J";
import { N } from "../units/N";
import { UnitEntity } from "../units/UnitEntity";
import { DEFAULTS } from "./Defaults";
import { ParamBase } from "./parameter.types";
import {
  buildDefaultableParameter,
  buildOptionalParameterArray,
  buildOptionalParameter,
  buildRootJobnetParameter,
  buildRootJobnetRuleParameters,
  buildRequiredParameter,
  buildTopParameter,
  buildInheritedParameter,
  buildInheritedParameterArray,
  buildSdAlignedParameters,
  buildSortedRuleParameters,
  resolveParameter,
  resolveParameterArray,
} from "./parameterHelpers";

type ParamArg = ParamBase & {
  inherit?: boolean; // need to get parent value
  defaultRawValue?: string | string[];
};

export class ParamFactory {
  static ab(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ab",
        defaultRawValue: DEFAULTS.Ab,
      },
      (param) => new Ab(param),
    );
  }
  static abr(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "abr",
        defaultRawValue: DEFAULTS.Abr,
      },
      (param) => new Abr(param),
    );
  }
  static ar(unit: UnitEntity) {
    return buildOptionalParameterArray(
      {
        unit: unit,
        parameter: "ar",
      },
      (param) => new Ar(param),
    );
  }
  static cd(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "cd",
        defaultRawValue: DEFAULTS.Cd,
      },
      (param) => new Cd(param),
    );
  }
  static cftd(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "cftd",
      defaultRawValue: DEFAULTS.Cftd,
    });
    return buildSdAlignedParameters(
      params,
      unit.params("sd"),
      (param) => new Cftd(param),
      (rule) =>
        new Cftd({
          unit: unit,
          parameter: "cftd",
          inherited: false,
          defaultRawValue: `${rule},${DEFAULTS.Cftd}`,
          position: -1,
        }),
    );
  }
  static cgs(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "cgs",
        defaultRawValue: DEFAULTS.Cgs,
      },
      (param) => new Cgs(param),
    );
  }
  static cl(unit: UnitEntity) {
    return buildInheritedParameterArray(
      {
        unit: unit,
        parameter: "cl",
      },
      (param) => new Cl(param),
    );
  }
  static cm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "cm",
      },
      (param) => new Cm(param),
    );
  }
  static cmaif(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "cmaif",
      },
      (param) => new Cmaif(param),
    );
  }
  static cmsts(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "cmsts",
      },
      (param) => new Cmsts(param),
    );
  }
  static cond(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "cond",
        defaultRawValue: DEFAULTS.Cond,
      },
      (param) => new Cond(param),
    );
  }
  static cty(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "cty",
      },
      (param) => new Cty(param),
    );
  }
  static cy(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "cy",
    });
    return buildSdAlignedParameters(
      params,
      unit.params("sd"),
      (param) => new Cy(param),
      (rule) =>
        new Cy({
          unit: unit,
          parameter: "cy",
          rawValue: rule + ",",
          inherited: false,
          position: -1,
        }),
    );
  }
  static da(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "da",
      },
      (param) => new Da(param),
    );
  }
  static de(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "de",
        defaultRawValue: DEFAULTS.De,
      },
      (param) => new De(param),
    );
  }
  static ed(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ed",
      },
      (param) => new Ed(param),
    );
  }
  static ega(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ega",
        defaultRawValue: DEFAULTS.Ega,
      },
      (param) => new Ega(param),
    );
  }
  static ej(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ej",
        defaultRawValue: DEFAULTS.Ej,
      },
      (param) => new Ej(param),
    );
  }
  static ejc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejc",
        defaultRawValue: DEFAULTS.Ejc,
      },
      (param) => new Ejc(param),
    );
  }
  static ejf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejf",
      },
      (param) => new Ejf(param),
    );
  }
  static ejg(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejg",
      },
      (param) => new Ejg(param),
    );
  }
  static ejh(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejh",
      },
      (param) => new Ejh(param),
    );
  }
  static eji(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "eji",
        defaultRawValue: DEFAULTS.Eji,
      },
      (param) => new Eji(param),
    );
  }
  static ejl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejl",
      },
      (param) => new Ejl(param),
    );
  }
  static ejm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejm",
        defaultRawValue: DEFAULTS.Ejm,
      },
      (param) => new Ejm(param),
    );
  }
  static ejn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejn",
      },
      (param) => new Ejn(param),
    );
  }
  static ejs(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejs",
      },
      (param) => new Ejs(param),
    );
  }
  static ejt(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejt",
      },
      (param) => new Ejt(param),
    );
  }
  static eju(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "eju",
        defaultRawValue: DEFAULTS.Eju,
      },
      (param) => new Eju(param),
    );
  }
  static ejv(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ejv",
      },
      (param) => new Ejv(param),
    );
  }
  static el(unit: UnitEntity) {
    return buildOptionalParameterArray(
      {
        unit: unit,
        parameter: "el",
      },
      (param) => new El(param),
    );
  }
  static env(unit: UnitEntity) {
    return buildOptionalParameterArray(
      {
        unit: unit,
        parameter: "env",
      },
      (param) => new Env(param),
    );
  }
  static etm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "etm",
      },
      (param) => new Etm(param),
    );
  }
  static etn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "etn",
        defaultRawValue: DEFAULTS.Etn,
      },
      (param) => new Etn(param),
    );
  }
  static ets(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ets",
        defaultRawValue: DEFAULTS.Ets,
      },
      (param) => new Ets(param),
    );
  }
  static eu(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "eu",
        defaultRawValue: DEFAULTS.Eu,
      },
      (param) => new Eu(param),
    );
  }
  static eun(unit: UnitEntity) {
    return buildOptionalParameterArray(
      {
        unit: unit,
        parameter: "eun",
      },
      (param) => new Eun(param),
    );
  }
  static ev(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ev",
      },
      (param) => new Ev(param),
    );
  }
  static evdet(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evdet",
      },
      (param) => new Evdet(param),
    );
  }
  static evesc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evesc",
        defaultRawValue: DEFAULTS.Evesc,
      },
      (param) => new Evesc(param),
    );
  }
  static evgid(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evgid",
      },
      (param) => new Evgid(param),
    );
  }
  static evgrp(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evgrp",
      },
      (param) => new Evgrp(param),
    );
  }
  static evhst(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evhst",
      },
      (param) => new Evhst(param),
    );
  }
  static evipa(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evipa",
      },
      (param) => new Evipa(param),
    );
  }
  static evpid(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evpid",
      },
      (param) => new Evpid(param),
    );
  }
  static evsfr(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evsfr",
      },
      (param) => new Evsfr(param),
    );
  }
  static evsid(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evsid",
      },
      (param) => new Evsid(param),
    );
  }
  static evsms(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evsms",
      },
      (param) => new Evsms(param),
    );
  }
  static evspl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evspl",
        defaultRawValue: DEFAULTS.Evspl,
      },
      (param) => new Evspl(param),
    );
  }
  static evsrc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evsrc",
        defaultRawValue: DEFAULTS.Evsrc,
      },
      (param) => new Evsrc(param),
    );
  }
  static evsrt(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evsrt",
        defaultRawValue: DEFAULTS.Evsrt,
      },
      (param) => new Evsrt(param),
    );
  }
  static evssv(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evssv",
        defaultRawValue: DEFAULTS.Evssv,
      },
      (param) => new Evssv(param),
    );
  }
  static evtmc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evtmc",
        defaultRawValue: DEFAULTS.Evtmc,
      },
      (param) => new Evtmc(param),
    );
  }
  static evuid(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evuid",
      },
      (param) => new Evuid(param),
    );
  }
  static evusr(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evusr",
      },
      (param) => new Evusr(param),
    );
  }
  static evwfr(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evwfr",
      },
      (param) => new Evwfr(param),
    );
  }
  static evwid(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evwid",
      },
      (param) => new Evwid(param),
    );
  }
  static evwms(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evwms",
      },
      (param) => new Evwms(param),
    );
  }
  static evwsv(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "evwsv",
      },
      (param) => new Evwsv(param),
    );
  }
  static ex(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ex",
      },
      (param) => new Ex(param),
    );
  }
  static ey(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "ey",
    });
    return buildSdAlignedParameters(
      params,
      unit.params("sd"),
      (param) => new Ey(param),
      (rule) =>
        new Ey({
          unit: unit,
          parameter: "ey",
          rawValue: rule + ",",
          inherited: false,
          position: -1,
        }),
    );
  }
  static f(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "f",
      },
      (param) => new F(param),
    );
  }
  static fd(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "fd",
      },
      (param) => new Fd(param),
    );
  }
  static flco(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "flco",
        defaultRawValue: DEFAULTS.Flco,
      },
      (param) => new Flco(param),
    );
  }
  static flwc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "flwc",
        defaultRawValue: DEFAULTS.Flwc,
      },
      (param) => new Flwc(param),
    );
  }
  static flwf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "flwf",
      },
      (param) => new Flwf(param),
    );
  }
  static flwi(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "flwi",
        defaultRawValue: DEFAULTS.Flwi,
      },
      (param) => new Flwi(param),
    );
  }
  static fxg(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "fxg",
        defaultRawValue: DEFAULTS.Fxg,
      },
      (param) => new Fxg(param),
    );
  }
  static gty(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "gty",
        defaultRawValue: DEFAULTS.Gty,
      },
      (param) => new Gty(param),
    );
  }
  static ha(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ha",
        defaultRawValue: DEFAULTS.Ha,
      },
      (param) => new Ha(param),
    );
  }
  static htcdm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htcdm",
      },
      (param) => new Htcdm(param),
    );
  }
  static htcfl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htcfl",
      },
      (param) => new Htcfl(param),
    );
  }
  static htexm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htexm",
        defaultRawValue: DEFAULTS.Htexm,
      },
      (param) => new Htexm(param),
    );
  }
  static htknd(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htknd",
        defaultRawValue: DEFAULTS.Htknd,
      },
      (param) => new Htknd(param),
    );
  }
  static htrbf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htrbf",
      },
      (param) => new Htrbf(param),
    );
  }
  static htrhf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htrhf",
      },
      (param) => new Htrhf(param),
    );
  }
  static htrqf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htrqf",
      },
      (param) => new Htrqf(param),
    );
  }
  static htrqm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htrqm",
      },
      (param) => new Htrqm(param),
    );
  }
  static htrqu(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htrqu",
      },
      (param) => new Htrqu(param),
    );
  }
  static htspt(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htspt",
        defaultRawValue: DEFAULTS.Htspt,
      },
      (param) => new Htspt(param),
    );
  }
  static htstf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "htstf",
      },
      (param) => new Htstf(param),
    );
  }
  static jc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "jc",
      },
      (param) => new Jc(param),
    );
  }
  static jd(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "jd",
        defaultRawValue: DEFAULTS.Jd,
      },
      (param) => new Jd(param),
    );
  }
  static jdf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "jdf",
      },
      (param) => new Jdf(param),
    );
  }
  static jpoif(unit: UnitEntity) {
    return buildOptionalParameterArray(
      {
        unit: unit,
        parameter: "jpoif",
      },
      (param) => new Jpoif(param),
    );
  }
  static jty(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "jty",
        defaultRawValue: DEFAULTS.Jty,
      },
      (param) => new Jty(param),
    );
  }
  static lfcre(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lfcre",
      },
      (param) => new Lfcre(param),
    );
  }
  static lfdft(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lfdft",
      },
      (param) => new Lfdft(param),
    );
  }
  static lffnm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lffnm",
      },
      (param) => new Lffnm(param),
    );
  }
  static lfhds(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lfhds",
      },
      (param) => new Lfhds(param),
    );
  }
  static lfmks(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lfmks",
      },
      (param) => new Lfmks(param),
    );
  }
  static lfmxl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lfmxl",
      },
      (param) => new Lfmxl(param),
    );
  }
  static lfrft(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lfrft",
      },
      (param) => new Lfrft(param),
    );
  }
  static lfsiv(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lfsiv",
      },
      (param) => new Lfsiv(param),
    );
  }
  static lfsrc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lfsrc",
      },
      (param) => new Lfsrc(param),
    );
  }
  static lftpd(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "lftpd",
      },
      (param) => new Lftpd(param),
    );
  }
  static ln(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "ln",
    });
    return buildSortedRuleParameters(params, (param) => new Ln(param));
  }
  static mcs(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mcs",
        defaultRawValue: DEFAULTS.Mcs,
      },
      (param) => new Mcs(param),
    );
  }
  static md(unit: UnitEntity) {
    return buildInheritedParameter(
      {
        unit: unit,
        parameter: "md",
        defaultRawValue: DEFAULTS.Md,
      },
      (param) => new Md(param),
    );
  }
  static mh(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mh",
      },
      (param) => new Mh(param),
    );
  }
  static mladr(unit: UnitEntity) {
    return buildOptionalParameterArray(
      {
        unit: unit,
        parameter: "mladr",
      },
      (param) => new Mladr(param),
    );
  }
  static mlafl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mlafl",
      },
      (param) => new Mlafl(param),
    );
  }
  static mlatf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mlatf",
      },
      (param) => new Mlatf(param),
    );
  }
  static mlftx(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mlftx",
      },
      (param) => new Mlftx(param),
    );
  }
  static mllst(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mllst",
      },
      (param) => new Mllst(param),
    );
  }
  static mlprf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mlprf",
      },
      (param) => new Mlprf(param),
    );
  }
  static mlsav(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mlsav",
        defaultRawValue: DEFAULTS.Mlsav,
      },
      (param) => new Mlsav(param),
    );
  }
  static mlsbj(unit: UnitEntity) {
    return buildOptionalParameterArray(
      {
        unit: unit,
        parameter: "mlsbj",
      },
      (param) => new Mlsbj(param),
    );
  }
  static mlsfd(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mlsfd",
      },
      (param) => new Mlsfd(param),
    );
  }
  static mlstx(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mlstx",
      },
      (param) => new Mlstx(param),
    );
  }
  static mltxt(unit: UnitEntity) {
    return buildOptionalParameterArray(
      {
        unit: unit,
        parameter: "mltxt",
      },
      (param) => new Mltxt(param),
    );
  }
  static mm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mm",
        defaultRawValue: DEFAULTS.Mm,
      },
      (param) => new Mm(param),
    );
  }
  static mp(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mp",
        defaultRawValue: DEFAULTS.Mp,
      },
      (param) => new Mp(param),
    );
  }
  static mqcor(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqcor",
      },
      (param) => new Mqcor(param),
    );
  }
  static mqdsc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqdsc",
      },
      (param) => new Mqdsc(param),
    );
  }
  static mqeqn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqeqn",
      },
      (param) => new Mqeqn(param),
    );
  }
  static mqhld(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqhld",
      },
      (param) => new Mqhld(param),
    );
  }
  static mqmdl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqmdl",
      },
      (param) => new Mqmdl(param),
    );
  }
  static mqmdn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqmdn",
      },
      (param) => new Mqmdn(param),
    );
  }
  static mqmfn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqmfn",
      },
      (param) => new Mqmfn(param),
    );
  }
  static mqmgr(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqmgr",
      },
      (param) => new Mqmgr(param),
    );
  }
  static mqpgm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqpgm",
      },
      (param) => new Mqpgm(param),
    );
  }
  static mqpri(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqpri",
      },
      (param) => new Mqpri(param),
    );
  }
  static mqprm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqprm",
      },
      (param) => new Mqprm(param),
    );
  }
  static mqque(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqque",
      },
      (param) => new Mqque(param),
    );
  }
  static mqsfn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mqsfn",
      },
      (param) => new Mqsfn(param),
    );
  }
  static ms(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ms",
        defaultRawValue: DEFAULTS.Ms,
      },
      (param) => new Ms(param),
    );
  }
  static msapl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "msapl",
      },
      (param) => new Msapl(param),
    );
  }
  static mshld(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mshld",
      },
      (param) => new Mshld(param),
    );
  }
  static msjnl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "msjnl",
      },
      (param) => new Msjnl(param),
    );
  }
  static mslbl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mslbl",
      },
      (param) => new Mslbl(param),
    );
  }
  static mslmt(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mslmt",
      },
      (param) => new Mslmt(param),
    );
  }
  static msmod(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "msmod",
      },
      (param) => new Msmod(param),
    );
  }
  static mspri(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mspri",
      },
      (param) => new Mspri(param),
    );
  }
  static msqlb(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "msqlb",
      },
      (param) => new Msqlb(param),
    );
  }
  static msqpt(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "msqpt",
      },
      (param) => new Msqpt(param),
    );
  }
  static msrer(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "msrer",
      },
      (param) => new Msrer(param),
    );
  }
  static mssvf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mssvf",
      },
      (param) => new Mssvf(param),
    );
  }
  static mstfn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mstfn",
      },
      (param) => new Mstfn(param),
    );
  }
  static msttp(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "msttp",
      },
      (param) => new Msttp(param),
    );
  }
  static msunr(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "msunr",
      },
      (param) => new Msunr(param),
    );
  }
  static mu(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "mu",
      },
      (param) => new Mu(param),
    );
  }
  static ncex(unit: UnitEntity, defaultRawValue?: string) {
    return buildDefaultableParameter(
      {
        unit: unit,
        parameter: "ncex",
        defaultRawValue: defaultRawValue,
      },
      (param) => new Ncex(param),
    );
  }
  static nchn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "nchn",
      },
      (param) => new Nchn(param),
    );
  }
  static ncl(unit: UnitEntity, defaultRawValue?: string) {
    return buildDefaultableParameter(
      {
        unit: unit,
        parameter: "ncl",
        defaultRawValue: defaultRawValue,
      },
      (param) => new Ncl(param),
    );
  }
  static ncn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ncn",
      },
      (param) => new Ncn(param),
    );
  }
  static ncr(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ncr",
      },
      (param) => new Ncr(param),
    );
  }
  static ncs(unit: UnitEntity, defaultRawValue?: string) {
    return buildDefaultableParameter(
      {
        unit: unit,
        parameter: "ncs",
        defaultRawValue: defaultRawValue,
      },
      (param) => new Ncs(param),
    );
  }
  static ncsv(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ncsv",
      },
      (param) => new Ncsv(param),
    );
  }
  static ni(unit: UnitEntity) {
    return buildInheritedParameter(
      {
        unit: unit,
        parameter: "ni",
        defaultRawValue: DEFAULTS.Ni,
      },
      (param) => new Ni(param),
    );
  }
  static nmg(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "nmg",
        defaultRawValue: DEFAULTS.Nmg,
      },
      (param) => new Nmg(param),
    );
  }
  static ntcls(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ntcls",
      },
      (param) => new Ntcls(param),
    );
  }
  static ntdis(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ntdis",
      },
      (param) => new Ntdis(param),
    );
  }
  static nteid(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "nteid",
      },
      (param) => new Nteid(param),
    );
  }
  static ntevt(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ntevt",
      },
      (param) => new Ntevt(param),
    );
  }
  static ntlgt(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ntlgt",
      },
      (param) => new Ntlgt(param),
    );
  }
  static ntncl(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ntncl",
      },
      (param) => new Ntncl(param),
    );
  }
  static ntnei(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ntnei",
      },
      (param) => new Ntnei(param),
    );
  }
  static ntnsr(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ntnsr",
      },
      (param) => new Ntnsr(param),
    );
  }
  static ntolg(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ntolg",
      },
      (param) => new Ntolg(param),
    );
  }
  static ntsrc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ntsrc",
      },
      (param) => new Ntsrc(param),
    );
  }
  static op(unit: UnitEntity) {
    return buildInheritedParameterArray(
      {
        unit: unit,
        parameter: "op",
      },
      (param) => new Op(param),
    );
  }
  static pfm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "pfm",
        defaultRawValue: DEFAULTS.Pfm,
      },
      (param) => new Pfm(param),
    );
  }
  static pr(unit: UnitEntity) {
    return buildInheritedParameter(
      {
        unit: unit,
        parameter: "pr",
        defaultRawValue: DEFAULTS.Pr,
      },
      (param) => new Pr(param),
    );
  }
  static prm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "prm",
      },
      (param) => new Prm(param),
    );
  }
  static pwlf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "pwlf",
      },
      (param) => new Pwlf(param),
    );
  }
  static pwlt(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "pwlt",
      },
      (param) => new Pwlt(param),
    );
  }
  static pwrf(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "pwrf",
      },
      (param) => new Pwrf(param),
    );
  }
  static pwrh(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "pwrh",
      },
      (param) => new Pwrh(param),
    );
  }
  static pwrn(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "pwrn",
      },
      (param) => new Pwrn(param),
    );
  }
  static pwrp(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "pwrp",
      },
      (param) => new Pwrp(param),
    );
  }
  static pwrr(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "pwrr",
      },
      (param) => new Pwrr(param),
    );
  }
  static pwrw(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "pwrw",
      },
      (param) => new Pwrw(param),
    );
  }
  static qm(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "qm",
      },
      (param) => new Qm(param),
    );
  }
  static qu(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "qu",
      },
      (param) => new Qu(param),
    );
  }
  static rec(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "rec",
        defaultRawValue: DEFAULTS.Rec,
      },
      (param) => new Rec(param),
    );
  }
  static rei(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "rei",
        defaultRawValue: DEFAULTS.Rei,
      },
      (param) => new Rei(param),
    );
  }
  static req(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "req",
      },
      (param) => new Req(param),
    );
  }
  static rg(unit: N) {
    return buildRootJobnetParameter(
      {
        unit: unit,
        parameter: "rg",
        isRootJobnet: unit.isRootJobnet,
        rootDefaultParameter: "rg",
      },
      (param) => new Rg(param),
    );
  }
  static rh(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "rh",
      },
      (param) => new Rh(param),
    );
  }
  static rje(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "rje",
      },
      (param) => new Rje(param),
    );
  }
  static rjs(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "rjs",
      },
      (param) => new Rjs(param),
    );
  }
  static sc(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "sc",
      },
      (param) => new Sc(param),
    );
  }
  static sd(unit: N) {
    return buildRootJobnetRuleParameters(
      {
        unit: unit,
        parameter: "sd",
        isRootJobnet: unit.isRootJobnet,
        rootDefaultParameter: "sd",
      },
      (param) => new Sd(param),
    );
  }
  static sdd(unit: UnitEntity) {
    return buildInheritedParameter(
      {
        unit: unit,
        parameter: "sdd",
        defaultRawValue: DEFAULTS.Sdd,
      },
      (param) => new Sdd(param),
    );
  }
  static se(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "se",
      },
      (param) => new Se(param),
    );
  }
  static sea(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "sea",
        defaultRawValue: DEFAULTS.Sea,
      },
      (param) => new Sea(param),
    );
  }
  static sh(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "sh",
    });
    return buildSdAlignedParameters(
      params,
      unit.params("sd"),
      (param) => new Sh(param),
      (rule) =>
        new Sh({
          unit: unit,
          parameter: "sh",
          rawValue: rule + ",",
          inherited: false,
          position: -1,
        }),
    );
  }
  static shd(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "shd",
      defaultRawValue: DEFAULTS.Shd,
    });
    return buildSdAlignedParameters(
      params,
      unit.params("sd"),
      (param) => new Shd(param),
      (rule) =>
        new Shd({
          unit: unit,
          parameter: "shd",
          inherited: false,
          defaultRawValue: `${rule},${DEFAULTS.Shd}`,
          position: -1,
        }),
    );
  }
  static si(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "si",
      },
      (param) => new Si(param),
    );
  }
  static so(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "so",
      },
      (param) => new So(param),
    );
  }
  static soa(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "soa",
        defaultRawValue: DEFAULTS.Soa,
      },
      (param) => new Soa(param),
    );
  }
  static st(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "st",
      defaultRawValue: DEFAULTS.St,
    });
    return buildSdAlignedParameters(
      params,
      unit.params("sd"),
      (param) => new St(param),
      (rule) =>
        new St({
          unit: unit,
          parameter: "st",
          inherited: false,
          defaultRawValue: `${rule},${DEFAULTS.St}`,
          position: -1,
        }),
    );
  }
  static stt(unit: UnitEntity) {
    return buildInheritedParameter(
      {
        unit: unit,
        parameter: "stt",
        defaultRawValue: DEFAULTS.Stt,
      },
      (param) => new Stt(param),
    );
  }
  static sy(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "sy",
    });
    return buildSdAlignedParameters(
      params,
      unit.params("sd"),
      (param) => new Sy(param),
      (rule) =>
        new Sy({
          unit: unit,
          parameter: "sy",
          rawValue: rule + ",",
          inherited: false,
          position: -1,
        }),
    );
  }
  static sz(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "sz",
      },
      (param) => new Sz(param),
    );
  }
  static t(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "t",
      },
      (param) => new T(param),
    );
  }
  static td1(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "td1",
      },
      (param) => new Td1(param),
    );
  }
  static td2(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "td2",
      },
      (param) => new Td2(param),
    );
  }
  static td3(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "td3",
      },
      (param) => new Td3(param),
    );
  }
  static td4(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "td4",
      },
      (param) => new Td4(param),
    );
  }
  static te(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "te",
      },
      (param) => new Te(param),
    );
  }
  static tho(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "tho",
        defaultRawValue: DEFAULTS.Tho,
      },
      (param) => new Tho(param),
    );
  }
  static tmitv(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "tmitv",
      },
      (param) => new Tmitv(param),
    );
  }
  static top1(unit: J | Cj) {
    return buildTopParameter(
      {
        unit: unit,
        parameter: "top1",
        index: 1,
      },
      (param) => new Top1(param),
    );
  }
  static top2(unit: J | Cj) {
    return buildTopParameter(
      {
        unit: unit,
        parameter: "top2",
        index: 2,
      },
      (param) => new Top2(param),
    );
  }
  static top3(unit: J | Cj) {
    return buildTopParameter(
      {
        unit: unit,
        parameter: "top3",
        index: 3,
      },
      (param) => new Top3(param),
    );
  }
  static top4(unit: J | Cj) {
    return buildTopParameter(
      {
        unit: unit,
        parameter: "top4",
        index: 4,
      },
      (param) => new Top4(param),
    );
  }
  static ts1(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ts1",
      },
      (param) => new Ts1(param),
    );
  }
  static ts2(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ts2",
      },
      (param) => new Ts2(param),
    );
  }
  static ts3(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ts3",
      },
      (param) => new Ts3(param),
    );
  }
  static ts4(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "ts4",
      },
      (param) => new Ts4(param),
    );
  }
  static ty(unit: UnitEntity) {
    return buildRequiredParameter(
      {
        unit: unit,
        parameter: "ty",
      },
      (param) => new Ty(param),
      () => "Ty parameter should be specified.",
    );
  }
  static uem(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "uem",
        defaultRawValue: DEFAULTS.Uem,
      },
      (param) => new Uem(param),
    );
  }
  static un(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "un",
      },
      (param) => new Un(param),
    );
  }
  static unit(unit1: UnitEntity) {
    const param = this.#checkAndGet({
      unit: unit1,
      parameter: "unit",
    });
    return param ? new Unit(param) : undefined;
  }
  static wc(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "wc",
      defaultRawValue: DEFAULTS.Wc,
    });
    return buildSdAlignedParameters(
      params,
      unit.params("sd"),
      (param) => new Wc(param),
      (rule) =>
        new Wc({
          unit: unit,
          parameter: "wc",
          inherited: false,
          defaultRawValue: `${rule},${DEFAULTS.Wc}`,
          position: -1,
        }),
    );
  }
  static wkp(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "wkp",
      },
      (param) => new Wkp(param),
    );
  }
  static wt(unit: UnitEntity) {
    const params = this.#checkAndGetArray({
      unit: unit,
      parameter: "wt",
      defaultRawValue: DEFAULTS.Wt,
    });
    return buildSdAlignedParameters(
      params,
      unit.params("sd"),
      (param) => new Wt(param),
      (rule) =>
        new Wt({
          unit: unit,
          parameter: "wt",
          inherited: false,
          defaultRawValue: `${rule},${DEFAULTS.Wt}`,
          position: -1,
        }),
    );
  }
  static wth(unit: UnitEntity) {
    return buildOptionalParameter(
      {
        unit: unit,
        parameter: "wt",
      },
      (param) => new Wth(param),
    );
  }

  /** checkAndGet */
  static #checkAndGet(arg: ParamArg) {
    return resolveParameter(arg);
  }
  /** checkAndArray */
  static #checkAndGetArray(arg: ParamArg) {
    return resolveParameterArray(arg);
  }
}
