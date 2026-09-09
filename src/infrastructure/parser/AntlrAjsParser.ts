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
      sourceIndexIdAllocator: SemanticDiffSourceIndexIdAllocator;
    }>,
  ) {
    this.#sourceIndexIds = options.sourceIndexIdAllocator;
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

const toParameterRange = (
  parameter: AjsRawUnit["parameters"][number],
  fallback: AjsRawSourceRange,
): AjsRawSourceRange => ({
  startLine: parameter.line ?? fallback.startLine,
  startColumn: parameter.column ?? fallback.startColumn,
  endLine: parameter.line ?? fallback.startLine,
  endColumn:
    (parameter.column ?? fallback.startColumn) +
    (parameter.length ?? parameter.key.length),
});

const toParameterOccurrence = (
  parameter: AjsRawUnit["parameters"][number],
  source: AjsRawSourceRange,
  occurrenceOrdinals: Map<string, number>,
): SemanticDiffSourceParameterOccurrence => {
  const ordinal = occurrenceOrdinals.get(parameter.key) ?? 0;
  occurrenceOrdinals.set(parameter.key, ordinal + 1);
  return {
    parameterKey: parameter.key,
    occurrenceOrdinal: ordinal,
    range: toRange(toParameterRange(parameter, source)),
  };
};

const freezePosition = (
  position: SemanticDiffSourceRange["start"],
): SemanticDiffSourceRange["start"] => Object.freeze({ ...position });

const freezeRange = (range: SemanticDiffSourceRange): SemanticDiffSourceRange =>
  Object.freeze({
    start: freezePosition(range.start),
    end: freezePosition(range.end),
  });

const freezeEntry = (
  entry: SemanticDiffSourceUnitEntry,
): SemanticDiffSourceUnitEntry =>
  Object.freeze({
    ...entry,
    headerRange: freezeRange(entry.headerRange),
    nameRange: entry.nameRange === null ? null : freezeRange(entry.nameRange),
    parameterOccurrences: Object.freeze(
      entry.parameterOccurrences.map((occurrence) =>
        Object.freeze({
          ...occurrence,
          range: freezeRange(occurrence.range),
        }),
      ),
    ),
  });

const buildUnitEntry = (
  unit: AjsRawUnit,
): SemanticDiffSourceUnitEntry | undefined => {
  const source = unit.source;
  if (source === undefined) return undefined;
  const occurrenceOrdinals = new Map<string, number>();
  return {
    unitId: unit.absolutePath(),
    headerRange: toRange(source.headerRange),
    nameRange: source.nameRange === null ? null : toRange(source.nameRange),
    parameterOccurrences: unit.parameters.map((parameter) =>
      toParameterOccurrence(parameter, source.headerRange, occurrenceOrdinals),
    ),
  };
};

const buildSourceIndex = (
  rootUnits: readonly AjsRawUnit[],
  sourceIndexId: SemanticDiffSourceIndex["sourceIndexId"],
): SemanticDiffSourceIndex => {
  const entries = flattenRawUnits(rootUnits)
    .map(buildUnitEntry)
    .filter(
      (entry): entry is SemanticDiffSourceUnitEntry => entry !== undefined,
    )
    .map(freezeEntry);
  return Object.freeze({
    sourceIndexId,
    unitEntries: Object.freeze(entries),
  });
};
