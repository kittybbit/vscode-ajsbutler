/** JP1/AJS3 unit entities  */

import { Unit } from "../../values/Unit";
import { ParamSymbol, isParamSymbol } from "../../values/AjsType";
import { tyFactory } from "../../utils/TyUtils";
import { ParamFactory } from "../parameters/ParameterFactory";
import Parameter from "../parameters/Parameter";
import {
  findNextRelations,
  findNextUnits,
  findPreviousRelations,
  findPreviousUnits,
} from "./unitRelationHelpers";
import { resolveUnitLayout } from "./unitLayoutHelpers";
import { resolveIsRecovery } from "./unitTypeHelpers";

const hashToString = (value: string): string => {
  // Use a deterministic sync hash so this module works under CommonJS test compilation.
  let hash = BigInt("0xcbf29ce484222325");
  const prime = BigInt("0x100000001b3");

  for (const char of value) {
    hash ^= BigInt(char.codePointAt(0) ?? 0);
    hash = BigInt.asUintN(64, hash * prime);
  }

  return hash.toString(16).padStart(16, "0");
};

/** abstract class of unit unit for decorator */
export abstract class UnitEntity {
  /** raw unit */
  readonly #unit: Unit;

  /** attributes */
  #id: string;
  #absolutePath: string;
  #isRoot: boolean;
  #parent?: UnitEntity;
  #children: UnitEntity[];
  #isRecovery?: boolean;
  #defineParams: ParamSymbol[];

  constructor(unit: Unit, parent?: UnitEntity) {
    this.#unit = unit;
    this.#absolutePath = unit.absolutePath();
    this.#id = hashToString(this.#absolutePath);
    this.#parent = parent;
    this.#children = this.#unit.children
      .map((v) => {
        const child = tyFactory(v, this);
        if (child instanceof UnitEntity) {
          return child;
        } else {
          console.error(`Invalid child type: ${child}`);
          return undefined;
        }
      })
      .filter((child): child is UnitEntity => child instanceof UnitEntity);
    this.#isRoot = unit.isRoot();
    this.#isRecovery = resolveIsRecovery(this.ty.value());
    this.#defineParams = this.#defineParamsFn();
  }

  get absolutePath() {
    return this.#absolutePath;
  }
  get id() {
    return this.#id;
  }
  get unitAttribute() {
    return this.#unit.unitAttribute;
  }
  get parameters() {
    return this.#unit.parameters;
  }
  get parent() {
    return this.#parent;
  }
  get ancestors(): UnitEntity[] {
    if (!this.parent) {
      return [];
    }
    return [this.parent, ...this.parent.ancestors];
  }
  get children() {
    return this.#children;
  }
  get name() {
    return this.#unit.name;
  }
  get permission() {
    return this.#unit.permission;
  }
  get jp1Username() {
    return this.#unit.jp1Username;
  }
  get jp1ResourceGroup() {
    return this.#unit.jp1ResourceGroup;
  }

  /* ty={g|mg|n|rn|rm|rr|rc|mn|j|rj|pj|
     rp|qj|rq|jdj|rjdj|orj|rorj|evwj|
     revwj|flwj|rflwj|mlwj|rmlwj|mqwj|
     rmqwj|mswj|rmswj|lfwj|rlfwj|ntwj|
     rntwj|tmwj|rtmwj|evsj|revsj|mlsj|
     rmlsj|mqsj|rmqsj|mssj|rmssj|cmsj|
     rcmsj|pwlj|rpwlj|pwrj|rpwrj|cj|rcj|
     cpj|rcpj|fxj|rfxj|htpj|rhtpj|hln|nc}; */
  get ty() {
    return ParamFactory.ty(this);
  }
  // [cm="comment";]
  get cm() {
    return ParamFactory.cm(this);
  }
  // [el=unit-name, unit-type, +H +V;]
  get el() {
    return ParamFactory.el(this);
  }
  // [sz=lateral-icon-count-times-longitudinal-icon-count;]
  get sz() {
    return ParamFactory.sz(this);
  }

  get isRoot() {
    return this.#isRoot;
  }
  get previous() {
    return findPreviousRelations(this);
  }
  get previousUnits() {
    return findPreviousUnits(this);
  }
  get next() {
    return findNextRelations(this);
  }
  get nextUnits() {
    return findNextUnits(this);
  }
  /**
   * H=80＋160x -> x=(H-80)/160
   * V=48＋96y -> y=(V-48)/96
   */
  get hv() {
    return resolveUnitLayout(
      this.name,
      (this.parent?.el ?? [])
        .map((el) => el.value())
        .filter((value): value is string => value !== undefined),
    );
  }
  /** key of unit difinition parameters */
  get isRecovery() {
    return this.#isRecovery;
  }
  get defineParams() {
    return this.#defineParams;
  }
  get depth(): number {
    if (this.parent) {
      return this.parent.depth + 1;
    }
    return 0;
  }
  #defineParamsFn(): ParamSymbol[] {
    let proto = Object.getPrototypeOf(this);
    let params: string[] = [];
    while (proto && proto.constructor.name !== "Object") {
      params = params.concat(Object.getOwnPropertyNames(proto));
      proto = Object.getPrototypeOf(proto);
    }
    return params.filter((v) => isParamSymbol(v)).sort();
  }

  /** Specified parameters in unit definitions */
  params<T>(param: ParamSymbol): T | undefined {
    const value = this[param as keyof typeof this];
    if (
      value instanceof Parameter ||
      Array.isArray(value) ||
      value === undefined
    ) {
      return value as T;
    } else {
      console.error(`Invalid parameter type for ${param}`);
      return undefined;
    }
  }

  /** human readable json */
  prettyJSON() {
    return {
      id: this.id,
      path: this.absolutePath,
      ty: this.ty.value(),
      cm: this.cm?.value(),
      parent: this.parent?.name ?? "",
      depth: this.depth,
      params: this.defineParams
        .map((v) => this.params<Parameter | Parameter[] | undefined>(v))
        .filter((p) => p)
        .map((p) => {
          if (Array.isArray(p)) {
            return p
              .filter((q) => q instanceof Parameter)
              .map((q) => q.prettyJSON());
          } else if (p instanceof Parameter) {
            return p.prettyJSON();
          } else {
            return undefined; // not here
          }
        })
        .filter((p) => p !== undefined),
    };
  }
}
