import type { Unit } from "../../domain/values/Unit";

export type AjsParserError = {
  line: number;
  column: number;
  message: string;
};

export type ParseAjsResult = {
  rootUnits: Unit[];
  errors: AjsParserError[];
};

export interface AjsParserPort {
  parse(content: string): ParseAjsResult;
}
