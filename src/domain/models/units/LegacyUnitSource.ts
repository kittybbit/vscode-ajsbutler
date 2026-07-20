/**
 * Minimal source shape consumed by the transitional legacy unit wrappers.
 *
 * This is not an application parser contract. It exists only to keep the
 * wrapper graph independent of the concrete raw parser unit type while that
 * graph remains during the normalized-domain migration.
 */
export type LegacyUnitSource = {
  unitAttribute: string;
  parameters: Array<{
    key: string;
    value: string;
    position?: number;
    line?: number;
    column?: number;
    length?: number;
  }>;
  children: LegacyUnitSource[];
  readonly name: string;
  readonly permission: string | undefined;
  readonly jp1Username: string | undefined;
  readonly jp1ResourceGroup: string | undefined;
  absolutePath(): string;
  isRoot(): boolean;
};
