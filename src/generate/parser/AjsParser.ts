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
		undefined, undefined, "';'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "COMMENT", "UNIT_KEY", "PARAMETER_KEY", "ASSIGN", "LBRACE", 
		"RBRACE", "WS", "STRING", "TEXT", "SEMI",
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
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\f.\x04\x02\t" +
		"\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x03\x02\x07" +
		"\x02\x0E\n\x02\f\x02\x0E\x02\x11\v\x02\x03\x03\x03\x03\x03\x03\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x05\x03\x05\x06\x05\x1D\n\x05\r\x05" +
		"\x0E\x05\x1E\x03\x05\x07\x05\"\n\x05\f\x05\x0E\x05%\v\x05\x03\x05\x03" +
		"\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x02\x02\x02\x07\x02" +
		"\x02\x04\x02\x06\x02\b\x02\n\x02\x02\x03\x03\x02\n\v\x02+\x02\x0F\x03" +
		"\x02\x02\x02\x04\x12\x03\x02\x02\x02\x06\x15\x03\x02\x02\x02\b\x1A\x03" +
		"\x02\x02\x02\n(\x03\x02\x02\x02\f\x0E\x05\x04\x03\x02\r\f\x03\x02\x02" +
		"\x02\x0E\x11\x03\x02\x02\x02\x0F\r\x03\x02\x02\x02\x0F\x10\x03\x02\x02" +
		"\x02\x10\x03\x03\x02\x02\x02\x11\x0F\x03\x02\x02\x02\x12\x13\x05\x06\x04" +
		"\x02\x13\x14\x05\b\x05\x02\x14\x05\x03\x02\x02\x02\x15\x16\x07\x04\x02" +
		"\x02\x16\x17\x07\x06\x02\x02\x17\x18\x07\v\x02\x02\x18\x19\x07\f\x02\x02" +
		"\x19\x07\x03\x02\x02\x02\x1A\x1C\x07\x07\x02\x02\x1B\x1D\x05\n\x06\x02" +
		"\x1C\x1B\x03\x02\x02\x02\x1D\x1E\x03\x02\x02\x02\x1E\x1C\x03\x02\x02\x02" +
		"\x1E\x1F\x03\x02\x02\x02\x1F#\x03\x02\x02\x02 \"\x05\x04\x03\x02! \x03" +
		"\x02\x02\x02\"%\x03\x02\x02\x02#!\x03\x02\x02\x02#$\x03\x02\x02\x02$&" +
		"\x03\x02\x02\x02%#\x03\x02\x02\x02&\'\x07\b\x02\x02\'\t\x03\x02\x02\x02" +
		"()\x07\x05\x02\x02)*\x07\x06\x02\x02*+\t\x02\x02\x02+,\x07\f\x02\x02," +
		"\v\x03\x02\x02\x02\x05\x0F\x1E#";
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


