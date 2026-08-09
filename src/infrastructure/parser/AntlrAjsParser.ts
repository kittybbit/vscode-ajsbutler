import type {
  AjsParserError,
  AjsParserPort,
  ParseAjsResult,
} from "../../application/parsing/AjsParserPort";
import { AntlrRawAjsParser } from "./AntlrRawAjsParser";
import type { AntlrSyntaxError } from "./AntlrSyntaxError";
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
}
