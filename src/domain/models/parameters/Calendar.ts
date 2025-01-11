import { isWeekSymbol } from "../../values/AjsType";
import Parameter from "./Parameter";

class Calendar extends Parameter {
    /** cache */
    #cachedParsedValue: string | undefined;

    /** parse and cache */
    #getParsedValue(): string | undefined {
        if (!this.#cachedParsedValue) {
            const value = this.value();
            this.#cachedParsedValue = value ? value.split(':')[0] : undefined;
        }
        return this.#cachedParsedValue;
    }

    #getWeekSymbol(): string | undefined {
        return this.#getParsedValue();
    }

    get su(): boolean {
        return this.#getWeekSymbol() === 'su';
    }

    get mo(): boolean {
        return this.#getWeekSymbol() === 'mo';
    }

    get tu(): boolean {
        return this.#getWeekSymbol() === 'tu';
    }

    get we(): boolean {
        return this.#getWeekSymbol() === 'we';
    }

    get th(): boolean {
        return this.#getWeekSymbol() === 'th';
    }

    get fr(): boolean {
        return this.#getWeekSymbol() === 'fr';
    }

    get sa(): boolean {
        return this.#getWeekSymbol() === 'sa';
    }

    get isWeek(): boolean {
        return isWeekSymbol(this.#getWeekSymbol());
    }

    get weekOfTheMonth(): number | undefined {
        const weekNumber = this.#getParsedValue()?.[1];
        return weekNumber !== undefined ? Number(weekNumber) : undefined;
    }
}

export class Cl extends Calendar { }
export class Op extends Calendar { }
export class Sdd extends Calendar { }