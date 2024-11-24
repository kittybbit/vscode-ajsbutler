import Parameter from "./Parameter";
import { ParamInternal } from "./parameter.types";

class Day extends Parameter {
    /**
     * [N,]                                      ((\d{1,3}),)?
     * {
     *   [                                       (
     *     [yyyy/]mm/                            (\d{4}\/)?\d{2}\/
     *   ]                                       )?
     *   {                                       (
     *     [+|*|@]dd                             ([+|*|@])?\d{2}
     *     |[+|*|@]b[-DD]                        ([+|*|@])?b(-\d{2})?
     *     |[+]{su|mo|tu|we|th|fr|sa} [:{n|b}]   [+]?(su|mo|tu|we|th|fr|sa)(:(\d|b))?
     *   }|en|ud                                 )
     * }
     */
    #pattern = /^((\d{1,3}),)?((\d{4}\/)?\d{2}\/)?(([+|*|@])?\d{2}|([+|*|@])?b(-\d{2})?|[+]?(su|mo|tu|we|th|fr|sa)(:(\d|b))?|en|ud)/;
    _re;
    _rule = -1;
    _yearMonth;
    _day;

    constructor(arg: ParamInternal) {
        super(arg);
        this._re = this.#pattern.exec(this.value() ?? '');
        const re = this._re;
        if (re) {
            this._rule = Number(re[2]);
            this._yearMonth = re[3];
            this._day = re[5];
        }
    }
}

export default Day;