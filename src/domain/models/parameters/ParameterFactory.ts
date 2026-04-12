import {
  Cftd,
  Cy,
  Ey,
  Ln,
  Ncex,
  Ncl,
  Ncs,
  Rg,
  Sd,
  Sh,
  Shd,
  St,
  Sy,
  Top1,
  Top2,
  Top3,
  Top4,
  Ty,
  Wc,
  Wt,
} from "../parameters";
import { Cj } from "../units/Cj";
import { J } from "../units/J";
import { N } from "../units/N";
import { UnitEntity } from "../units/UnitEntity";
import { DEFAULTS } from "./Defaults";
import { inheritedParameterBuilders } from "./inheritedParameterBuilders";
import { optionalArrayParameterBuilders } from "./optionalArrayParameterBuilders";
import { optionalScalarParameterBuilders } from "./optionalScalarParameterBuilders";
import {
  buildSdAlignedDefaultRuleParameters,
  buildSdAlignedEmptyRuleParameters,
  buildDefaultableParameter,
  buildRootJobnetParameter,
  buildRootJobnetRuleParameters,
  buildRequiredParameter,
  buildTopParameter,
  buildSortedRuleParameters,
  resolveParameterArray,
} from "./parameterHelpers";

export class ParamFactory {
  static ab = optionalScalarParameterBuilders.ab;
  static abr = optionalScalarParameterBuilders.abr;
  static ar = optionalArrayParameterBuilders.ar;
  static cd = optionalScalarParameterBuilders.cd;
  static cftd(unit: UnitEntity) {
    return buildSdAlignedDefaultRuleParameters(
      {
        unit: unit,
        parameter: "cftd",
        defaultRawValue: DEFAULTS.Cftd,
        buildFallbackRawValue: (rule) => `${rule},${DEFAULTS.Cftd}`,
      },
      (param) => new Cftd(param),
    );
  }
  static cgs = optionalScalarParameterBuilders.cgs;
  static cl = inheritedParameterBuilders.cl;
  static cm = optionalScalarParameterBuilders.cm;
  static cmaif = optionalScalarParameterBuilders.cmaif;
  static cmsts = optionalScalarParameterBuilders.cmsts;
  static cond = optionalScalarParameterBuilders.cond;
  static cty = optionalScalarParameterBuilders.cty;
  static cy(unit: UnitEntity) {
    return buildSdAlignedEmptyRuleParameters(
      {
        unit: unit,
        parameter: "cy",
      },
      (param) => new Cy(param),
    );
  }
  static da = optionalScalarParameterBuilders.da;
  static de = optionalScalarParameterBuilders.de;
  static ed = optionalScalarParameterBuilders.ed;
  static ega = optionalScalarParameterBuilders.ega;
  static ej = optionalScalarParameterBuilders.ej;
  static ejc = optionalScalarParameterBuilders.ejc;
  static ejf = optionalScalarParameterBuilders.ejf;
  static ejg = optionalScalarParameterBuilders.ejg;
  static ejh = optionalScalarParameterBuilders.ejh;
  static eji = optionalScalarParameterBuilders.eji;
  static ejl = optionalScalarParameterBuilders.ejl;
  static ejm = optionalScalarParameterBuilders.ejm;
  static ejn = optionalScalarParameterBuilders.ejn;
  static ejs = optionalScalarParameterBuilders.ejs;
  static ejt = optionalScalarParameterBuilders.ejt;
  static eju = optionalScalarParameterBuilders.eju;
  static ejv = optionalScalarParameterBuilders.ejv;
  static el = optionalArrayParameterBuilders.el;
  static env = optionalArrayParameterBuilders.env;
  static etm = optionalScalarParameterBuilders.etm;
  static etn = optionalScalarParameterBuilders.etn;
  static ets = optionalScalarParameterBuilders.ets;
  static eu = optionalScalarParameterBuilders.eu;
  static eun = optionalArrayParameterBuilders.eun;
  static ev = optionalScalarParameterBuilders.ev;
  static evdet = optionalScalarParameterBuilders.evdet;
  static evesc = optionalScalarParameterBuilders.evesc;
  static evgid = optionalScalarParameterBuilders.evgid;
  static evgrp = optionalScalarParameterBuilders.evgrp;
  static evhst = optionalScalarParameterBuilders.evhst;
  static evipa = optionalScalarParameterBuilders.evipa;
  static evpid = optionalScalarParameterBuilders.evpid;
  static evsfr = optionalScalarParameterBuilders.evsfr;
  static evsid = optionalScalarParameterBuilders.evsid;
  static evsms = optionalScalarParameterBuilders.evsms;
  static evspl = optionalScalarParameterBuilders.evspl;
  static evsrc = optionalScalarParameterBuilders.evsrc;
  static evsrt = optionalScalarParameterBuilders.evsrt;
  static evssv = optionalScalarParameterBuilders.evssv;
  static evtmc = optionalScalarParameterBuilders.evtmc;
  static evuid = optionalScalarParameterBuilders.evuid;
  static evusr = optionalScalarParameterBuilders.evusr;
  static evwfr = optionalScalarParameterBuilders.evwfr;
  static evwid = optionalScalarParameterBuilders.evwid;
  static evwms = optionalScalarParameterBuilders.evwms;
  static evwsv = optionalScalarParameterBuilders.evwsv;
  static ex = optionalScalarParameterBuilders.ex;
  static ey(unit: UnitEntity) {
    return buildSdAlignedEmptyRuleParameters(
      {
        unit: unit,
        parameter: "ey",
      },
      (param) => new Ey(param),
    );
  }
  static f = optionalScalarParameterBuilders.f;
  static fd = optionalScalarParameterBuilders.fd;
  static flco = optionalScalarParameterBuilders.flco;
  static flwc = optionalScalarParameterBuilders.flwc;
  static flwf = optionalScalarParameterBuilders.flwf;
  static flwi = optionalScalarParameterBuilders.flwi;
  static fxg = optionalScalarParameterBuilders.fxg;
  static gty = optionalScalarParameterBuilders.gty;
  static ha = optionalScalarParameterBuilders.ha;
  static htcdm = optionalScalarParameterBuilders.htcdm;
  static htcfl = optionalScalarParameterBuilders.htcfl;
  static htexm = optionalScalarParameterBuilders.htexm;
  static htknd = optionalScalarParameterBuilders.htknd;
  static htrbf = optionalScalarParameterBuilders.htrbf;
  static htrhf = optionalScalarParameterBuilders.htrhf;
  static htrqf = optionalScalarParameterBuilders.htrqf;
  static htrqm = optionalScalarParameterBuilders.htrqm;
  static htrqu = optionalScalarParameterBuilders.htrqu;
  static htspt = optionalScalarParameterBuilders.htspt;
  static htstf = optionalScalarParameterBuilders.htstf;
  static jc = optionalScalarParameterBuilders.jc;
  static jd = optionalScalarParameterBuilders.jd;
  static jdf = optionalScalarParameterBuilders.jdf;
  static jpoif = optionalArrayParameterBuilders.jpoif;
  static jty = optionalScalarParameterBuilders.jty;
  static lfcre = optionalScalarParameterBuilders.lfcre;
  static lfdft = optionalScalarParameterBuilders.lfdft;
  static lffnm = optionalScalarParameterBuilders.lffnm;
  static lfhds = optionalScalarParameterBuilders.lfhds;
  static lfmks = optionalScalarParameterBuilders.lfmks;
  static lfmxl = optionalScalarParameterBuilders.lfmxl;
  static lfrft = optionalScalarParameterBuilders.lfrft;
  static lfsiv = optionalScalarParameterBuilders.lfsiv;
  static lfsrc = optionalScalarParameterBuilders.lfsrc;
  static lftpd = optionalScalarParameterBuilders.lftpd;
  static ln(unit: UnitEntity) {
    return buildSortedRuleParameters(
      resolveParameterArray({
        unit: unit,
        parameter: "ln",
      }),
      (param) => new Ln(param),
    );
  }
  static mcs = optionalScalarParameterBuilders.mcs;
  static md = inheritedParameterBuilders.md;
  static mh = optionalScalarParameterBuilders.mh;
  static mladr = optionalArrayParameterBuilders.mladr;
  static mlafl = optionalScalarParameterBuilders.mlafl;
  static mlatf = optionalScalarParameterBuilders.mlatf;
  static mlftx = optionalScalarParameterBuilders.mlftx;
  static mllst = optionalScalarParameterBuilders.mllst;
  static mlprf = optionalScalarParameterBuilders.mlprf;
  static mlsav = optionalScalarParameterBuilders.mlsav;
  static mlsbj = optionalArrayParameterBuilders.mlsbj;
  static mlsfd = optionalScalarParameterBuilders.mlsfd;
  static mlstx = optionalScalarParameterBuilders.mlstx;
  static mltxt = optionalArrayParameterBuilders.mltxt;
  static mm = optionalScalarParameterBuilders.mm;
  static mp = optionalScalarParameterBuilders.mp;
  static mqcor = optionalScalarParameterBuilders.mqcor;
  static mqdsc = optionalScalarParameterBuilders.mqdsc;
  static mqeqn = optionalScalarParameterBuilders.mqeqn;
  static mqhld = optionalScalarParameterBuilders.mqhld;
  static mqmdl = optionalScalarParameterBuilders.mqmdl;
  static mqmdn = optionalScalarParameterBuilders.mqmdn;
  static mqmfn = optionalScalarParameterBuilders.mqmfn;
  static mqmgr = optionalScalarParameterBuilders.mqmgr;
  static mqpgm = optionalScalarParameterBuilders.mqpgm;
  static mqpri = optionalScalarParameterBuilders.mqpri;
  static mqprm = optionalScalarParameterBuilders.mqprm;
  static mqque = optionalScalarParameterBuilders.mqque;
  static mqsfn = optionalScalarParameterBuilders.mqsfn;
  static ms = optionalScalarParameterBuilders.ms;
  static msapl = optionalScalarParameterBuilders.msapl;
  static mshld = optionalScalarParameterBuilders.mshld;
  static msjnl = optionalScalarParameterBuilders.msjnl;
  static mslbl = optionalScalarParameterBuilders.mslbl;
  static mslmt = optionalScalarParameterBuilders.mslmt;
  static msmod = optionalScalarParameterBuilders.msmod;
  static mspri = optionalScalarParameterBuilders.mspri;
  static msqlb = optionalScalarParameterBuilders.msqlb;
  static msqpt = optionalScalarParameterBuilders.msqpt;
  static msrer = optionalScalarParameterBuilders.msrer;
  static mssvf = optionalScalarParameterBuilders.mssvf;
  static mstfn = optionalScalarParameterBuilders.mstfn;
  static msttp = optionalScalarParameterBuilders.msttp;
  static msunr = optionalScalarParameterBuilders.msunr;
  static mu = optionalScalarParameterBuilders.mu;
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
  static nchn = optionalScalarParameterBuilders.nchn;
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
  static ncn = optionalScalarParameterBuilders.ncn;
  static ncr = optionalScalarParameterBuilders.ncr;
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
  static ncsv = optionalScalarParameterBuilders.ncsv;
  static ni = inheritedParameterBuilders.ni;
  static nmg = optionalScalarParameterBuilders.nmg;
  static ntcls = optionalScalarParameterBuilders.ntcls;
  static ntdis = optionalScalarParameterBuilders.ntdis;
  static nteid = optionalScalarParameterBuilders.nteid;
  static ntevt = optionalScalarParameterBuilders.ntevt;
  static ntlgt = optionalScalarParameterBuilders.ntlgt;
  static ntncl = optionalScalarParameterBuilders.ntncl;
  static ntnei = optionalScalarParameterBuilders.ntnei;
  static ntnsr = optionalScalarParameterBuilders.ntnsr;
  static ntolg = optionalScalarParameterBuilders.ntolg;
  static ntsrc = optionalScalarParameterBuilders.ntsrc;
  static op = inheritedParameterBuilders.op;
  static pfm = optionalScalarParameterBuilders.pfm;
  static pr = inheritedParameterBuilders.pr;
  static prm = optionalScalarParameterBuilders.prm;
  static pwlf = optionalScalarParameterBuilders.pwlf;
  static pwlt = optionalScalarParameterBuilders.pwlt;
  static pwrf = optionalScalarParameterBuilders.pwrf;
  static pwrh = optionalScalarParameterBuilders.pwrh;
  static pwrn = optionalScalarParameterBuilders.pwrn;
  static pwrp = optionalScalarParameterBuilders.pwrp;
  static pwrr = optionalScalarParameterBuilders.pwrr;
  static pwrw = optionalScalarParameterBuilders.pwrw;
  static qm = optionalScalarParameterBuilders.qm;
  static qu = optionalScalarParameterBuilders.qu;
  static rec = optionalScalarParameterBuilders.rec;
  static rei = optionalScalarParameterBuilders.rei;
  static req = optionalScalarParameterBuilders.req;
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
  static rh = optionalScalarParameterBuilders.rh;
  static rje = optionalScalarParameterBuilders.rje;
  static rjs = optionalScalarParameterBuilders.rjs;
  static sc = optionalScalarParameterBuilders.sc;
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
  static sdd = inheritedParameterBuilders.sdd;
  static se = optionalScalarParameterBuilders.se;
  static sea = optionalScalarParameterBuilders.sea;
  static sh(unit: UnitEntity) {
    return buildSdAlignedEmptyRuleParameters(
      {
        unit: unit,
        parameter: "sh",
      },
      (param) => new Sh(param),
    );
  }
  static shd(unit: UnitEntity) {
    return buildSdAlignedDefaultRuleParameters(
      {
        unit: unit,
        parameter: "shd",
        defaultRawValue: DEFAULTS.Shd,
        buildFallbackRawValue: (rule) => `${rule},${DEFAULTS.Shd}`,
      },
      (param) => new Shd(param),
    );
  }
  static si = optionalScalarParameterBuilders.si;
  static so = optionalScalarParameterBuilders.so;
  static soa = optionalScalarParameterBuilders.soa;
  static st(unit: UnitEntity) {
    return buildSdAlignedDefaultRuleParameters(
      {
        unit: unit,
        parameter: "st",
        defaultRawValue: DEFAULTS.St,
        buildFallbackRawValue: (rule) => `${rule},${DEFAULTS.St}`,
      },
      (param) => new St(param),
    );
  }
  static stt = inheritedParameterBuilders.stt;
  static sy(unit: UnitEntity) {
    return buildSdAlignedEmptyRuleParameters(
      {
        unit: unit,
        parameter: "sy",
      },
      (param) => new Sy(param),
    );
  }
  static sz = optionalScalarParameterBuilders.sz;
  static t = optionalScalarParameterBuilders.t;
  static td1 = optionalScalarParameterBuilders.td1;
  static td2 = optionalScalarParameterBuilders.td2;
  static td3 = optionalScalarParameterBuilders.td3;
  static td4 = optionalScalarParameterBuilders.td4;
  static te = optionalScalarParameterBuilders.te;
  static tho = optionalScalarParameterBuilders.tho;
  static tmitv = optionalScalarParameterBuilders.tmitv;
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
  static ts1 = optionalScalarParameterBuilders.ts1;
  static ts2 = optionalScalarParameterBuilders.ts2;
  static ts3 = optionalScalarParameterBuilders.ts3;
  static ts4 = optionalScalarParameterBuilders.ts4;
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
  static uem = optionalScalarParameterBuilders.uem;
  static un = optionalScalarParameterBuilders.un;
  static unit = optionalScalarParameterBuilders.unit;
  static wc(unit: UnitEntity) {
    return buildSdAlignedDefaultRuleParameters(
      {
        unit: unit,
        parameter: "wc",
        defaultRawValue: DEFAULTS.Wc,
        buildFallbackRawValue: (rule) => `${rule},${DEFAULTS.Wc}`,
      },
      (param) => new Wc(param),
    );
  }
  static wkp = optionalScalarParameterBuilders.wkp;
  static wt(unit: UnitEntity) {
    return buildSdAlignedDefaultRuleParameters(
      {
        unit: unit,
        parameter: "wt",
        defaultRawValue: DEFAULTS.Wt,
        buildFallbackRawValue: (rule) => `${rule},${DEFAULTS.Wt}`,
      },
      (param) => new Wt(param),
    );
  }
  static wth = optionalScalarParameterBuilders.wth;
}
