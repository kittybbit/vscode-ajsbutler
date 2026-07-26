export type AjsRawUnitParameter = {
  key: string;
  value: string;
  position?: number;
  line?: number;
  column?: number;
  length?: number;
};

/**
 * raw object of unit
 */
export class AjsRawUnit {
  /** unit attribute parameter */
  unitAttribute: string;

  /** definition parameters */
  parameters: AjsRawUnitParameter[];

  /** parent */
  parent?: AjsRawUnit;

  /** children (el parameters) */
  children: Array<AjsRawUnit>;

  constructor(unitAttribute: string, parent?: AjsRawUnit) {
    this.unitAttribute = unitAttribute;
    this.parent = parent;
    this.parameters = [];
    this.children = [];
  }

  get name(): string {
    return this.unitAttribute.split(",")[0];
  }

  get permission(): string | undefined {
    const attributes: string[] = this.unitAttribute.split(",");
    return attributes.length >= 2 ? attributes[1] : undefined;
  }

  get jp1Username(): string | undefined {
    const attributes: string[] = this.unitAttribute.split(",");
    return attributes.length >= 3 ? attributes[2] : undefined;
  }

  get jp1ResourceGroup(): string | undefined {
    const attributes: string[] = this.unitAttribute.split(",");
    return attributes.length >= 4 ? attributes[3] : undefined;
  }

  /** whether root definition or not */
  isRoot(): boolean {
    return !this.parent;
  }

  absolutePath(): string {
    return this.isRoot()
      ? `/${this.name}`
      : `${this.parent?.absolutePath()}/${this.name}`;
  }
}
