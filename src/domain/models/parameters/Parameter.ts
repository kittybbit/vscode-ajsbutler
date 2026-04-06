import { ParamSymbol } from "../../values/AjsType";
import { UnitEntity } from "../units/UnitEntity";
import { ParamInternal } from "./parameter.types";

abstract class Parameter {
  #unit: UnitEntity;
  #parameter: ParamSymbol;
  #rawValue?: string;
  #defaultRawValue?: string;
  #inherited = false;
  #position: number;
  /**
   * constructor
   * @param {ParamInternal}
   */
  constructor(arg: ParamInternal) {
    this.#unit = arg.unit;
    this.#parameter = arg.parameter;
    this.#rawValue = arg.rawValue;
    this.#defaultRawValue = arg.defaultRawValue;
    this.#position = arg.position;
  }
  get rawValue(): string | undefined {
    return this.#rawValue;
  }
  get defaultRawValue(): string | undefined {
    return this.#defaultRawValue;
  }
  get unit(): UnitEntity {
    return this.#unit;
  }
  get parameter(): ParamSymbol {
    return this.#parameter;
  }
  get inherited(): boolean {
    return this.#inherited;
  }
  get isDefault(): boolean {
    return !this.#rawValue;
  }
  get position(): number {
    return this.#position;
  }
  /** The raw value actually utilized in JP1/AJS */
  value(): string | undefined {
    return this.#rawValue ?? this.#defaultRawValue;
  }
}

export default Parameter;
