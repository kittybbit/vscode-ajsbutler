import { AjsLexer } from "@generate/parser/AjsLexer";
import { AjsParser } from "@generate/parser/AjsParser";
import { CharStreams } from "antlr4ts/CharStreams";
import { CommonTokenStream } from "antlr4ts/CommonTokenStream";
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";
import type {
  AjsParserPort,
  ParseAjsResult,
} from "../../application/parsing/AjsParserPort";
import { Ajs3v12Evaluator } from "./AjsEvaluator";
import { SyntaxErrorListener } from "./SyntaxErrorListener";

export class AntlrAjsParser implements AjsParserPort {
  public parse(content: string): ParseAjsResult {
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
