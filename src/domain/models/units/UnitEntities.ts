/** JP1/AJS3 unit entities  */

import { Unit } from '../../values/Unit';
import { ParamSymbol, TySymbols, TySymbol, isParamSymbol } from '../../values/AjsType';
import { tyFactory } from '../../utils/TyUtils';
import { ParamFactory } from '../parameters/ParameterFactory';
import { Ar } from '../parameters';
import Parameter from '../parameters/Parameter';
import xxhash from 'xxhash-wasm';

const { h64ToString } = await xxhash();

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
        this.#id = h64ToString(this.#absolutePath);
        this.#parent = parent;
        this.#children = this.#unit.children
            .map(v => {
                const child = tyFactory(v, this);
                if (child instanceof UnitEntity) {
                    return child;
                } else {
                    console.error(`Invalid child type: ${child}`);
                    return undefined;
                }
            }).filter((child): child is UnitEntity => child instanceof UnitEntity);
        this.#isRoot = unit.isRoot();
        this.#isRecovery = this.#isRecoveryFn();
        this.#defineParams = this.#defineParamsFn();
    }

    get absolutePath() { return this.#absolutePath; }
    get id() { return this.#id; }
    get unitAttribute() { return this.#unit.unitAttribute; }
    get parameters() { return this.#unit.parameters; }
    get parent() { return this.#parent; }
    get ancestors(): UnitEntity[] {
        if (!this.parent) {
            return [];
        }
        return [this.parent, ...this.parent.ancestors];
    }
    get children() { return this.#children; }
    get name() { return this.#unit.name; }
    get permission() { return this.#unit.permission; }
    get jp1Username() { return this.#unit.jp1Username; }
    get jp1ResourceGroup() { return this.#unit.jp1ResourceGroup; }

    /* ty={g|mg|n|rn|rm|rr|rc|mn|j|rj|pj|
     rp|qj|rq|jdj|rjdj|orj|rorj|evwj|
     revwj|flwj|rflwj|mlwj|rmlwj|mqwj|
     rmqwj|mswj|rmswj|lfwj|rlfwj|ntwj|
     rntwj|tmwj|rtmwj|evsj|revsj|mlsj|
     rmlsj|mqsj|rmqsj|mssj|rmssj|cmsj|
     rcmsj|pwlj|rpwlj|pwrj|rpwrj|cj|rcj|
     cpj|rcpj|fxj|rfxj|htpj|rhtpj|hln|nc}; */
    get ty() { return ParamFactory.ty(this); }
    // [cm="comment";] 
    get cm() { return ParamFactory.cm(this); }
    // [el=unit-name, unit-type, +H +V;]
    get el() { return ParamFactory.el(this) }
    // [sz=lateral-icon-count-times-longitudinal-icon-count;]
    get sz() { return ParamFactory.sz(this) }

    get isRoot() { return this.#isRoot; }
    get previous() {
        return (this.parent?.params<Ar[] | undefined>('ar') ?? [])
            .filter(ar => ar.t === this.name);
    }
    get previousUnits() {
        return this.previous.map(p => {
            return {
                unitEntity: this.#parent?.children.find(child => child.name === p.f),
                relationType: p.relationType
            }
        });
    }
    get next() {
        return (this.parent?.params<Ar[] | undefined>('ar') ?? [])
            .filter(ar => ar.f === this.name);
    }
    get nextUnits() {
        return this.next.map(n => {
            return {
                unitEntity: this.#parent?.children.find(child => child.name === n.t),
                relationType: n.relationType
            }
        });
    }
    /**
     * H=80＋160x -> x=(H-80)/160  
     * V=48＋96y -> y=(V-48)/96
     */
    get hv() {
        const el = this.#getMyElFn();
        return el && el.hv
            ? (() => {
                const [h, v] = el.hv.split('+')
                    .filter(v => v !== '');
                return { h: Number(h), v: Number(v) }
            })()
            : { h: 0, v: 0 };
    }
    /** key of unit difinition parameters */
    get isRecovery() { return this.#isRecovery }
    get defineParams() { return this.#defineParams }
    get depth(): number {
        if (this.parent) {
            return this.parent.depth + 1;
        }
        return 0;
    }

    /** my el paramater */
    #getMyElFn() {
        return this.parent?.el?.find(el => el.name === this.name);
    }
    #isRecoveryFn() {
        // There is no concept of recovery.
        const excludes: TySymbol[] = ['g', 'mg', 'rc', 'mn', 'nc'];
        if (excludes.includes(this.ty.value())) {
            return undefined;
        }

        return TySymbols
            .filter(ty => ty.charAt(0) === 'r')
            .filter(r => !['rm'].includes(r))
            .includes(this.ty.value())
            ? true
            : false;
    }
    #defineParamsFn(): ParamSymbol[] {
        let proto = Object.getPrototypeOf(this);
        let params: string[] = [];
        while (proto && proto.constructor.name !== 'Object') {
            params = params.concat(Object.getOwnPropertyNames(proto));
            proto = Object.getPrototypeOf(proto);
        }
        return params
            .filter(v => isParamSymbol(v))
            .sort();
    }

    /** Specified parameters in unit definitions */
    params<T>(param: ParamSymbol): T | undefined {
        const value = this[param as keyof typeof this];
        if (value instanceof Parameter || Array.isArray(value) || value === undefined) {
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
            parent: this.parent?.name ?? '',
            depth: this.depth,
            params: this.defineParams
                .map(v => this.params<Parameter | Parameter[] | undefined>(v))
                .filter(p => p)
                .map(p => {
                    if (Array.isArray(p)) {
                        return p
                            .filter(q => q instanceof Parameter)
                            .map(q => q.prettyJSON());
                    } else if (p instanceof Parameter) {
                        return p.prettyJSON();
                    } else {
                        return undefined; // not here
                    }
                })
                .filter(p => p !== undefined),
        };
    }
}
