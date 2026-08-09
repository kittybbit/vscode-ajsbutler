import { AjsLexer } from "@generate/parser/AjsLexer";
import { AjsParser } from "@generate/parser/AjsParser";
import { CharStreams } from "antlr4ts/CharStreams";
import { CommonTokenStream } from "antlr4ts/CommonTokenStream";
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";
import { Ajs3v12Evaluator } from "./AjsEvaluator";
import type { AntlrSyntaxError } from "./AntlrSyntaxError";
import type { AjsRawUnit } from "./raw/AjsRawUnit";
import { SyntaxErrorListener } from "./SyntaxErrorListener";

export type RawParseAjsResult = {
  rootUnits: AjsRawUnit[];
  errors: AntlrSyntaxError[];
};

/** Infrastructure-internal ANTLR result used by the normalization adapter. */
export class AntlrRawAjsParser {
  public parse(content: string): RawParseAjsResult {
    const inputStream = CharStreams.fromString(content);
    const lexer = new AjsLexer(inputStream);
    const syntaxErrors = new SyntaxErrorListener();
    DEVELOPMENT && lexer.removeErrorListeners();
    lexer.addErrorListener(syntaxErrors);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new AjsParser(tokenStream);
    DEVELOPMENT && parser.removeErrorListeners();
    parser.addErrorListener(syntaxErrors);
    const tree = parser.unitDefinitionFile();
    const evaluator = new Ajs3v12Evaluator();
    ParseTreeWalker.DEFAULT.walk(evaluator, tree);
    return { rootUnits: evaluator.rootUnits, errors: syntaxErrors.errors };
  }
}
