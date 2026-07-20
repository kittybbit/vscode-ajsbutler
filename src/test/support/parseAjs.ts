import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import {
  AntlrRawAjsParser,
  RawParseAjsResult,
} from "../../infrastructure/parser/AntlrRawAjsParser";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";

export const testAjsParser = new AntlrAjsParser();
const testRawAjsParser = new AntlrRawAjsParser();

export const parseAjsDocumentForTest = (content: string): AjsDocument => {
  const result = testAjsParser.parse(content);
  if (result.ok === false) {
    throw new Error(
      `Test AJS definition failed to parse: ${result.errors.length} error(s)`,
    );
  }
  return result.document;
};

/** Internal raw access for parser, normalizer, and legacy-wrapper tests only. */
export const parseRawAjsForTest = (content: string): RawParseAjsResult =>
  testRawAjsParser.parse(content);
