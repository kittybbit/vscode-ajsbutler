import {
  AjsDocument,
  AjsUnit,
  AjsUnitType,
  findAjsUnitParameter,
  findParentAjsUnit,
} from "../../domain/models/ajs/AjsDocument";

const niPriorityThresholds: readonly {
  matches: (nice: number) => boolean;
  priority: number;
}[] = [
  { matches: (nice) => nice > 10, priority: 5 },
  { matches: (nice) => nice > 0, priority: 4 },
  { matches: (nice) => nice === 0, priority: 3 },
  { matches: (nice) => nice > -11, priority: 2 },
];

const toNiPriority = (value: string): number => {
  const nice = Number(value);
  return (
    niPriorityThresholds.find(({ matches }) => matches(nice))?.priority ?? 1
  );
};

const parentPriorityUnitTypes: readonly AjsUnitType[] = ["n", "rn"];

type ExplicitPriority = {
  priority: number;
  position: number;
};

type ParentPriorityInput = {
  document: AjsDocument;
  unit: AjsUnit;
  priorityById: Map<string, number>;
};

type PriorityForUnitTypesInput = ParentPriorityInput & {
  targetUnitTypes: readonly AjsUnitType[];
};

const cachePriority = (
  priorityById: Map<string, number>,
  unitId: string,
  priority: number,
) => {
  priorityById.set(unitId, priority);
  return priority;
};

const explicitPrPriority = (unit: AjsUnit): ExplicitPriority | undefined => {
  const pr = findAjsUnitParameter(unit, "pr");
  return pr?.value !== undefined && pr.value !== ""
    ? { priority: Number(pr.value), position: pr.position ?? -1 }
    : undefined;
};

const explicitNiPriority = (unit: AjsUnit): ExplicitPriority | undefined => {
  const ni = findAjsUnitParameter(unit, "ni");
  return ni
    ? { priority: toNiPriority(ni.value), position: ni.position ?? -1 }
    : undefined;
};

const laterExplicitPriority = (
  pr: ExplicitPriority,
  ni: ExplicitPriority,
): number => (pr.position > ni.position ? pr.priority : ni.priority);

const resolveExplicitPriority = (unit: AjsUnit): number | undefined => {
  const pr = explicitPrPriority(unit);
  const ni = explicitNiPriority(unit);

  return pr && ni
    ? laterExplicitPriority(pr, ni)
    : (pr?.priority ?? ni?.priority);
};

const isParentPrioritySource = (unit: AjsUnit): boolean =>
  parentPriorityUnitTypes.includes(unit.unitType);

const resolveParentPriority = ({
  document,
  unit,
  priorityById,
}: ParentPriorityInput): number | undefined => {
  const parent = findParentAjsUnit(document, unit);
  return parent && isParentPrioritySource(parent)
    ? getPriorityForUnitTypes({
        document,
        unit: parent,
        priorityById,
        targetUnitTypes: parentPriorityUnitTypes,
      })
    : undefined;
};

const resolveUncachedPriority = (input: ParentPriorityInput): number =>
  resolveExplicitPriority(input.unit) ?? resolveParentPriority(input) ?? 1;

export const getPriorityForUnitTypes = ({
  document,
  unit,
  priorityById,
  targetUnitTypes,
}: PriorityForUnitTypesInput): number | undefined => {
  const cachedPriority = priorityById.get(unit.id);
  if (cachedPriority !== undefined) {
    return cachedPriority;
  }
  if (!targetUnitTypes.includes(unit.unitType)) {
    return undefined;
  }

  return cachePriority(
    priorityById,
    unit.id,
    resolveUncachedPriority({ document, unit, priorityById }),
  );
};
