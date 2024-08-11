/* eslint-disable @typescript-eslint/no-explicit-any */
import { Recognizer } from 'antlr4ts/Recognizer'
import { RecognitionException } from 'antlr4ts/RecognitionException'
import { ANTLRErrorListener } from 'antlr4ts/ANTLRErrorListener'

/**
 * emit errors for later access
 */
export class SyntaxErrorListener implements ANTLRErrorListener<never> {
  errors: Array<{
    recognizer: Recognizer<any, any>,
    offendingSymbol: any,
    line: number,
    charPositionInLine: any,
    msg: string,
    e: RecognitionException | undefined
  }> = [];

  public syntaxError<T>(
    recognizer: Recognizer<T, any>,
    offendingSymbol: T,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined): void {
    this.errors.push({ recognizer, offendingSymbol, line, charPositionInLine, msg, e });
  }

  public prettyPrint(title?: string) {
    console.log(title);
    console.log(this.errors.length > 0 ? this.errors : 'No errors.');
  }
}