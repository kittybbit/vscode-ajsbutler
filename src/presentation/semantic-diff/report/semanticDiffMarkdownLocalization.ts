import type {
  SemanticDiffAttributeCategory,
  SemanticDiffChange,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffIdentityDecision,
  SemanticDiffIdentityDecisionRule,
  SemanticDiffIdentityExactKey,
  SemanticDiffIdentityField,
  SemanticDiffIdentityStrategyId,
  SemanticDiffOutputContext,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationReference,
  SemanticDiffScheduleRunChange,
  SemanticDiffResult,
  SemanticDiffSummary,
  SemanticDiffTarget,
  SemanticDiffUnitTarget,
  SemanticDiffUnitReference,
} from "../../../application/semantic-diff/semanticDiffDto";
import { semanticDiffReportText } from "./semanticDiffReportText";

const labelKeys: Record<string, string> = {
  "Semantic Diff Report": "report.title",
  Summary: "summary",
  "Structural Changes": "structuralChanges",
  "Attribute Changes": "attributeChanges",
  "Schedule Changes": "scheduleChanges",
  "Confirmation Required": "confirmationRequired",
  "Unsupported Items": "unsupportedItems",
  Limitations: "limitations",
  None: "none",
  Before: "before",
  After: "after",
  Rationale: "rationale",
  Rule: "identityRule",
  Strategy: "identityStrategy",
  "Unit type": "identityUnitType",
  Fields: "identityFields",
  Candidates: "identityCandidates",
  Key: "identityKey",
  Target: "target",
  Related: "related",
  Constraint: "constraint",
  rule: "rule",
  "Before scope": "beforeScope",
  "After scope": "afterScope",
  "semantic change": "semanticChange",
  "confirmation-required item": "confirmationRequiredItem",
  "unsupported item": "unsupportedItem",
  limitation: "limitation",
  "schedule run change": "scheduleRunChange",
  "Result: semantic differences or review notes are present.": "resultFindings",
  "Result: no semantic changes detected.": "resultNone",
};

const attributeCategoryOrder: SemanticDiffAttributeCategory[] = [
  "execution-environment",
  "execution-definition",
  "start-condition",
  "end-control",
  "abnormal-end-control",
  "wait-condition",
  "external-integration",
  "schedule",
];

export const isJapanese = (language: string | undefined): boolean =>
  /^ja(?:-|$)/.test(language?.toLowerCase() ?? "");

const selectLanguageValue = <T>(
  language: string | undefined,
  english: T,
  japanese: T,
): T => (isJapanese(language) ? japanese : english);

export const label = (english: string, language?: string): string =>
  labelKeys[english]
    ? semanticDiffReportText(labelKeys[english], language)
    : english;

export const localizedKind = (value: string, language?: string): string => {
  const translated = semanticDiffReportText(`kind.${value}`, language);
  return translated === `semanticDiff.kind.${value}` ? value : translated;
};

const englishPluralSuffix = (count: number): string => (count === 1 ? "" : "s");

const englishPluralize = (count: number, countLabel: string): string =>
  `${count} ${countLabel}${englishPluralSuffix(count)}`;

const japanesePluralize = (count: number, countLabel: string): string =>
  semanticDiffReportText("generated.count", "ja", {
    count: String(count),
    label: countLabel,
  });

export const pluralize = (
  count: number,
  countLabel: string,
  language?: string,
): string => {
  const pluralizer = selectLanguageValue(
    language,
    englishPluralize,
    japanesePluralize,
  );
  return pluralizer(count, countLabel);
};

export const escapeMarkdown = (value: string): string =>
  value.replace(/([\\`*_{}[\]()#+!|>])/g, "\\$1");

export const localizedIdentityRule = (
  rule: SemanticDiffIdentityDecisionRule,
  language?: string,
): string => semanticDiffReportText(`identity.rule.${rule}`, language);

export const localizedIdentityStrategy = (
  strategy: SemanticDiffIdentityStrategyId,
  language?: string,
): string => semanticDiffReportText(`identity.strategy.${strategy}`, language);

export const optionalText = (value: string | undefined): string =>
  value || "(not specified)";

export const bulletLine = (value: string): string => `- ${value}`;

export const indentedLine = (value: string): string => `  - ${value}`;

const describeRelationEndpoint = (
  endpoint: SemanticDiffRelationEndpoint | SemanticDiffRelationReference,
): string => {
  const source = endpoint.sourceUnitPath ?? endpoint.sourceUnitId;
  const destination = endpoint.targetUnitPath ?? endpoint.targetUnitId;
  return `${source} -> ${destination} (${endpoint.type})`;
};

const describeRelationTarget = (
  target: Extract<SemanticDiffTarget, { kind: "relation" }>,
): string => describeRelationEndpoint(target.relation);

const describeJobGroupTarget = (
  target: Extract<SemanticDiffTarget, { kind: "job-group" }>,
  language?: string,
): string =>
  `${localizedKind("job-group", language)} ${optionalText(target.path)}`;

const describeUnitTarget = (
  target: Extract<SemanticDiffTarget, { kind: "jobnet" | "unit" }>,
  language?: string,
): string =>
  `${localizedKind(target.kind, language)} ${target.unit.absolutePath}`;

const describeRelationTargetText = (
  target: Extract<SemanticDiffTarget, { kind: "relation" }>,
  language?: string,
): string =>
  `${localizedKind("relation", language)} ${describeRelationTarget(target)}`;

const describeAttributeTarget = (
  target: Extract<SemanticDiffTarget, { kind: "attribute" }>,
  language?: string,
): string =>
  semanticDiffReportText("generated.attributeTarget", language, {
    parameter: target.parameterKey,
    path: target.unit.absolutePath,
  });

type TargetDescriptionRenderer = (
  target: SemanticDiffTarget | undefined,
  language?: string,
) => string;

const targetDescriptionRenderers: Record<
  SemanticDiffTarget["kind"],
  TargetDescriptionRenderer
> = {
  "job-group": (target, language) =>
    describeJobGroupTarget(
      target as Extract<SemanticDiffTarget, { kind: "job-group" }>,
      language,
    ),
  jobnet: (target, language) =>
    describeUnitTarget(
      target as Extract<SemanticDiffTarget, { kind: "jobnet" | "unit" }>,
      language,
    ),
  unit: (target, language) =>
    describeUnitTarget(
      target as Extract<SemanticDiffTarget, { kind: "jobnet" | "unit" }>,
      language,
    ),
  relation: (target, language) =>
    describeRelationTargetText(
      target as Extract<SemanticDiffTarget, { kind: "relation" }>,
      language,
    ),
  attribute: (target, language) =>
    describeAttributeTarget(
      target as Extract<SemanticDiffTarget, { kind: "attribute" }>,
      language,
    ),
};

const noTargetDescription: TargetDescriptionRenderer = (_target, language) =>
  semanticDiffReportText("generated.none", language);

export const describeTarget = (
  target: SemanticDiffTarget | undefined,
  language?: string,
): string =>
  (targetDescriptionRenderers[target?.kind ?? ""] ?? noTargetDescription)(
    target,
    language,
  );

type UnitTargetRenderer = (
  target: SemanticDiffTarget | undefined,
) => SemanticDiffUnitReference | undefined;

const unitTargetRenderers: Partial<
  Record<SemanticDiffTarget["kind"], UnitTargetRenderer>
> = {
  jobnet: (target) => (target as SemanticDiffUnitTarget).unit,
  unit: (target) => (target as SemanticDiffUnitTarget).unit,
};

const unitTarget = (
  target: SemanticDiffTarget | undefined,
): SemanticDiffUnitReference | undefined =>
  unitTargetRenderers[target?.kind as SemanticDiffTarget["kind"]]?.(target);

const unitNames = (change: SemanticDiffChange) => ({
  before: unitTarget(change.before),
  after: unitTarget(change.after),
});

type UnitNames = ReturnType<typeof unitNames>;

const localizedCandidateChange = (
  names: UnitNames,
  language?: string,
): string =>
  semanticDiffReportText("generated.candidate", language, {
    unit:
      names.before?.name ??
      names.after?.name ??
      localizedKind("unit", language),
  });

const localizedRenamedChange = (names: UnitNames, language?: string): string =>
  semanticDiffReportText("generated.renamed", language, {
    before: names.before?.name ?? localizedKind("unit", language),
    after: names.after?.name ?? localizedKind("unit", language),
  });

const parentPath = (absolutePath: string | undefined): string =>
  absolutePath ? absolutePath.slice(0, absolutePath.lastIndexOf("/")) : "";

const isAttributeTarget = (
  target: SemanticDiffTarget | undefined,
): target is Extract<SemanticDiffTarget, { kind: "attribute" }> =>
  target?.kind === "attribute";

const localizedMovedChange = (names: UnitNames, language?: string): string => {
  const unit =
    names.before?.name ?? names.after?.name ?? localizedKind("unit", language);
  return selectLanguageValue(
    language,
    `${unit} moved from ${parentPath(names.before?.absolutePath)} to ${parentPath(names.after?.absolutePath)}`,
    semanticDiffReportText("generated.moved", language, { unit }),
  );
};

const attributeTarget = (
  change: SemanticDiffChange,
  language?: string,
): Extract<SemanticDiffTarget, { kind: "attribute" }> | undefined => {
  const preferred = isJapanese(language) ? change.after : change.before;
  const fallback = isJapanese(language) ? change.before : change.after;
  return [preferred, fallback].find(isAttributeTarget);
};

const localizedAttributeChange = (
  change: SemanticDiffChange,
  language?: string,
): string => {
  const target = attributeTarget(change, language);
  return semanticDiffReportText("generated.attribute", language, {
    unit: target?.unit.name ?? localizedKind("unit", language),
    parameter: target?.parameterKey ?? localizedKind("attribute", language),
  });
};

const localizedElementChange = (
  change: SemanticDiffChange,
  names: UnitNames,
  language?: string,
): string =>
  semanticDiffReportText("generated.elementChange", language, {
    element:
      names.before?.name ??
      names.after?.name ??
      localizedKind(change.elementKind, language),
    kind: localizedKind(change.kind, language),
  });

type UnitChangeRenderer = (
  change: SemanticDiffChange,
  names: UnitNames,
  language?: string,
) => string;

const candidateUnitChangeRenderer: UnitChangeRenderer = (
  _change,
  names,
  language,
) => localizedCandidateChange(names, language);

const renamedUnitChangeRenderer: UnitChangeRenderer = (
  _change,
  names,
  language,
) => localizedRenamedChange(names, language);

const movedUnitChangeRenderer: UnitChangeRenderer = (
  _change,
  names,
  language,
) => localizedMovedChange(names, language);

const attributeUnitChangeRenderer: UnitChangeRenderer = (
  change,
  _names,
  language,
) => localizedAttributeChange(change, language);

const unitChangeRenderersByConfirmation: Partial<
  Record<SemanticDiffChange["confirmationLevel"], UnitChangeRenderer>
> = { candidate: candidateUnitChangeRenderer };

const unitChangeRenderersByKind: Partial<
  Record<SemanticDiffChange["kind"], UnitChangeRenderer>
> = {
  renamed: renamedUnitChangeRenderer,
  moved: movedUnitChangeRenderer,
};

const unitChangeRenderersByElement: Partial<
  Record<SemanticDiffChange["elementKind"], UnitChangeRenderer>
> = { attribute: attributeUnitChangeRenderer };

const defaultUnitChangeRenderer: UnitChangeRenderer = (
  change,
  names,
  language,
) => localizedElementChange(change, names, language);

const localizedUnitChange = (
  change: SemanticDiffChange,
  language: string | undefined,
): string => {
  const names = unitNames(change);
  const renderer =
    unitChangeRenderersByConfirmation[change.confirmationLevel] ??
    unitChangeRenderersByKind[change.kind] ??
    unitChangeRenderersByElement[change.elementKind] ??
    defaultUnitChangeRenderer;
  return renderer(change, names, language);
};

const localizedRelationChange = (
  change: Extract<SemanticDiffChange, { elementKind: "relation" }>,
  language?: string,
): string =>
  isJapanese(language)
    ? semanticDiffReportText(relationSummaryKeys[change.kind], language)
    : `${change.relationPair.canonicalPair.sourceUnitId}->${change.relationPair.canonicalPair.targetUnitId} relation ${change.kind}`;

const relationSummaryKeys: Record<
  Extract<SemanticDiffChange, { elementKind: "relation" }>["kind"],
  "generated.relationAdded" | "generated.relationRemoved"
> = {
  added: "generated.relationAdded",
  removed: "generated.relationRemoved",
};

export const localizedChangeSummary = (
  change: SemanticDiffChange,
  language?: string,
): string =>
  change.elementKind === "relation"
    ? localizedRelationChange(change, language)
    : localizedUnitChange(change, language);

const identityReference = (reference: SemanticDiffUnitReference): string =>
  `${escapeMarkdown(reference.name)} (${escapeMarkdown(reference.unitType)}) ${escapeMarkdown(reference.absolutePath)} [${escapeMarkdown(reference.id)}]`;

const nestedBulletLine = (value: string): string => `    - ${value}`;

const emptyIdentityFieldValue = (
  field: SemanticDiffIdentityField,
  language?: string,
): string =>
  ({
    absent: semanticDiffReportText("generated.none", language),
    present: '""',
  })[field.presence];

const renderedIdentityFieldValues = (
  field: SemanticDiffIdentityField,
  language?: string,
): string =>
  field.values.length > 0
    ? field.values.map(escapeMarkdown).join(", ")
    : emptyIdentityFieldValue(field, language);

const identityFieldValue = (
  field: SemanticDiffIdentityField,
  language?: string,
): string => {
  const presence = semanticDiffReportText(
    `identity.${field.presence}`,
    language,
  );
  const values = renderedIdentityFieldValues(field, language);
  return `${escapeMarkdown(field.key)} (${presence}): ${values}`;
};

const renderIdentityFields = (
  fields: SemanticDiffIdentityField[],
  language?: string,
): string[] => [
  indentedLine(`${label("Fields", language)}:`),
  ...fields.map((field) =>
    nestedBulletLine(identityFieldValue(field, language)),
  ),
];

type IdentityKeyRenderer = (key: SemanticDiffIdentityExactKey) => string;

const identityKeyRenderers: Record<
  SemanticDiffIdentityExactKey["kind"],
  IdentityKeyRenderer
> = {
  "job-group": (key) => {
    const jobGroupKey = key as Extract<
      SemanticDiffIdentityExactKey,
      { kind: "job-group" }
    >;
    return `${escapeMarkdown(jobGroupKey.kind)}; jobGroupPath=${escapeMarkdown(jobGroupKey.jobGroupPath)}; unitType=${escapeMarkdown(jobGroupKey.unitType)}`;
  },
  jobnet: (key) => {
    const jobnetKey = key as Extract<
      SemanticDiffIdentityExactKey,
      { kind: "jobnet" }
    >;
    return `${escapeMarkdown(jobnetKey.kind)}; jobGroupRelativePath=${escapeMarkdown(jobnetKey.jobGroupRelativePath)}; unitType=${escapeMarkdown(jobnetKey.unitType)}`;
  },
  unit: (key) => {
    const unitKey = key as Extract<
      SemanticDiffIdentityExactKey,
      { kind: "unit" }
    >;
    return `${escapeMarkdown(unitKey.kind)}; parentJobnetPath=${escapeMarkdown(unitKey.parentJobnetPath)}; unitName=${escapeMarkdown(unitKey.unitName)}; unitType=${escapeMarkdown(unitKey.unitType)}`;
  },
};

const renderIdentityKey = (
  key: SemanticDiffIdentityExactKey,
  language?: string,
): string[] => {
  const details = identityKeyRenderers[key.kind](key);
  return [indentedLine(`${label("Key", language)}: ${details}`)];
};

const renderIdentityCandidates = (
  decision: SemanticDiffIdentityDecision,
  language?: string,
): string[] => [
  indentedLine(`${label("Candidates", language)}:`),
  ...decision.before.map((reference) =>
    nestedBulletLine(
      `${label("Before", language)}: ${identityReference(reference)}`,
    ),
  ),
  ...decision.after.map((reference) =>
    nestedBulletLine(
      `${label("After", language)}: ${identityReference(reference)}`,
    ),
  ),
];

export const renderIdentityDecisionEvidence = (
  decision: SemanticDiffIdentityDecision,
  language?: string,
): string[] => {
  const lines = [
    indentedLine(
      `${label("Rationale", language)}: ${escapeMarkdown(localizedIdentityRule(decision.rule, language))}`,
    ),
    indentedLine(
      `${label("Rule", language)}: ${escapeMarkdown(localizedIdentityRule(decision.rule, language))} (${escapeMarkdown(decision.rule)})`,
    ),
  ];
  return [
    ...lines,
    ...identityEvidenceRenderers[decision.evidence.kind](decision, language),
  ];
};

type FingerprintIdentityDecision = Extract<
  SemanticDiffIdentityDecision,
  { evidence: { kind: "fingerprint" } }
>;

const identityCandidateRenderers: Record<
  SemanticDiffIdentityDecision["status"],
  (decision: SemanticDiffIdentityDecision, language?: string) => string[]
> = {
  exact: () => [],
  "fingerprint-confirmed": () => [],
  added: () => [],
  removed: () => [],
  candidate: (decision, language) =>
    renderIdentityCandidates(decision, language),
};

const renderFingerprintIdentityEvidence = (
  decision: FingerprintIdentityDecision,
  language?: string,
): string[] => [
  indentedLine(
    `${label("Strategy", language)}: ${escapeMarkdown(localizedIdentityStrategy(decision.evidence.strategyId, language))} (${escapeMarkdown(decision.evidence.strategyId)})`,
  ),
  indentedLine(
    `${label("Unit type", language)}: ${escapeMarkdown(decision.evidence.unitType)}`,
  ),
  ...renderIdentityFields(decision.evidence.fields, language),
  ...identityCandidateRenderers[decision.status](decision, language),
];

type IdentityEvidenceRenderer = (
  decision: SemanticDiffIdentityDecision,
  language?: string,
) => string[];

const identityEvidenceRenderers: Record<
  SemanticDiffIdentityDecision["evidence"]["kind"],
  IdentityEvidenceRenderer
> = {
  "exact-key": (decision, language) =>
    renderIdentityKey(
      (
        decision as Extract<
          SemanticDiffIdentityDecision,
          { evidence: { kind: "exact-key" } }
        >
      ).evidence.key,
      language,
    ),
  fingerprint: (decision, language) =>
    renderFingerprintIdentityEvidence(
      decision as FingerprintIdentityDecision,
      language,
    ),
};

type ChangeSide = "Before" | "After";

const changeSides = (
  change: SemanticDiffChange,
): readonly [ChangeSide, SemanticDiffTarget | undefined][] => [
  ["Before", change.before],
  ["After", change.after],
];

const relationEndpointForSide = (
  change: Extract<SemanticDiffChange, { elementKind: "relation" }>,
  side: ChangeSide,
): SemanticDiffRelationEndpoint | SemanticDiffRelationReference | null =>
  side === "Before" ? change.relationPair.before : change.relationPair.after;

const renderRelationSide = (
  change: Extract<SemanticDiffChange, { elementKind: "relation" }>,
  side: ChangeSide,
  language?: string,
): string[] => {
  const relationEndpoint = relationEndpointForSide(change, side);
  if (!relationEndpoint) return [];
  return [
    indentedLine(
      `${label(side, language)}: ${escapeMarkdown(`${localizedKind("relation", language)} ${describeRelationEndpoint(relationEndpoint)}`)}`,
    ),
  ];
};

const renderTargetSide = (
  target: SemanticDiffTarget | undefined,
  side: ChangeSide,
  language?: string,
): string[] =>
  target
    ? [
        indentedLine(
          `${label(side, language)}: ${escapeMarkdown(describeTarget(target, language))}`,
        ),
      ]
    : [];

type ChangeSideRenderInput = Readonly<{
  change: SemanticDiffChange;
  side: ChangeSide;
  target: SemanticDiffTarget | undefined;
  language?: string;
}>;

type ChangeSideRenderer = (input: ChangeSideRenderInput) => string[];

const relationChangeSideRenderer: ChangeSideRenderer = ({
  change,
  side,
  language,
}) =>
  renderRelationSide(
    change as Extract<SemanticDiffChange, { elementKind: "relation" }>,
    side,
    language,
  );

const targetChangeSideRenderer: ChangeSideRenderer = ({
  side,
  target,
  language,
}) => renderTargetSide(target, side, language);

const changeSideRenderers: Record<
  SemanticDiffChange["elementKind"],
  ChangeSideRenderer
> = {
  "job-group": targetChangeSideRenderer,
  jobnet: targetChangeSideRenderer,
  unit: targetChangeSideRenderer,
  relation: relationChangeSideRenderer,
  attribute: targetChangeSideRenderer,
};

const renderChangeSide = ({
  change,
  side,
  target,
  language,
}: ChangeSideRenderInput): string[] =>
  changeSideRenderers[change.elementKind]({
    change,
    side,
    target,
    language,
  });

const renderChangeSides = (
  change: SemanticDiffChange,
  language?: string,
): string[] =>
  changeSides(change).flatMap(([side, target]) =>
    renderChangeSide({ change, side, target, language }),
  );

const identityDecisionForChange = (
  change: SemanticDiffChange,
  identityDecisions: ReadonlyMap<string, SemanticDiffIdentityDecision>,
): SemanticDiffIdentityDecision | undefined =>
  identityDecisions.get(
    (change as Partial<{ identityDecisionId: string }>).identityDecisionId!,
  );

const renderChangeIdentityEvidence = (
  change: SemanticDiffChange,
  language: string | undefined,
  identityDecisions: ReadonlyMap<string, SemanticDiffIdentityDecision>,
): string[] => {
  const identityDecision = identityDecisionForChange(change, identityDecisions);
  return identityDecision
    ? renderIdentityDecisionEvidence(identityDecision, language)
    : [];
};

export const renderChangeDetails = (
  change: SemanticDiffChange,
  language?: string,
  identityDecisions: ReadonlyMap<
    string,
    SemanticDiffIdentityDecision
  > = new Map(),
): string[] => [
  bulletLine(
    `[${localizedKind(change.confirmationLevel, language)}] ${localizedKind(change.kind, language)} ${localizedKind(change.elementKind, language)}: ${escapeMarkdown(localizedChangeSummary(change, language))}`,
  ),
  ...renderChangeSides(change, language),
  ...renderChangeIdentityEvidence(change, language, identityDecisions),
];

const attributeChangesFor = (
  changes: SemanticDiffChange[],
  category: SemanticDiffAttributeCategory,
): SemanticDiffChange[] =>
  changes
    .filter(
      (change) =>
        change.elementKind === "attribute" &&
        change.attributeCategory === category,
    )
    .sort((left, right) => left.id.localeCompare(right.id));

type AttributeCategoryRenderInput = Readonly<{
  changes: SemanticDiffChange[];
  category: SemanticDiffAttributeCategory;
  language: string | undefined;
  identityDecisions: ReadonlyMap<string, SemanticDiffIdentityDecision>;
}>;

const renderAttributeCategory = ({
  changes,
  category,
  language,
  identityDecisions,
}: AttributeCategoryRenderInput): string[] => {
  const categoryChanges = attributeChangesFor(changes, category);
  if (categoryChanges.length === 0) return [];
  return [
    `### ${semanticDiffReportText(`category.${category}`, language)}`,
    "",
    ...categoryChanges.flatMap((change) =>
      renderChangeDetails(change, language, identityDecisions),
    ),
    "",
  ];
};

export const renderAttributeChanges = (
  changes: SemanticDiffChange[],
  language?: string,
  identityDecisions: ReadonlyMap<
    string,
    SemanticDiffIdentityDecision
  > = new Map(),
): string[] => {
  const lines = attributeCategoryOrder.flatMap((category) =>
    renderAttributeCategory({
      changes,
      category,
      language,
      identityDecisions,
    }),
  );
  return lines.length === 0 ? [bulletLine(label("None", language))] : lines;
};

type SemanticDiffConfirmationReasonCode =
  SemanticDiffConfirmationRequiredItem["reasonCode"];

type ConfirmationTextContext = {
  unitName: string | undefined;
  parameterKey: string;
  pair: string;
  beforeValues: string[];
};

const confirmationUnitName = (target: SemanticDiffTarget): string | undefined =>
  (
    ({
      unit: target as SemanticDiffUnitTarget,
      jobnet: target as SemanticDiffUnitTarget,
    })[target.kind] as SemanticDiffUnitTarget | undefined
  )?.unit.name;

const confirmationTextContext = (
  item: SemanticDiffConfirmationRequiredItem,
): ConfirmationTextContext => {
  const relationPair = item.detail.relationPair?.canonicalPair;
  return {
    unitName: confirmationUnitName(item.target),
    parameterKey: item.detail.parameterKey ?? "",
    pair: relationPair
      ? `${relationPair.sourceUnitId}->${relationPair.targetUnitId}`
      : "",
    beforeValues: item.detail.beforeValues,
  };
};

const scheduleRunValue = (
  beforeValues: string[],
  prefix: "date=" | "time=",
): string | undefined =>
  beforeValues.find((value) => value.startsWith(prefix))?.slice(prefix.length);

const englishConfirmationContent: Record<
  SemanticDiffConfirmationReasonCode,
  (context: ConfirmationTextContext) => string
> = {
  "conditional-relation-removed": ({ pair }) =>
    `${pair} conditional relation removed or changed`,
  "wait-release-source-changed": ({ unitName }) =>
    `${unitName ?? "unit"} wait release source changed`,
  "timeout-removed": ({ unitName, parameterKey }) =>
    `${unitName ?? "unit"} explicit timeout ${parameterKey} removed`,
  "condition-judgment-changed": ({ unitName, parameterKey }) =>
    `${unitName ?? "unit"} ${parameterKey} condition or judgment changed`,
  "wait-target-changed": ({ unitName, parameterKey }) =>
    `${unitName ?? "unit"} wait target ${parameterKey} changed`,
  "no-calculated-schedule-run": ({ unitName }) =>
    `${unitName ?? "unit"} has no calculated runs in the schedule comparison period`,
  "calculated-schedule-run-removed": ({ unitName, beforeValues }) => {
    const date = scheduleRunValue(beforeValues, "date=");
    const time = scheduleRunValue(beforeValues, "time=");
    const runValues = [date, time]
      .filter((value): value is string => value !== undefined && value !== "")
      .join(" ");
    return `${unitName ?? "unit"} calculated schedule run${runValues ? ` ${runValues}` : ""} removed`;
  },
  "execution-user-type-changed": ({ unitName }) =>
    `${unitName ?? "unit"} execution user type changed`,
  "jp1-resource-group-changed": ({ unitName }) =>
    `${unitName ?? "unit"} JP1 resource group changed`,
};

const englishConfirmationRationale: Record<
  SemanticDiffConfirmationReasonCode,
  string
> = {
  "conditional-relation-removed":
    "a previously conditional branch path may no longer be available",
  "wait-release-source-changed":
    "a previously available within-job-group release source may no longer release this wait",
  "timeout-removed":
    "removing a previously explicit wait timeout may leave a wait unresolved for longer than before",
  "condition-judgment-changed":
    "a previously established start, end, or branch path may no longer be available",
  "wait-target-changed":
    "the compared definition now waits for a different file, event, or event filter",
  "no-calculated-schedule-run":
    "a schedule-defined jobnet may no longer have an execution opportunity in the compared period",
  "calculated-schedule-run-removed":
    "a previously calculated execution opportunity is absent in the compared period",
  "execution-user-type-changed":
    "execution prerequisites may differ after the definition change",
  "jp1-resource-group-changed":
    "resource availability and contention may differ after the definition change",
};

const confirmationContent = (
  item: SemanticDiffConfirmationRequiredItem,
  context: ConfirmationTextContext,
  language?: string,
): string =>
  selectLanguageValue(
    language,
    englishConfirmationContent[item.reasonCode](context),
    semanticDiffReportText("generated.confirmation", language, {
      unit: context.unitName ?? localizedKind("unit", language),
      parameter: context.parameterKey,
    }),
  );

const confirmationRationale = (
  item: SemanticDiffConfirmationRequiredItem,
  language?: string,
): string =>
  selectLanguageValue(
    language,
    englishConfirmationRationale[item.reasonCode],
    semanticDiffReportText("generated.confirmationRationale", language),
  );

const renderRelatedTargets = (
  targets: SemanticDiffTarget[],
  language?: string,
): string[] =>
  targets.length === 0
    ? []
    : [
        indentedLine(
          `${label("Related", language)}: ${targets.map((target) => escapeMarkdown(describeTarget(target, language))).join(", ")}`,
        ),
      ];

const renderConstraintLabel = (
  constraint: SemanticDiffConstraint,
  language?: string,
): string =>
  selectLanguageValue(
    language,
    localizedConstraint(constraint),
    semanticDiffReportText("generated.constraint", language),
  );

const renderConstraintLines = (
  constraints: SemanticDiffConstraint[],
  language?: string,
): string[] =>
  constraints.map((constraint) =>
    indentedLine(
      `${label("Constraint", language)}: ${escapeMarkdown(renderConstraintLabel(constraint, language))}`,
    ),
  );

export const renderConfirmationRequiredItem = (
  item: SemanticDiffConfirmationRequiredItem,
  language?: string,
): string[] => {
  const context = confirmationTextContext(item);
  const lines = [
    bulletLine(escapeMarkdown(confirmationContent(item, context, language))),
    indentedLine(
      `${label("Target", language)}: ${escapeMarkdown(describeTarget(item.target, language))}`,
    ),
    indentedLine(
      `${label("Rationale", language)}: ${escapeMarkdown(confirmationRationale(item, language))}`,
    ),
  ];
  return [
    ...lines,
    ...renderRelatedTargets(item.relatedTargets, language),
    ...renderConstraintLines(item.constraints, language),
  ];
};

const scheduleSummaryKeys: Record<
  SemanticDiffScheduleRunChange["kind"],
  | "generated.scheduleChanged"
  | "generated.scheduleAdded"
  | "generated.scheduleRemoved"
> = {
  "changed-time": "generated.scheduleChanged",
  added: "generated.scheduleAdded",
  removed: "generated.scheduleRemoved",
};

const localizedScheduleRunSummary = (
  change: SemanticDiffScheduleRunChange,
  language?: string,
): string =>
  selectLanguageValue(
    language,
    scheduleRunSummary(change),
    semanticDiffReportText(scheduleSummaryKeys[change.kind], language, {
      path: change.unitPath,
      date: change.date,
    }),
  );

const scheduleRunSides = (
  change: SemanticDiffScheduleRunChange,
): readonly [
  ChangeSide,
  NonNullable<SemanticDiffScheduleRunChange["before"]> | null,
][] => [
  ["Before", change.before],
  ["After", change.after],
];

const renderScheduleRunSide = (
  side: ChangeSide,
  run: NonNullable<SemanticDiffScheduleRunChange["before"]> | null,
  language?: string,
): string[] =>
  run
    ? [
        indentedLine(
          `${label(side, language)}: ${escapeMarkdown(`${run.date} ${run.time} ${label("rule", language)} ${run.rule}`)}`,
        ),
      ]
    : [];

const renderScheduleRunSides = (
  change: SemanticDiffScheduleRunChange,
  language?: string,
): string[] =>
  scheduleRunSides(change).flatMap(([side, run]) =>
    renderScheduleRunSide(side, run, language),
  );

export const renderScheduleRunChange = (
  change: SemanticDiffScheduleRunChange,
  language?: string,
): string[] => [
  bulletLine(
    `[${localizedKind(change.kind, language)}] ${escapeMarkdown(localizedScheduleRunSummary(change, language))}`,
  ),
  ...renderScheduleRunSides(change, language),
];

type SemanticDiffConstraint =
  SemanticDiffConfirmationRequiredItem["constraints"][number];
type SemanticDiffConstraintCode = SemanticDiffConstraint["code"];

const constraintTextByCode: Record<
  SemanticDiffConstraintCode,
  (constraint: SemanticDiffConstraint) => string
> = {
  "jp1-ajs3-v13-rule-basis": (constraint) =>
    constraint.detail.period
      ? "Rule basis: JP1/AJS3 v13 unit definition schedule parameters sd and st for explicit directly defined jobnet schedules."
      : "Rule basis: JP1/AJS3 v13 unit definition parameters for relations, wait units, event receiving, file monitoring, and job end judgment.",
  "runtime-state-not-verified": () =>
    "Runtime history and external conditions are not verified by this comparison.",
  "external-state-not-verified": () =>
    "External files, events, hosts, users, permissions, and resource groups are not verified.",
  "comparison-period": (constraint) =>
    constraint.detail.period
      ? `Comparison period: ${constraint.detail.period.from} to ${constraint.detail.period.to} (exclusive)`
      : "Comparison period",
};

const localizedConstraint = (constraint: SemanticDiffConstraint): string =>
  constraintTextByCode[constraint.code](constraint);

type ScheduleRunSummaryRenderer = (
  change: SemanticDiffScheduleRunChange,
) => string;

const changedTimeScheduleRunSummary: ScheduleRunSummaryRenderer = (change) =>
  `${change.unitPath} run on ${change.date} changed from ${change.before?.time ?? ""} to ${change.after?.time ?? ""}`;

const singleScheduleRunSummary = (
  change: SemanticDiffScheduleRunChange,
): string => {
  const run = change.kind === "removed" ? change.before : change.after;
  return `${change.unitPath} run on ${change.date} ${run?.time ?? ""} ${change.kind}`.trim();
};

const scheduleRunSummaryRenderers: Record<
  SemanticDiffScheduleRunChange["kind"],
  ScheduleRunSummaryRenderer
> = {
  "changed-time": changedTimeScheduleRunSummary,
  added: singleScheduleRunSummary,
  removed: singleScheduleRunSummary,
};

const scheduleRunSummary = (change: SemanticDiffScheduleRunChange): string =>
  scheduleRunSummaryRenderers[change.kind](change);

const hasFindings = (result: SemanticDiffResult): boolean =>
  [
    result.changes.length,
    result.confirmationRequired.length,
    result.unsupportedItems.length,
    result.limitations.length,
    result.scheduleComparison?.runChanges.length ?? 0,
  ].some((count) => count > 0);

type SummaryRenderInput = {
  result: SemanticDiffResult;
  summary: SemanticDiffSummary | undefined;
};

const summaryRenderInput = (
  input: SemanticDiffResult | SemanticDiffOutputContext,
): SummaryRenderInput =>
  "summary" in input
    ? { result: input.result, summary: input.summary }
    : { result: input, summary: undefined };

const summaryChangeCount = (
  summary: SemanticDiffSummary | undefined,
  result: SemanticDiffResult,
): number =>
  summary?.scheduleRunChangeCount ??
  result.scheduleComparison?.runChanges.length ??
  0;

const summaryScopeLines = (
  result: SemanticDiffResult,
  language?: string,
): string[] => {
  const counts: Array<[number, string]> = [
    [result.changes.length, "semantic change"],
    [result.confirmationRequired.length, "confirmation-required item"],
    [result.unsupportedItems.length, "unsupported item"],
    [result.limitations.length, "limitation"],
  ];
  return [
    bulletLine(
      `${label("Before scope", language)}: ${escapeMarkdown(optionalText(result.inputs.before.jobGroupPath))}`,
    ),
    bulletLine(
      `${label("After scope", language)}: ${escapeMarkdown(optionalText(result.inputs.after.jobGroupPath))}`,
    ),
    ...counts.map(([count, countLabel]) =>
      bulletLine(pluralize(count, label(countLabel, language), language)),
    ),
  ];
};

const summaryScheduleLines = (
  result: SemanticDiffResult,
  summary: SemanticDiffSummary | undefined,
  language?: string,
): string[] => {
  if (!result.scheduleComparison) return [];
  return [
    bulletLine(
      semanticDiffReportText("generated.period", language, {
        from: escapeMarkdown(result.scheduleComparison.period.from),
        to: escapeMarkdown(result.scheduleComparison.period.to),
      }),
    ),
    bulletLine(
      pluralize(
        summaryChangeCount(summary, result),
        label("schedule run change", language),
        language,
      ),
    ),
  ];
};

const summaryResultLine = (
  result: SemanticDiffResult,
  summary: SemanticDiffSummary | undefined,
  language?: string,
): string =>
  bulletLine(
    (summary?.hasFindings ?? hasFindings(result))
      ? label(
          "Result: semantic differences or review notes are present.",
          language,
        )
      : label("Result: no semantic changes detected.", language),
  );

export const renderSummary = (
  input: SemanticDiffResult | SemanticDiffOutputContext,
  language?: string,
): string[] => {
  const { result, summary } = summaryRenderInput(input);
  const lines = [
    ...summaryScopeLines(result, language),
    ...summaryScheduleLines(result, summary, language),
    summaryResultLine(result, summary, language),
  ];
  return lines;
};
