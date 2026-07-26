import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";

export type AjsParserError = {
  line: number;
  column: number;
  message: string;
};

export type ParseAjsResult =
  | {
      ok: true;
      document: AjsDocument;
    }
  | {
      ok: false;
      errors: AjsParserError[];
    };

export interface AjsParserPort {
  parse(content: string): ParseAjsResult;
}
