import Parameter from "./Parameter";
import { ParamInternal } from "./parameter.types";
import { parseScheduleDateValue } from "./scheduleRuleHelpers";

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
  _rule = 1;
  _yearMonth;
  _day;

  constructor(arg: ParamInternal) {
    super(arg);
    const parsed = parseScheduleDateValue(this.value());
    if (parsed) {
      this._rule = parsed.rule;
      this._yearMonth = parsed.yearMonth;
      this._day = parsed.day;
    }
  }
}

export default Day;
