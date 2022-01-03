// Generated from src/antlr/AjsLexer.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { CharStream } from "antlr4ts/CharStream";
import { Lexer } from "antlr4ts/Lexer";
import { LexerATNSimulator } from "antlr4ts/atn/LexerATNSimulator";
import { NotNull } from "antlr4ts/Decorators";
import { Override } from "antlr4ts/Decorators";
import { RuleContext } from "antlr4ts/RuleContext";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";


export class AjsLexer extends Lexer {
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
	public static readonly VALUE = 1;

	// tslint:disable:no-trailing-whitespace
	public static readonly channelNames: string[] = [
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN",
	];

	// tslint:disable:no-trailing-whitespace
	public static readonly modeNames: string[] = [
		"DEFAULT_MODE", "VALUE",
	];

	public static readonly ruleNames: string[] = [
		"COMMENT", "UNIT_KEY", "PARAMETER_KEY", "ASSIGN", "LBRACE", "RBRACE", 
		"WS", "STRING", "TEXT", "SEMI", "EscapeString",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, "'unit'", undefined, "'='", "'{'", "'}'", undefined, 
		undefined, undefined, "';'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "COMMENT", "UNIT_KEY", "PARAMETER_KEY", "ASSIGN", "LBRACE", 
		"RBRACE", "WS", "STRING", "TEXT", "SEMI",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(AjsLexer._LITERAL_NAMES, AjsLexer._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return AjsLexer.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(AjsLexer._ATN, this);
	}

	// @Override
	public get grammarFileName(): string { return "AjsLexer.g4"; }

	// @Override
	public get ruleNames(): string[] { return AjsLexer.ruleNames; }

	// @Override
	public get serializedATN(): string { return AjsLexer._serializedATN; }

	// @Override
	public get channelNames(): string[] { return AjsLexer.channelNames; }

	// @Override
	public get modeNames(): string[] { return AjsLexer.modeNames; }

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\f\\\b\x01\b\x01" +
		"\x04\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06" +
		"\x04\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x03\x02" +
		"\x03\x02\x03\x02\x03\x02\x07\x02\x1F\n\x02\f\x02\x0E\x02\"\v\x02\x03\x02" +
		"\x03\x02\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x04\x03\x04\x07\x040\n\x04\f\x04\x0E\x043\v\x04\x03\x05\x03\x05\x03" +
		"\x05\x03\x05\x03\x06\x03\x06\x03\x07\x03\x07\x03\b\x06\b>\n\b\r\b\x0E" +
		"\b?\x03\b\x03\b\x03\t\x03\t\x03\t\x07\tG\n\t\f\t\x0E\tJ\v\t\x03\t\x03" +
		"\t\x03\n\x06\nO\n\n\r\n\x0E\nP\x03\v\x03\v\x03\v\x03\v\x03\f\x03\f\x03" +
		"\f\x03\f\x05\f[\n\f\x03 \x02\x02\r\x04\x02\x03\x06\x02\x04\b\x02\x05\n" +
		"\x02\x06\f\x02\x07\x0E\x02\b\x10\x02\t\x12\x02\n\x14\x02\v\x16\x02\f\x18" +
		"\x02\x02\x04\x02\x03\x07\x04\x02C\\c|\x05\x022;C\\c|\x06\x02\v\f\x0E\x0F" +
		"\"\"\xA2\xA2\x03\x02$%\x05\x02\f\f\x0F\x0F==\x02`\x02\x04\x03\x02\x02" +
		"\x02\x02\x06\x03\x02\x02\x02\x02\b\x03\x02\x02\x02\x02\n\x03\x02\x02\x02" +
		"\x02\f\x03\x02\x02\x02\x02\x0E\x03\x02\x02\x02\x02\x10\x03\x02\x02\x02" +
		"\x03\x12\x03\x02\x02\x02\x03\x14\x03\x02\x02\x02\x03\x16\x03\x02\x02\x02" +
		"\x04\x1A\x03\x02\x02\x02\x06(\x03\x02\x02\x02\b-\x03\x02\x02\x02\n4\x03" +
		"\x02\x02\x02\f8\x03\x02\x02\x02\x0E:\x03\x02\x02\x02\x10=\x03\x02\x02" +
		"\x02\x12C\x03\x02\x02\x02\x14N\x03\x02\x02\x02\x16R\x03\x02\x02\x02\x18" +
		"Z\x03\x02\x02\x02\x1A\x1B\x071\x02\x02\x1B\x1C\x07,\x02\x02\x1C \x03\x02" +
		"\x02\x02\x1D\x1F\v\x02\x02\x02\x1E\x1D\x03\x02\x02\x02\x1F\"\x03\x02\x02" +
		"\x02 !\x03\x02\x02\x02 \x1E\x03\x02\x02\x02!#\x03\x02\x02\x02\" \x03\x02" +
		"\x02\x02#$\x07,\x02\x02$%\x071\x02\x02%&\x03\x02\x02\x02&\'\b\x02\x02" +
		"\x02\'\x05\x03\x02\x02\x02()\x07w\x02\x02)*\x07p\x02\x02*+\x07k\x02\x02" +
		"+,\x07v\x02\x02,\x07\x03\x02\x02\x02-1\t\x02\x02\x02.0\t\x03\x02\x02/" +
		".\x03\x02\x02\x0203\x03\x02\x02\x021/\x03\x02\x02\x0212\x03\x02\x02\x02" +
		"2\t\x03\x02\x02\x0231\x03\x02\x02\x0245\x07?\x02\x0256\x03\x02\x02\x02" +
		"67\b\x05\x03\x027\v\x03\x02\x02\x0289\x07}\x02\x029\r\x03\x02\x02\x02" +
		":;\x07\x7F\x02\x02;\x0F\x03\x02\x02\x02<>\t\x04\x02\x02=<\x03\x02\x02" +
		"\x02>?\x03\x02\x02\x02?=\x03\x02\x02\x02?@\x03\x02\x02\x02@A\x03\x02\x02" +
		"\x02AB\b\b\x02\x02B\x11\x03\x02\x02\x02CH\x07$\x02\x02DG\x05\x18\f\x02" +
		"EG\n\x05\x02\x02FD\x03\x02\x02\x02FE\x03\x02\x02\x02GJ\x03\x02\x02\x02" +
		"HF\x03\x02\x02\x02HI\x03\x02\x02\x02IK\x03\x02\x02\x02JH\x03\x02\x02\x02" +
		"KL\x07$\x02\x02L\x13\x03\x02\x02\x02MO\n\x06\x02\x02NM\x03\x02\x02\x02" +
		"OP\x03\x02\x02\x02PN\x03\x02\x02\x02PQ\x03\x02\x02\x02Q\x15\x03\x02\x02" +
		"\x02RS\x07=\x02\x02ST\x03\x02\x02\x02TU\b\v\x04\x02U\x17\x03\x02\x02\x02" +
		"VW\x07%\x02\x02W[\x07$\x02\x02XY\x07%\x02\x02Y[\x07%\x02\x02ZV\x03\x02" +
		"\x02\x02ZX\x03\x02\x02\x02[\x19\x03\x02\x02\x02\v\x02\x03 1?FHPZ\x05\b" +
		"\x02\x02\x04\x03\x02\x04\x02\x02";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AjsLexer.__ATN) {
			AjsLexer.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(AjsLexer._serializedATN));
		}

		return AjsLexer.__ATN;
	}

}

