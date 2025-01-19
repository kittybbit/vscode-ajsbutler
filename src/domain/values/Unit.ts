/**
 * raw object of unit
 */
export class Unit {

    /** unit attribute parameter */
    unitAttribute: string;

    /** definition parameters */
    parameters: Array<{ key: string, value: string }>;

    /** parent */
    parent?: Unit;

    /** children (el parameters) */
    children: Array<Unit>;

    constructor(unitAttribute: string, parent?: Unit) {
        this.unitAttribute = unitAttribute;
        this.parent = parent;
        this.parameters = [];
        this.children = [];
    }

    get name(): string {
        return this.unitAttribute.split(',')[0];
    }

    get permission(): string | undefined {
        const attributes: string[] = this.unitAttribute.split(',');
        return attributes.length >= 2 ? attributes[1] : undefined;
    }

    get jp1Username(): string | undefined {
        const attributes: string[] = this.unitAttribute.split(',');
        return attributes.length >= 3 ? attributes[2] : undefined;
    }

    get jp1ResourceGroup(): string | undefined {
        const attributes: string[] = this.unitAttribute.split(',');
        return attributes.length >= 4 ? attributes[3] : undefined;
    }

    /** whether root definition or not */
    isRoot(): boolean {
        return !this.parent;
    }

    absolutePath(): string {
        return this.isRoot() ? `/${this.name}` : `${this.parent?.absolutePath()}/${this.name}`;
    }

    /** Create a Unit instance from a JSON object. */
    static createFromJSON(rootUnitOfJSON: Unit): Unit {
        if (rootUnitOfJSON.parent) {
            throw new Error(`This unit is not root unit. (${rootUnitOfJSON.unitAttribute})`);
        }
        const rootUnit = Object.assign(new Unit(rootUnitOfJSON.unitAttribute), rootUnitOfJSON);
        rootUnit.children = rootUnitOfJSON.children.map(child => this.#createFromJSON(child, rootUnit));
        return rootUnit;
    }

    static #createFromJSON(unitOfJSON: Unit, parent: Unit): Unit {
        const childUnit = Object.assign(new Unit(unitOfJSON.unitAttribute), unitOfJSON);
        childUnit.parent = parent;
        childUnit.children = unitOfJSON.children.map(v => this.#createFromJSON(v, childUnit));
        return childUnit;
    }
}