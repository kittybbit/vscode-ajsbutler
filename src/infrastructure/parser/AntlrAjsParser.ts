import type {
  AjsParserError,
  AjsParserPort,
  ParseAjsResult,
} from "../../application/parsing/AjsParserPort";
import type {
  ParseAjsWithSourceIndexResult,
  SemanticDiffSourceIndex,
  SemanticDiffSourceIndexIdAllocator,
  SemanticDiffSourceParameterOccurrence,
  SemanticDiffSourceRange,
  SemanticDiffSourceUnitEntry,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import { createSemanticDiffSourceIndexIdAllocator } from "../../application/parsing/AjsParserWithSourceIndexPort";
import { AntlrRawAjsParser } from "./AntlrRawAjsParser";
import type { AntlrSyntaxError } from "./AntlrSyntaxError";
import type { AjsRawSourceRange, AjsRawUnit } from "./raw/AjsRawUnit";
import { normalizeAjsDocument } from "./normalization/normalizeAjsDocument";

const toAjsParserError = ({
  charPositionInLine,
  line,
  msg,
}: AntlrSyntaxError): AjsParserError => ({
  line,
  column: charPositionInLine,
  message: msg,
});

export class AntlrAjsParser implements AjsParserPort {
  readonly #rawParser = new AntlrRawAjsParser();
  readonly #sourceIndexIds: SemanticDiffSourceIndexIdAllocator;

  public constructor(
    options: Readonly<{
      sourceIndexIdAllocator?: SemanticDiffSourceIndexIdAllocator;
    }> = {},
  ) {
    this.#sourceIndexIds =
      options.sourceIndexIdAllocator ??
      createSemanticDiffSourceIndexIdAllocator();
  }

  public parse(content: string): ParseAjsResult {
    const result = this.#rawParser.parse(content);
    if (result.errors.length > 0) {
      return { ok: false, errors: result.errors.map(toAjsParserError) };
    }
    return {
      ok: true,
      document: normalizeAjsDocument(result.rootUnits),
    };
  }

  public parseWithSourceIndex(content: string): ParseAjsWithSourceIndexResult {
    const result = this.#rawParser.parse(content);
    if (result.errors.length > 0) {
      return { ok: false, errors: result.errors.map(toAjsParserError) };
    }
    const document = normalizeAjsDocument(result.rootUnits);
    return {
      ok: true,
      document,
      sourceIndex: buildSourceIndex(result.rootUnits, this.#sourceIndexIds()),
    };
  }
}

const toPosition = (line: number, character: number) => ({
  line: Math.max(0, line - 1),
  character: Math.max(0, character),
});

const toRange = (range: AjsRawSourceRange): SemanticDiffSourceRange => ({
  start: toPosition(range.startLine, range.startColumn),
  end: toPosition(range.endLine, range.endColumn),
});

const flattenRawUnits = (units: readonly AjsRawUnit[]): AjsRawUnit[] =>
  units.flatMap((unit) => [unit, ...flattenRawUnits(unit.children)]);

const buildSourceIndex = (
  rootUnits: readonly AjsRawUnit[],
  sourceIndexId: SemanticDiffSourceIndex["sourceIndexId"],
): SemanticDiffSourceIndex => {
  const unitEntries: SemanticDiffSourceUnitEntry[] = [];
  flattenRawUnits(rootUnits).forEach((unit) => {
    const source = unit.source;
    if (source === undefined) return;
    const occurrenceOrdinals = new Map<string, number>();
    const parameterOccurrences: SemanticDiffSourceParameterOccurrence[] =
      unit.parameters.map((parameter) => {
        const ordinal = occurrenceOrdinals.get(parameter.key) ?? 0;
        occurrenceOrdinals.set(parameter.key, ordinal + 1);
        return {
          parameterKey: parameter.key,
          occurrenceOrdinal: ordinal,
          range: toRange({
            startLine: parameter.line ?? source.headerRange.startLine,
            startColumn: parameter.column ?? source.headerRange.startColumn,
            endLine: parameter.line ?? source.headerRange.startLine,
            endColumn:
              (parameter.column ?? source.headerRange.startColumn) +
              (parameter.length ?? parameter.key.length),
          }),
        };
      });
    unitEntries.push({
      unitId: unit.absolutePath(),
      headerRange: toRange(source.headerRange),
      nameRange: source.nameRange === null ? null : toRange(source.nameRange),
      parameterOccurrences,
    });
  });
  const frozenEntries = unitEntries.map((entry) =>
    Object.freeze({
      ...entry,
      headerRange: Object.freeze({
        start: Object.freeze({ ...entry.headerRange.start }),
        end: Object.freeze({ ...entry.headerRange.end }),
      }),
      nameRange:
        entry.nameRange === null
          ? null
          : Object.freeze({
              start: Object.freeze({ ...entry.nameRange.start }),
              end: Object.freeze({ ...entry.nameRange.end }),
            }),
      parameterOccurrences: Object.freeze(
        entry.parameterOccurrences.map((occurrence) =>
          Object.freeze({
            ...occurrence,
            range: Object.freeze({
              start: Object.freeze({ ...occurrence.range.start }),
              end: Object.freeze({ ...occurrence.range.end }),
            }),
          }),
        ),
      ),
    }),
  );
  return Object.freeze({
    sourceIndexId,
    unitEntries: Object.freeze(frozenEntries),
  });
};
