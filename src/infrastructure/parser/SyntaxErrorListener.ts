/* eslint-disable @typescript-eslint/no-explicit-any */
import { ANTLRErrorListener } from "antlr4ts/ANTLRErrorListener";
import { Recognizer } from "antlr4ts/Recognizer";
import type { AjsParserError } from "../../application/parsing/AjsParserPort";

type AntlrSyntaxErrorArgs<T> = [
  recognizer: Recognizer<T, any>,
  offendingSymbol: T,
  line: number,
  charPositionInLine: number,
  msg: string,
];

type AntlrSyntaxError = {
  charPositionInLine: number;
  line: number;
  msg: string;
};

const toAntlrSyntaxError = <T>([
  ,
  ,
  line,
  charPositionInLine,
  msg,
]: AntlrSyntaxErrorArgs<T>): AntlrSyntaxError => ({
  charPositionInLine,
  line,
  msg,
});

const toAjsParserError = ({
  charPositionInLine,
  line,
  msg,
}: AntlrSyntaxError): AjsParserError => ({
  line,
  column: charPositionInLine,
  message: msg,
});

export class SyntaxErrorListener implements ANTLRErrorListener<never> {
  readonly errors: AjsParserError[] = [];

  public syntaxError<T>(...args: AntlrSyntaxErrorArgs<T>): void {
    this.errors.push(toAjsParserError(toAntlrSyntaxError(args)));
  }
}
