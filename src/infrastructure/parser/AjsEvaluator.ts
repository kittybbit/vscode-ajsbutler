import { AjsParserListener } from "@generate/parser/AjsParserListener";
import {
  UnitAttributeContext,
  UnitDefinitionContext,
  UnitParameterContext,
} from "@generate/parser/AjsParser";
import { AjsRawUnit } from "./raw/AjsRawUnit";

const recordSupplementaryColumn = (
  columnsByLine: Map<number, number[]>,
  line: number,
  column: number,
): void => {
  const columns = columnsByLine.get(line) ?? [];
  columns.push(column);
  columnsByLine.set(line, columns);
};

type SourceScanPosition = { line: number; column: number };

const advanceSourceScanPosition = (
  position: SourceScanPosition,
  character: string,
): void => {
  position.column += 1;
  if (character === "\n") {
    position.line += 1;
    position.column = 0;
  }
};

const recordSourceCharacter = (
  columnsByLine: Map<number, number[]>,
  position: SourceScanPosition,
  character: string,
): void => {
  if (character.length === 2) {
    recordSupplementaryColumn(columnsByLine, position.line, position.column);
  }
  advanceSourceScanPosition(position, character);
};

const collectSupplementaryColumns = (
  content: string,
): ReadonlyMap<number, readonly number[]> => {
  const columnsByLine = new Map<number, number[]>();
  const position: SourceScanPosition = { line: 1, column: 0 };
  for (const character of content) {
    recordSourceCharacter(columnsByLine, position, character);
  }
  return columnsByLine;
};

export class Ajs3v12Evaluator implements AjsParserListener {
  /** parsed definition */
  #allUnits: Array<AjsRawUnit> = [];

  /** parsing context */
  #unitStack: Array<AjsRawUnit> = [];

  /** current unit object */
  #currentUnit?: AjsRawUnit;

  readonly #supplementaryColumns: ReadonlyMap<number, readonly number[]>;

  public constructor(content: string) {
    this.#supplementaryColumns = collectSupplementaryColumns(content);
  }

  #utf16Column(line: number, column: number): number {
    const supplementary = this.#supplementaryColumns.get(line) ?? [];
    let lower = 0;
    let upper = supplementary.length;
    while (lower < upper) {
      const middle = Math.floor((lower + upper) / 2);
      if (supplementary[middle]! < column) {
        lower = middle + 1;
      } else {
        upper = middle;
      }
    }
    return column + lower;
  }

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
        column: this.#utf16Column(key.line, key.charPositionInLine),
      };
      const headerEnd = {
        line: semi.line,
        column:
          this.#utf16Column(semi.line, semi.charPositionInLine) +
          (semi.text?.length ?? 0),
      };
      const valueStart = {
        line: value.line,
        column: this.#utf16Column(value.line, value.charPositionInLine),
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
      column: this.#utf16Column(ctx._key.line, ctx._key.charPositionInLine),
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
