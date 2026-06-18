/* eslint-disable @typescript-eslint/no-explicit-any */
import { ANTLRErrorListener } from "antlr4ts/ANTLRErrorListener";
import { Recognizer } from "antlr4ts/Recognizer";
import type { AjsParserError } from "../../application/parsing/AjsParserPort";

export class SyntaxErrorListener implements ANTLRErrorListener<never> {
  readonly errors: AjsParserError[] = [];

  public syntaxError<T>(
    _recognizer: Recognizer<T, any>,
    _offendingSymbol: T,
    line: number,
    charPositionInLine: number,
    msg: string,
  ): void {
    this.errors.push({
      line,
      column: charPositionInLine,
      message: msg,
    });
  }
}
