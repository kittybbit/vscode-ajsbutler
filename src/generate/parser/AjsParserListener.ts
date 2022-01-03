// Generated from src/antlr/AjsParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { UnitDefinitionFileContext } from "./AjsParser";
import { UnitDefinitionContext } from "./AjsParser";
import { UnitAttributeContext } from "./AjsParser";
import { UnitDefinitionBodyContext } from "./AjsParser";
import { UnitParameterContext } from "./AjsParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `AjsParser`.
 */
export interface AjsParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `AjsParser.unitDefinitionFile`.
	 * @param ctx the parse tree
	 */
	enterUnitDefinitionFile?: (ctx: UnitDefinitionFileContext) => void;
	/**
	 * Exit a parse tree produced by `AjsParser.unitDefinitionFile`.
	 * @param ctx the parse tree
	 */
	exitUnitDefinitionFile?: (ctx: UnitDefinitionFileContext) => void;

	/**
	 * Enter a parse tree produced by `AjsParser.unitDefinition`.
	 * @param ctx the parse tree
	 */
	enterUnitDefinition?: (ctx: UnitDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `AjsParser.unitDefinition`.
	 * @param ctx the parse tree
	 */
	exitUnitDefinition?: (ctx: UnitDefinitionContext) => void;

	/**
	 * Enter a parse tree produced by `AjsParser.unitAttribute`.
	 * @param ctx the parse tree
	 */
	enterUnitAttribute?: (ctx: UnitAttributeContext) => void;
	/**
	 * Exit a parse tree produced by `AjsParser.unitAttribute`.
	 * @param ctx the parse tree
	 */
	exitUnitAttribute?: (ctx: UnitAttributeContext) => void;

	/**
	 * Enter a parse tree produced by `AjsParser.unitDefinitionBody`.
	 * @param ctx the parse tree
	 */
	enterUnitDefinitionBody?: (ctx: UnitDefinitionBodyContext) => void;
	/**
	 * Exit a parse tree produced by `AjsParser.unitDefinitionBody`.
	 * @param ctx the parse tree
	 */
	exitUnitDefinitionBody?: (ctx: UnitDefinitionBodyContext) => void;

	/**
	 * Enter a parse tree produced by `AjsParser.unitParameter`.
	 * @param ctx the parse tree
	 */
	enterUnitParameter?: (ctx: UnitParameterContext) => void;
	/**
	 * Exit a parse tree produced by `AjsParser.unitParameter`.
	 * @param ctx the parse tree
	 */
	exitUnitParameter?: (ctx: UnitParameterContext) => void;
}

