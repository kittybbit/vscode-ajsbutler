import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { AntlrRawAjsParser } from "../../infrastructure/parser/AntlrRawAjsParser";

export const testAjsParser = new AntlrAjsParser();
const testRawAjsParser = new AntlrRawAjsParser();

// Temporary raw compatibility helper. Slice 3 classifies and migrates callers.
export const parseAjs = (content: string) => testRawAjsParser.parse(content);
