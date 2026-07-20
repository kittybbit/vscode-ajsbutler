import type {
  AjsParserPort,
  ParseAjsResult,
} from "../../application/parsing/AjsParserPort";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { AntlrRawAjsParser } from "./AntlrRawAjsParser";

export class AntlrAjsParser implements AjsParserPort {
  readonly #rawParser = new AntlrRawAjsParser();

  public parse(content: string): ParseAjsResult {
    const result = this.#rawParser.parse(content);
    if (result.errors.length > 0) {
      return { ok: false, errors: result.errors };
    }
    return {
      ok: true,
      document: normalizeAjsDocument(result.rootUnits),
    };
  }
}
