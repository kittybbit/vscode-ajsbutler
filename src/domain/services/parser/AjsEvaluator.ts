import { AjsParserListener } from "@generate/parser/AjsParserListener";
import { UnitAttributeContext, UnitDefinitionContext, UnitParameterContext } from "@generate/parser/AjsParser";
import { Unit } from "../../values/Unit";

export class Ajs3v12Evaluator implements AjsParserListener {

    /** parsed definition */
    #units: Array<Unit>;

    /** parsing context */
    #unitStack: Array<Unit> = [];

    /** current unit object */
    #currentUnit?: Unit;

    constructor(units: Array<Unit>) {
        this.#units = units;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exitUnitDefinition = (ctx: UnitDefinitionContext) => {
        this.#unitStack.pop();
        this.#currentUnit = this.#unitStack[this.#unitStack.length - 1];
    }

    enterUnitAttribute = (ctx: UnitAttributeContext) => {
        const newUnit = new Unit(ctx._value.text as string, this.#currentUnit);
        this.#currentUnit?.children.push(newUnit);
        this.#currentUnit = newUnit;
        this.#unitStack.push(newUnit);
        this.#units.push(newUnit);
    }

    enterUnitParameter = (ctx: UnitParameterContext) => {
        this.#currentUnit?.parameters.push({
            'key': ctx._key.text as string,
            'value': ctx._value.text as string
        });
    }

    visitTerminal = () => { /* noop */ }
    visitErrorNode = () => { /* noop */ }
    enterEveryRule = () => { /* noop */ }
    exitEveryRule = () => { /* noop */ }
}