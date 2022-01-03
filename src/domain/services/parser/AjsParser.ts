import { CharStreams } from 'antlr4ts/CharStreams';
import { CommonTokenStream } from 'antlr4ts/CommonTokenStream';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { AjsLexer } from '@generate/parser/AjsLexer';
import { AjsParser } from '@generate/parser/AjsParser';
import { Unit } from '../../values/Unit';
import { Ajs3v12Evaluator } from './AjsEvaluator';
import { SyntaxErrorListener } from './SyntaxErrorListener';

/**
 * parse Ajs definition.
 */
export function parseAjs(content: string): Array<Unit> {
    const inputStream = CharStreams.fromString(content);
    const lexer = new AjsLexer(inputStream);
    const antlrError = new SyntaxErrorListener();
    lexer.addErrorListener(antlrError);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new AjsParser(tokenStream);
    parser.addErrorListener(antlrError);
    const tree = parser.unitDefinitionFile();
    const units = new Array<Unit>();
    ParseTreeWalker.DEFAULT.walk(new Ajs3v12Evaluator(units), tree);
    return units;
}