/* eslint-disable @typescript-eslint/no-explicit-any */
import { ANTLRErrorListener } from "antlr4ts/ANTLRErrorListener";
import { Recognizer } from "antlr4ts/Recognizer";
import type { AntlrSyntaxError } from "./AntlrSyntaxError";

type AntlrSyntaxErrorArgs<T> = [
  recognizer: Recognizer<T, any>,
  offendingSymbol: T,
  line: number,
  charPositionInLine: number,
  msg: string,
];

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

export class SyntaxErrorListener implements ANTLRErrorListener<never> {
  readonly errors: AntlrSyntaxError[] = [];

  public syntaxError<T>(...args: AntlrSyntaxErrorArgs<T>): void {
    this.errors.push(toAntlrSyntaxError(args));
  }
}
