import { AjsParserListener } from "@generate/parser/AjsParserListener";
import {
  UnitAttributeContext,
  UnitDefinitionContext,
  UnitParameterContext,
} from "@generate/parser/AjsParser";
import { AjsRawUnit } from "./raw/AjsRawUnit";

const tokenEnd = (token: {
  line: number;
  charPositionInLine: number;
  text?: string;
}) => ({
  line: token.line,
  column: token.charPositionInLine + (token.text?.length ?? 0),
});

export class Ajs3v12Evaluator implements AjsParserListener {
  /** parsed definition */
  #allUnits: Array<AjsRawUnit> = [];

  /** parsing context */
  #unitStack: Array<AjsRawUnit> = [];

  /** current unit object */
  #currentUnit?: AjsRawUnit;

  get allUnits() {
    return this.#allUnits;
  }

  get rootUnits() {
    if (this.#allUnits.length === 0) {
      return [];
    }
    return this.#allUnits.filter((unit) => unit.parent === undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exitUnitDefinition = (ctx: UnitDefinitionContext) => {
    this.#unitStack.pop();
    this.#currentUnit = this.#unitStack[this.#unitStack.length - 1];
  };

  enterUnitAttribute = (ctx: UnitAttributeContext) => {
    const key = ctx._key;
    const value = ctx._value;
    const newUnit = new AjsRawUnit(value?.text ?? "", this.#currentUnit);
    const semi = ctx.SEMI()?.symbol;
    if (key !== undefined && value !== undefined && semi !== undefined) {
      const headerStart = {
        line: key.line,
        column: key.charPositionInLine,
      };
      const headerEnd = tokenEnd(semi);
      const valueStart = {
        line: value.line,
        column: value.charPositionInLine,
      };
      const valueText = value.text ?? "";
      const nameLength = Math.max(
        0,
        valueText.indexOf(",") < 0 ? valueText.length : valueText.indexOf(","),
      );
      newUnit.source = {
        headerRange: {
          startLine: headerStart.line,
          startColumn: headerStart.column,
          endLine: headerEnd.line,
          endColumn: headerEnd.column,
        },
        nameRange: {
          startLine: valueStart.line,
          startColumn: valueStart.column,
          endLine: valueStart.line,
          endColumn: valueStart.column + nameLength,
        },
      };
    }
    this.#currentUnit?.children.push(newUnit);
    this.#currentUnit = newUnit;
    this.#unitStack.push(newUnit);
    this.#allUnits.push(newUnit);
  };

  enterUnitParameter = (ctx: UnitParameterContext) => {
    const key = ctx._key?.text;
    const value = ctx._value?.text;
    if (key === undefined || value === undefined) return;
    this.#currentUnit?.parameters.push({
      key,
      value,
      position: this.#currentUnit.parameters.length,
      line: ctx._key.line,
      column: ctx._key.charPositionInLine,
      length: key.length,
    });
  };

  visitTerminal = () => {
    /* noop */
  };
  visitErrorNode = () => {
    /* noop */
  };
  enterEveryRule = () => {
    /* noop */
  };
  exitEveryRule = () => {
    /* noop */
  };
}
