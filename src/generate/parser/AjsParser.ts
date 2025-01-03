// Generated from src/antlr/AjsParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { AjsParserListener } from "./AjsParserListener";

export class AjsParser extends Parser {
	public static readonly COMMENT = 1;
	public static readonly UNIT_KEY = 2;
	public static readonly PARAMETER_KEY = 3;
	public static readonly ASSIGN = 4;
	public static readonly LBRACE = 5;
	public static readonly RBRACE = 6;
	public static readonly WS = 7;
	public static readonly STRING = 8;
	public static readonly TEXT = 9;
	public static readonly SEMI = 10;
	public static readonly AB_KEY = 11;
	public static readonly ABR_KEY = 12;
	public static readonly AR_KEY = 13;
	public static readonly CD_KEY = 14;
	public static readonly CFTD_KEY = 15;
	public static readonly CGS_KEY = 16;
	public static readonly CL_KEY = 17;
	public static readonly CM_KEY = 18;
	public static readonly CMAIF_KEY = 19;
	public static readonly CMSTS_KEY = 20;
	public static readonly COND_KEY = 21;
	public static readonly CTY_KEY = 22;
	public static readonly CY_KEY = 23;
	public static readonly DA_KEY = 24;
	public static readonly DE_KEY = 25;
	public static readonly ED_KEY = 26;
	public static readonly EGA_KEY = 27;
	public static readonly EJ_KEY = 28;
	public static readonly EJC_KEY = 29;
	public static readonly EJF_KEY = 30;
	public static readonly EJG_KEY = 31;
	public static readonly EJH_KEY = 32;
	public static readonly EJI_KEY = 33;
	public static readonly EJL_KEY = 34;
	public static readonly EJM_KEY = 35;
	public static readonly EJN_KEY = 36;
	public static readonly EJS_KEY = 37;
	public static readonly EJT_KEY = 38;
	public static readonly EJU_KEY = 39;
	public static readonly EJV_KEY = 40;
	public static readonly EL_KEY = 41;
	public static readonly ENV_KEY = 42;
	public static readonly ETM_KEY = 43;
	public static readonly ETN_KEY = 44;
	public static readonly ETS_KEY = 45;
	public static readonly EU_KEY = 46;
	public static readonly EUN_KEY = 47;
	public static readonly EV_KEY = 48;
	public static readonly EVDET_KEY = 49;
	public static readonly EVESC_KEY = 50;
	public static readonly EVGID_KEY = 51;
	public static readonly EVGRP_KEY = 52;
	public static readonly EVHST_KEY = 53;
	public static readonly EVIPA_KEY = 54;
	public static readonly EVPID_KEY = 55;
	public static readonly EVSFR_KEY = 56;
	public static readonly EVSID_KEY = 57;
	public static readonly EVSMS_KEY = 58;
	public static readonly EVSPL_KEY = 59;
	public static readonly EVSRC_KEY = 60;
	public static readonly EVSRT_KEY = 61;
	public static readonly EVSSV_KEY = 62;
	public static readonly EVTMC_KEY = 63;
	public static readonly EVUID_KEY = 64;
	public static readonly EVUSR_KEY = 65;
	public static readonly EVWFR_KEY = 66;
	public static readonly EVWID_KEY = 67;
	public static readonly EVWMS_KEY = 68;
	public static readonly EVWSV_KEY = 69;
	public static readonly EX_KEY = 70;
	public static readonly EY_KEY = 71;
	public static readonly FD_KEY = 72;
	public static readonly FLCO_KEY = 73;
	public static readonly FLWC_KEY = 74;
	public static readonly FLWF_KEY = 75;
	public static readonly FLWI_KEY = 76;
	public static readonly FXG_KEY = 77;
	public static readonly GTY_KEY = 78;
	public static readonly HA_KEY = 79;
	public static readonly HTCDM_KEY = 80;
	public static readonly HTCFL_KEY = 81;
	public static readonly HTEXM_KEY = 82;
	public static readonly HTKND_KEY = 83;
	public static readonly HTRBF_KEY = 84;
	public static readonly HTRHF_KEY = 85;
	public static readonly HTRQF_KEY = 86;
	public static readonly HTRQM_KEY = 87;
	public static readonly HTRQU_KEY = 88;
	public static readonly HTSPT_KEY = 89;
	public static readonly HTSTF_KEY = 90;
	public static readonly JC_KEY = 91;
	public static readonly JD_KEY = 92;
	public static readonly JDF_KEY = 93;
	public static readonly JPOIF_KEY = 94;
	public static readonly JTY_KEY = 95;
	public static readonly LFCRE_KEY = 96;
	public static readonly LFDFT_KEY = 97;
	public static readonly LFFNM_KEY = 98;
	public static readonly LFHDS_KEY = 99;
	public static readonly LFMKS_KEY = 100;
	public static readonly LFMXL_KEY = 101;
	public static readonly LFRFT_KEY = 102;
	public static readonly LFSIV_KEY = 103;
	public static readonly LFSRC_KEY = 104;
	public static readonly LFTPD_KEY = 105;
	public static readonly LN_KEY = 106;
	public static readonly MCS_KEY = 107;
	public static readonly MD_KEY = 108;
	public static readonly MH_KEY = 109;
	public static readonly MLADR_KEY = 110;
	public static readonly MLAFL_KEY = 111;
	public static readonly MLATF_KEY = 112;
	public static readonly MLFTX_KEY = 113;
	public static readonly MLLST_KEY = 114;
	public static readonly MLPRF_KEY = 115;
	public static readonly MLSAV_KEY = 116;
	public static readonly MLSBJ_KEY = 117;
	public static readonly MLSFD_KEY = 118;
	public static readonly MLSTX_KEY = 119;
	public static readonly MLTXT_KEY = 120;
	public static readonly MM_KEY = 121;
	public static readonly MP_KEY = 122;
	public static readonly MQCOR_KEY = 123;
	public static readonly MQDSC_KEY = 124;
	public static readonly MQEQN_KEY = 125;
	public static readonly MQHLD_KEY = 126;
	public static readonly MQMDL_KEY = 127;
	public static readonly MQMDN_KEY = 128;
	public static readonly MQMFN_KEY = 129;
	public static readonly MQMGR_KEY = 130;
	public static readonly MQPGM_KEY = 131;
	public static readonly MQPRI_KEY = 132;
	public static readonly MQPRM_KEY = 133;
	public static readonly MQQUE_KEY = 134;
	public static readonly MQSFN_KEY = 135;
	public static readonly MS_KEY = 136;
	public static readonly MSAPL_KEY = 137;
	public static readonly MSHLD_KEY = 138;
	public static readonly MSJNL_KEY = 139;
	public static readonly MSLBL_KEY = 140;
	public static readonly MSLMT_KEY = 141;
	public static readonly MSMOD_KEY = 142;
	public static readonly MSPRI_KEY = 143;
	public static readonly MSQLB_KEY = 144;
	public static readonly MSQPT_KEY = 145;
	public static readonly MSRER_KEY = 146;
	public static readonly MSSVF_KEY = 147;
	public static readonly MSTFN_KEY = 148;
	public static readonly MSTTP_KEY = 149;
	public static readonly MSUNR_KEY = 150;
	public static readonly MU_KEY = 151;
	public static readonly NCEX_KEY = 152;
	public static readonly NCHN_KEY = 153;
	public static readonly NCL_KEY = 154;
	public static readonly NCN_KEY = 155;
	public static readonly NCR_KEY = 156;
	public static readonly NCS_KEY = 157;
	public static readonly NCSV_KEY = 158;
	public static readonly NI_KEY = 159;
	public static readonly NMG_KEY = 160;
	public static readonly NTCLS_KEY = 161;
	public static readonly NTDIS_KEY = 162;
	public static readonly NTEID_KEY = 163;
	public static readonly NTEVT_KEY = 164;
	public static readonly NTLGT_KEY = 165;
	public static readonly NTNCL_KEY = 166;
	public static readonly NTNEI_KEY = 167;
	public static readonly NTNSR_KEY = 168;
	public static readonly NTOLG_KEY = 169;
	public static readonly NTSRC_KEY = 170;
	public static readonly OP_KEY = 171;
	public static readonly PFM_KEY = 172;
	public static readonly PR_KEY = 173;
	public static readonly PRM_KEY = 174;
	public static readonly PWLF_KEY = 175;
	public static readonly PWLT_KEY = 176;
	public static readonly PWRF_KEY = 177;
	public static readonly PWRH_KEY = 178;
	public static readonly PWRN_KEY = 179;
	public static readonly PWRP_KEY = 180;
	public static readonly PWRR_KEY = 181;
	public static readonly PWRW_KEY = 182;
	public static readonly QM_KEY = 183;
	public static readonly QU_KEY = 184;
	public static readonly REC_KEY = 185;
	public static readonly REI_KEY = 186;
	public static readonly REQ_KEY = 187;
	public static readonly RG_KEY = 188;
	public static readonly RH_KEY = 189;
	public static readonly RJE_KEY = 190;
	public static readonly RJS_KEY = 191;
	public static readonly SC_KEY = 192;
	public static readonly SD_KEY = 193;
	public static readonly SDD_KEY = 194;
	public static readonly SE_KEY = 195;
	public static readonly SEA_KEY = 196;
	public static readonly SH_KEY = 197;
	public static readonly SHD_KEY = 198;
	public static readonly SI_KEY = 199;
	public static readonly SO_KEY = 200;
	public static readonly SOA_KEY = 201;
	public static readonly ST_KEY = 202;
	public static readonly STT_KEY = 203;
	public static readonly SY_KEY = 204;
	public static readonly SZ_KEY = 205;
	public static readonly TD1_KEY = 206;
	public static readonly TD2_KEY = 207;
	public static readonly TD3_KEY = 208;
	public static readonly TD4_KEY = 209;
	public static readonly TE_KEY = 210;
	public static readonly THO_KEY = 211;
	public static readonly TMITV_KEY = 212;
	public static readonly TOP1_KEY = 213;
	public static readonly TOP2_KEY = 214;
	public static readonly TOP3_KEY = 215;
	public static readonly TOP4_KEY = 216;
	public static readonly TS1_KEY = 217;
	public static readonly TS2_KEY = 218;
	public static readonly TS3_KEY = 219;
	public static readonly TS4_KEY = 220;
	public static readonly TY_KEY = 221;
	public static readonly UEM_KEY = 222;
	public static readonly UN_KEY = 223;
	public static readonly WC_KEY = 224;
	public static readonly WKP_KEY = 225;
	public static readonly WT_KEY = 226;
	public static readonly WTH_KEY = 227;
	public static readonly RULE_unitDefinitionFile = 0;
	public static readonly RULE_unitDefinition = 1;
	public static readonly RULE_unitAttribute = 2;
	public static readonly RULE_unitDefinitionBody = 3;
	public static readonly RULE_unitParameter = 4;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"unitDefinitionFile", "unitDefinition", "unitAttribute", "unitDefinitionBody", 
		"unitParameter",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, "'unit'", undefined, "'='", "'{'", "'}'", undefined, 
		undefined, undefined, "';'", "'ab'", "'abr'", "'ar'", "'cd'", "'cftd'", 
		"'cgs'", "'cl'", "'cm'", "'cmaif'", "'cmsts'", "'cond'", "'cty'", "'cy'", 
		"'da'", "'de'", "'ed'", "'ega'", "'ej'", "'ejc'", "'ejf'", "'ejg'", "'ejh'", 
		"'eji'", "'ejl'", "'ejm'", "'ejn'", "'ejs'", "'ejt'", "'eju'", "'ejv'", 
		"'el'", "'env'", "'etm'", "'etn'", "'ets'", "'eu'", "'eun'", "'ev'", "'evdet'", 
		"'evesc'", "'evgid'", "'evgrp'", "'evhst'", "'evipa'", "'evpid'", "'evsfr'", 
		"'evsid'", "'evsms'", "'evspl'", "'evsrc'", "'evsrt'", "'evssv'", "'evtmc'", 
		"'evuid'", "'evusr'", "'evwfr'", "'evwid'", "'evwms'", "'evwsv'", "'ex'", 
		"'ey'", "'fd'", "'flco'", "'flwc'", "'flwf'", "'flwi'", "'fxg'", "'gty'", 
		"'ha'", "'htcdm'", "'htcfl'", "'htexm'", "'htknd'", "'htrbf'", "'htrhf'", 
		"'htrqf'", "'htrqm'", "'htrqu'", "'htspt'", "'htstf'", "'jc'", "'jd'", 
		"'jdf'", "'jpoif'", "'jty'", "'lfcre'", "'lfdft'", "'lffnm'", "'lfhds'", 
		"'lfmks'", "'lfmxl'", "'lfrft'", "'lfsiv'", "'lfsrc'", "'lftpd'", "'ln'", 
		"'mcs'", "'md'", "'mh'", "'mladr'", "'mlafl'", "'mlatf'", "'mlftx'", "'mllst'", 
		"'mlprf'", "'mlsav'", "'mlsbj'", "'mlsfd'", "'mlstx'", "'mltxt'", "'mm'", 
		"'mp'", "'mqcor'", "'mqdsc'", "'mqeqn'", "'mqhld'", "'mqmdl'", "'mqmdn'", 
		"'mqmfn'", "'mqmgr'", "'mqpgm'", "'mqpri'", "'mqprm'", "'mqque'", "'mqsfn'", 
		"'ms'", "'msapl'", "'mshld'", "'msjnl'", "'mslbl'", "'mslmt'", "'msmod'", 
		"'mspri'", "'msqlb'", "'msqpt'", "'msrer'", "'mssvf'", "'mstfn'", "'msttp'", 
		"'msunr'", "'mu'", "'ncex'", "'nchn'", "'ncl'", "'ncn'", "'ncr'", "'ncs'", 
		"'ncsv'", "'ni'", "'nmg'", "'ntcls'", "'ntdis'", "'nteid'", "'ntevt'", 
		"'ntlgt'", "'ntncl'", "'ntnei'", "'ntnsr'", "'ntolg'", "'ntsrc'", "'op'", 
		"'pfm'", "'pr'", "'prm'", "'pwlf'", "'pwlt'", "'pwrf'", "'pwrh'", "'pwrn'", 
		"'pwrp'", "'pwrr'", "'pwrw'", "'qm'", "'qu'", "'rec'", "'rei'", "'req'", 
		"'rg'", "'rh'", "'rje'", "'rjs'", "'sc'", "'sd'", "'sdd'", "'se'", "'sea'", 
		"'sh'", "'shd'", "'si'", "'so'", "'soa'", "'st'", "'stt'", "'sy'", "'sz'", 
		"'td1'", "'td2'", "'td3'", "'td4'", "'te'", "'tho'", "'tmitv'", "'top1'", 
		"'top2'", "'top3'", "'top4'", "'ts1'", "'ts2'", "'ts3'", "'ts4'", "'ty'", 
		"'uem'", "'un'", "'wc'", "'wkp'", "'wt'", "'wth'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "COMMENT", "UNIT_KEY", "PARAMETER_KEY", "ASSIGN", "LBRACE", 
		"RBRACE", "WS", "STRING", "TEXT", "SEMI", "AB_KEY", "ABR_KEY", "AR_KEY", 
		"CD_KEY", "CFTD_KEY", "CGS_KEY", "CL_KEY", "CM_KEY", "CMAIF_KEY", "CMSTS_KEY", 
		"COND_KEY", "CTY_KEY", "CY_KEY", "DA_KEY", "DE_KEY", "ED_KEY", "EGA_KEY", 
		"EJ_KEY", "EJC_KEY", "EJF_KEY", "EJG_KEY", "EJH_KEY", "EJI_KEY", "EJL_KEY", 
		"EJM_KEY", "EJN_KEY", "EJS_KEY", "EJT_KEY", "EJU_KEY", "EJV_KEY", "EL_KEY", 
		"ENV_KEY", "ETM_KEY", "ETN_KEY", "ETS_KEY", "EU_KEY", "EUN_KEY", "EV_KEY", 
		"EVDET_KEY", "EVESC_KEY", "EVGID_KEY", "EVGRP_KEY", "EVHST_KEY", "EVIPA_KEY", 
		"EVPID_KEY", "EVSFR_KEY", "EVSID_KEY", "EVSMS_KEY", "EVSPL_KEY", "EVSRC_KEY", 
		"EVSRT_KEY", "EVSSV_KEY", "EVTMC_KEY", "EVUID_KEY", "EVUSR_KEY", "EVWFR_KEY", 
		"EVWID_KEY", "EVWMS_KEY", "EVWSV_KEY", "EX_KEY", "EY_KEY", "FD_KEY", "FLCO_KEY", 
		"FLWC_KEY", "FLWF_KEY", "FLWI_KEY", "FXG_KEY", "GTY_KEY", "HA_KEY", "HTCDM_KEY", 
		"HTCFL_KEY", "HTEXM_KEY", "HTKND_KEY", "HTRBF_KEY", "HTRHF_KEY", "HTRQF_KEY", 
		"HTRQM_KEY", "HTRQU_KEY", "HTSPT_KEY", "HTSTF_KEY", "JC_KEY", "JD_KEY", 
		"JDF_KEY", "JPOIF_KEY", "JTY_KEY", "LFCRE_KEY", "LFDFT_KEY", "LFFNM_KEY", 
		"LFHDS_KEY", "LFMKS_KEY", "LFMXL_KEY", "LFRFT_KEY", "LFSIV_KEY", "LFSRC_KEY", 
		"LFTPD_KEY", "LN_KEY", "MCS_KEY", "MD_KEY", "MH_KEY", "MLADR_KEY", "MLAFL_KEY", 
		"MLATF_KEY", "MLFTX_KEY", "MLLST_KEY", "MLPRF_KEY", "MLSAV_KEY", "MLSBJ_KEY", 
		"MLSFD_KEY", "MLSTX_KEY", "MLTXT_KEY", "MM_KEY", "MP_KEY", "MQCOR_KEY", 
		"MQDSC_KEY", "MQEQN_KEY", "MQHLD_KEY", "MQMDL_KEY", "MQMDN_KEY", "MQMFN_KEY", 
		"MQMGR_KEY", "MQPGM_KEY", "MQPRI_KEY", "MQPRM_KEY", "MQQUE_KEY", "MQSFN_KEY", 
		"MS_KEY", "MSAPL_KEY", "MSHLD_KEY", "MSJNL_KEY", "MSLBL_KEY", "MSLMT_KEY", 
		"MSMOD_KEY", "MSPRI_KEY", "MSQLB_KEY", "MSQPT_KEY", "MSRER_KEY", "MSSVF_KEY", 
		"MSTFN_KEY", "MSTTP_KEY", "MSUNR_KEY", "MU_KEY", "NCEX_KEY", "NCHN_KEY", 
		"NCL_KEY", "NCN_KEY", "NCR_KEY", "NCS_KEY", "NCSV_KEY", "NI_KEY", "NMG_KEY", 
		"NTCLS_KEY", "NTDIS_KEY", "NTEID_KEY", "NTEVT_KEY", "NTLGT_KEY", "NTNCL_KEY", 
		"NTNEI_KEY", "NTNSR_KEY", "NTOLG_KEY", "NTSRC_KEY", "OP_KEY", "PFM_KEY", 
		"PR_KEY", "PRM_KEY", "PWLF_KEY", "PWLT_KEY", "PWRF_KEY", "PWRH_KEY", "PWRN_KEY", 
		"PWRP_KEY", "PWRR_KEY", "PWRW_KEY", "QM_KEY", "QU_KEY", "REC_KEY", "REI_KEY", 
		"REQ_KEY", "RG_KEY", "RH_KEY", "RJE_KEY", "RJS_KEY", "SC_KEY", "SD_KEY", 
		"SDD_KEY", "SE_KEY", "SEA_KEY", "SH_KEY", "SHD_KEY", "SI_KEY", "SO_KEY", 
		"SOA_KEY", "ST_KEY", "STT_KEY", "SY_KEY", "SZ_KEY", "TD1_KEY", "TD2_KEY", 
		"TD3_KEY", "TD4_KEY", "TE_KEY", "THO_KEY", "TMITV_KEY", "TOP1_KEY", "TOP2_KEY", 
		"TOP3_KEY", "TOP4_KEY", "TS1_KEY", "TS2_KEY", "TS3_KEY", "TS4_KEY", "TY_KEY", 
		"UEM_KEY", "UN_KEY", "WC_KEY", "WKP_KEY", "WT_KEY", "WTH_KEY",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(AjsParser._LITERAL_NAMES, AjsParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return AjsParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "AjsParser.g4"; }

	// @Override
	public get ruleNames(): string[] { return AjsParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return AjsParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(AjsParser._ATN, this);
	}
	// @RuleVersion(0)
	public unitDefinitionFile(): UnitDefinitionFileContext {
		let _localctx: UnitDefinitionFileContext = new UnitDefinitionFileContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, AjsParser.RULE_unitDefinitionFile);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 13;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AjsParser.UNIT_KEY) {
				{
				{
				this.state = 10;
				this.unitDefinition();
				}
				}
				this.state = 15;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unitDefinition(): UnitDefinitionContext {
		let _localctx: UnitDefinitionContext = new UnitDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, AjsParser.RULE_unitDefinition);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 16;
			this.unitAttribute();
			this.state = 17;
			this.unitDefinitionBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unitAttribute(): UnitAttributeContext {
		let _localctx: UnitAttributeContext = new UnitAttributeContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, AjsParser.RULE_unitAttribute);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 19;
			_localctx._key = this.match(AjsParser.UNIT_KEY);
			this.state = 20;
			this.match(AjsParser.ASSIGN);
			this.state = 21;
			_localctx._value = this.match(AjsParser.TEXT);
			this.state = 22;
			this.match(AjsParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unitDefinitionBody(): UnitDefinitionBodyContext {
		let _localctx: UnitDefinitionBodyContext = new UnitDefinitionBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, AjsParser.RULE_unitDefinitionBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 24;
			this.match(AjsParser.LBRACE);
			this.state = 26;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 25;
				this.unitParameter();
				}
				}
				this.state = 28;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === AjsParser.PARAMETER_KEY);
			this.state = 33;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AjsParser.UNIT_KEY) {
				{
				{
				this.state = 30;
				this.unitDefinition();
				}
				}
				this.state = 35;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 36;
			this.match(AjsParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unitParameter(): UnitParameterContext {
		let _localctx: UnitParameterContext = new UnitParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, AjsParser.RULE_unitParameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 38;
			_localctx._key = this.match(AjsParser.PARAMETER_KEY);
			this.state = 39;
			this.match(AjsParser.ASSIGN);
			this.state = 40;
			_localctx._value = this._input.LT(1);
			_la = this._input.LA(1);
			if (!(_la === AjsParser.STRING || _la === AjsParser.TEXT)) {
				_localctx._value = this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 41;
			this.match(AjsParser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\xE5.\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x03\x02" +
		"\x07\x02\x0E\n\x02\f\x02\x0E\x02\x11\v\x02\x03\x03\x03\x03\x03\x03\x03" +
		"\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x05\x03\x05\x06\x05\x1D\n\x05" +
		"\r\x05\x0E\x05\x1E\x03\x05\x07\x05\"\n\x05\f\x05\x0E\x05%\v\x05\x03\x05" +
		"\x03\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x02\x02\x02\x07" +
		"\x02\x02\x04\x02\x06\x02\b\x02\n\x02\x02\x03\x03\x02\n\v\x02+\x02\x0F" +
		"\x03\x02\x02\x02\x04\x12\x03\x02\x02\x02\x06\x15\x03\x02\x02\x02\b\x1A" +
		"\x03\x02\x02\x02\n(\x03\x02\x02\x02\f\x0E\x05\x04\x03\x02\r\f\x03\x02" +
		"\x02\x02\x0E\x11\x03\x02\x02\x02\x0F\r\x03\x02\x02\x02\x0F\x10\x03\x02" +
		"\x02\x02\x10\x03\x03\x02\x02\x02\x11\x0F\x03\x02\x02\x02\x12\x13\x05\x06" +
		"\x04\x02\x13\x14\x05\b\x05\x02\x14\x05\x03\x02\x02\x02\x15\x16\x07\x04" +
		"\x02\x02\x16\x17\x07\x06\x02\x02\x17\x18\x07\v\x02\x02\x18\x19\x07\f\x02" +
		"\x02\x19\x07\x03\x02\x02\x02\x1A\x1C\x07\x07\x02\x02\x1B\x1D\x05\n\x06" +
		"\x02\x1C\x1B\x03\x02\x02\x02\x1D\x1E\x03\x02\x02\x02\x1E\x1C\x03\x02\x02" +
		"\x02\x1E\x1F\x03\x02\x02\x02\x1F#\x03\x02\x02\x02 \"\x05\x04\x03\x02!" +
		" \x03\x02\x02\x02\"%\x03\x02\x02\x02#!\x03\x02\x02\x02#$\x03\x02\x02\x02" +
		"$&\x03\x02\x02\x02%#\x03\x02\x02\x02&\'\x07\b\x02\x02\'\t\x03\x02\x02" +
		"\x02()\x07\x05\x02\x02)*\x07\x06\x02\x02*+\t\x02\x02\x02+,\x07\f\x02\x02" +
		",\v\x03\x02\x02\x02\x05\x0F\x1E#";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AjsParser.__ATN) {
			AjsParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(AjsParser._serializedATN));
		}

		return AjsParser.__ATN;
	}

}

export class UnitDefinitionFileContext extends ParserRuleContext {
	public unitDefinition(): UnitDefinitionContext[];
	public unitDefinition(i: number): UnitDefinitionContext;
	public unitDefinition(i?: number): UnitDefinitionContext | UnitDefinitionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UnitDefinitionContext);
		} else {
			return this.getRuleContext(i, UnitDefinitionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AjsParser.RULE_unitDefinitionFile; }
	// @Override
	public enterRule(listener: AjsParserListener): void {
		if (listener.enterUnitDefinitionFile) {
			listener.enterUnitDefinitionFile(this);
		}
	}
	// @Override
	public exitRule(listener: AjsParserListener): void {
		if (listener.exitUnitDefinitionFile) {
			listener.exitUnitDefinitionFile(this);
		}
	}
}


export class UnitDefinitionContext extends ParserRuleContext {
	public unitAttribute(): UnitAttributeContext {
		return this.getRuleContext(0, UnitAttributeContext);
	}
	public unitDefinitionBody(): UnitDefinitionBodyContext {
		return this.getRuleContext(0, UnitDefinitionBodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AjsParser.RULE_unitDefinition; }
	// @Override
	public enterRule(listener: AjsParserListener): void {
		if (listener.enterUnitDefinition) {
			listener.enterUnitDefinition(this);
		}
	}
	// @Override
	public exitRule(listener: AjsParserListener): void {
		if (listener.exitUnitDefinition) {
			listener.exitUnitDefinition(this);
		}
	}
}


export class UnitAttributeContext extends ParserRuleContext {
	public _key!: Token;
	public _value!: Token;
	public ASSIGN(): TerminalNode { return this.getToken(AjsParser.ASSIGN, 0); }
	public SEMI(): TerminalNode { return this.getToken(AjsParser.SEMI, 0); }
	public UNIT_KEY(): TerminalNode { return this.getToken(AjsParser.UNIT_KEY, 0); }
	public TEXT(): TerminalNode { return this.getToken(AjsParser.TEXT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AjsParser.RULE_unitAttribute; }
	// @Override
	public enterRule(listener: AjsParserListener): void {
		if (listener.enterUnitAttribute) {
			listener.enterUnitAttribute(this);
		}
	}
	// @Override
	public exitRule(listener: AjsParserListener): void {
		if (listener.exitUnitAttribute) {
			listener.exitUnitAttribute(this);
		}
	}
}


export class UnitDefinitionBodyContext extends ParserRuleContext {
	public LBRACE(): TerminalNode { return this.getToken(AjsParser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(AjsParser.RBRACE, 0); }
	public unitParameter(): UnitParameterContext[];
	public unitParameter(i: number): UnitParameterContext;
	public unitParameter(i?: number): UnitParameterContext | UnitParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UnitParameterContext);
		} else {
			return this.getRuleContext(i, UnitParameterContext);
		}
	}
	public unitDefinition(): UnitDefinitionContext[];
	public unitDefinition(i: number): UnitDefinitionContext;
	public unitDefinition(i?: number): UnitDefinitionContext | UnitDefinitionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UnitDefinitionContext);
		} else {
			return this.getRuleContext(i, UnitDefinitionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AjsParser.RULE_unitDefinitionBody; }
	// @Override
	public enterRule(listener: AjsParserListener): void {
		if (listener.enterUnitDefinitionBody) {
			listener.enterUnitDefinitionBody(this);
		}
	}
	// @Override
	public exitRule(listener: AjsParserListener): void {
		if (listener.exitUnitDefinitionBody) {
			listener.exitUnitDefinitionBody(this);
		}
	}
}


export class UnitParameterContext extends ParserRuleContext {
	public _key!: Token;
	public _value!: Token;
	public ASSIGN(): TerminalNode { return this.getToken(AjsParser.ASSIGN, 0); }
	public SEMI(): TerminalNode { return this.getToken(AjsParser.SEMI, 0); }
	public PARAMETER_KEY(): TerminalNode { return this.getToken(AjsParser.PARAMETER_KEY, 0); }
	public TEXT(): TerminalNode | undefined { return this.tryGetToken(AjsParser.TEXT, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(AjsParser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AjsParser.RULE_unitParameter; }
	// @Override
	public enterRule(listener: AjsParserListener): void {
		if (listener.enterUnitParameter) {
			listener.enterUnitParameter(this);
		}
	}
	// @Override
	public exitRule(listener: AjsParserListener): void {
		if (listener.exitUnitParameter) {
			listener.exitUnitParameter(this);
		}
	}
}


