import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";

export const testAjsParser = new AntlrAjsParser();

export const parseAjs = (content: string) => testAjsParser.parse(content);
