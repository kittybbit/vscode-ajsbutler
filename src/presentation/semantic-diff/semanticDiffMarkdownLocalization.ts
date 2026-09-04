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
  SemanticDiffUnitReference,
} from "../../application/semantic-diff/semanticDiffDto";
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
  language?.toLowerCase() === "ja" ||
  language?.toLowerCase().startsWith("ja-") === true;

export const label = (english: string, language?: string): string =>
  labelKeys[english]
    ? semanticDiffReportText(labelKeys[english], language)
    : english;

export const localizedKind = (value: string, language?: string): string => {
  const translated = semanticDiffReportText(`kind.${value}`, language);
  return translated === `semanticDiff.kind.${value}` ? value : translated;
};

export const pluralize = (
  count: number,
  countLabel: string,
  language?: string,
): string =>
  isJapanese(language)
    ? semanticDiffReportText("generated.count", language, {
        count: String(count),
        label: countLabel,
      })
    : `${count} ${countLabel}${count === 1 ? "" : "s"}`;

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
  value && value.length > 0 ? value : "(not specified)";

export const bulletLine = (value: string): string => `- ${value}`;

export const indentedLine = (value: string): string => `  - ${value}`;

const describeRelationEndpoint = (
  endpoint: SemanticDiffRelationEndpoint | SemanticDiffRelationReference,
): string => {
  const source = endpoint.sourceUnitPath ?? endpoint.sourceUnitId;
  const destination = endpoint.targetUnitPath ?? endpoint.targetUnitId;
  return `${source} -> ${destination} (${endpoint.type})`;
};

const describeRelationTarget = (target: SemanticDiffTarget): string => {
  if (target.kind !== "relation") return "";
  return describeRelationEndpoint(target.relation);
};

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
  target: SemanticDiffTarget,
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

export const describeTarget = (
  target: SemanticDiffTarget | undefined,
  language?: string,
): string =>
  target
    ? targetDescriptionRenderers[target.kind](target, language)
    : semanticDiffReportText("generated.none", language);

const unitTarget = (
  target: SemanticDiffTarget | undefined,
): SemanticDiffUnitReference | undefined => {
  if (!target) return undefined;
  switch (target.kind) {
    case "jobnet":
    case "unit":
      return target.unit;
    default:
      return undefined;
  }
};

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
  if (isJapanese(language)) {
    return semanticDiffReportText("generated.moved", language, { unit });
  }
  return `${unit} moved from ${parentPath(names.before?.absolutePath)} to ${parentPath(names.after?.absolutePath)}`;
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

const unitChangeRenderers: readonly {
  matches: (change: SemanticDiffChange) => boolean;
  render: UnitChangeRenderer;
}[] = [
  {
    matches: (change) => change.confirmationLevel === "candidate",
    render: (_change, names, language) =>
      localizedCandidateChange(names, language),
  },
  {
    matches: (change) => change.kind === "renamed",
    render: (_change, names, language) =>
      localizedRenamedChange(names, language),
  },
  {
    matches: (change) => change.kind === "moved",
    render: (_change, names, language) => localizedMovedChange(names, language),
  },
  {
    matches: (change) => change.elementKind === "attribute",
    render: (change, names, language) =>
      localizedAttributeChange(change, language),
  },
];

const localizedUnitChange = (
  change: SemanticDiffChange,
  language: string | undefined,
): string => {
  const names = unitNames(change);
  const renderer = unitChangeRenderers.find(({ matches }) => matches(change));
  return renderer
    ? renderer.render(change, names, language)
    : localizedElementChange(change, names, language);
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

const renderedIdentityFieldValues = (
  field: SemanticDiffIdentityField,
  language?: string,
): string => {
  if (field.values.length > 0) {
    return field.values.map(escapeMarkdown).join(", ");
  }
  if (field.presence === "absent") {
    return semanticDiffReportText("generated.none", language);
  }
  return '""';
};

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

const renderIdentityKey = (
  key: SemanticDiffIdentityExactKey,
  language?: string,
): string[] => {
  const details =
    key.kind === "jobnet"
      ? `${escapeMarkdown(key.kind)}; jobGroupRelativePath=${escapeMarkdown(key.jobGroupRelativePath)}; unitType=${escapeMarkdown(key.unitType)}`
      : `${escapeMarkdown(key.kind)}; parentJobnetPath=${escapeMarkdown(key.parentJobnetPath)}; unitName=${escapeMarkdown(key.unitName)}; unitType=${escapeMarkdown(key.unitType)}`;
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
  if (decision.evidence.kind === "exact-key") {
    return [...lines, ...renderIdentityKey(decision.evidence.key, language)];
  }
  lines.push(
    indentedLine(
      `${label("Strategy", language)}: ${escapeMarkdown(localizedIdentityStrategy(decision.evidence.strategyId, language))} (${escapeMarkdown(decision.evidence.strategyId)})`,
    ),
    indentedLine(
      `${label("Unit type", language)}: ${escapeMarkdown(decision.evidence.unitType)}`,
    ),
    ...renderIdentityFields(decision.evidence.fields, language),
  );
  if (decision.status === "candidate") {
    lines.push(...renderIdentityCandidates(decision, language));
  }
  return lines;
};

export const renderChangeDetails = (
  change: SemanticDiffChange,
  language?: string,
  identityDecisions: ReadonlyMap<
    string,
    SemanticDiffIdentityDecision
  > = new Map(),
): string[] => {
  const lines = [
    bulletLine(
      `[${localizedKind(change.confirmationLevel, language)}] ${localizedKind(change.kind, language)} ${localizedKind(change.elementKind, language)}: ${escapeMarkdown(localizedChangeSummary(change, language))}`,
    ),
  ];
  const sides = [
    ["Before", change.before],
    ["After", change.after],
  ] as const;
  sides.forEach(([side, target]) => {
    if (change.elementKind === "relation") {
      const relationEndpoint =
        side === "Before"
          ? change.relationPair.before
          : change.relationPair.after;
      if (relationEndpoint) {
        lines.push(
          indentedLine(
            `${label(side, language)}: ${escapeMarkdown(`${localizedKind("relation", language)} ${describeRelationEndpoint(relationEndpoint)}`)}`,
          ),
        );
      }
    } else if (target) {
      lines.push(
        indentedLine(
          `${label(side, language)}: ${escapeMarkdown(describeTarget(target, language))}`,
        ),
      );
    }
  });
  const identityDecision =
    change.elementKind !== "job-group" && change.elementKind !== "relation"
      ? identityDecisions.get(change.identityDecisionId)
      : undefined;
  if (identityDecision) {
    lines.push(...renderIdentityDecisionEvidence(identityDecision, language));
  }
  return lines;
};

export const renderAttributeChanges = (
  changes: SemanticDiffChange[],
  language?: string,
  identityDecisions: ReadonlyMap<
    string,
    SemanticDiffIdentityDecision
  > = new Map(),
): string[] => {
  const attributeChanges = changes.filter(
    (change) => change.elementKind === "attribute",
  );
  if (attributeChanges.length === 0) {
    return [bulletLine(label("None", language))];
  }
  return attributeCategoryOrder.flatMap((category) => {
    const categoryChanges = attributeChanges
      .filter((change) => change.attributeCategory === category)
      .sort((left, right) => left.id.localeCompare(right.id));
    if (categoryChanges.length === 0) return [];
    return [
      `### ${semanticDiffReportText(`category.${category}`, language)}`,
      "",
      ...categoryChanges.flatMap((change) =>
        renderChangeDetails(change, language, identityDecisions),
      ),
      "",
    ];
  });
};

type SemanticDiffConfirmationReasonCode =
  SemanticDiffConfirmationRequiredItem["reasonCode"];

type ConfirmationTextContext = {
  unitName: string | undefined;
  parameterKey: string;
  pair: string;
  rawValues: string[];
};

const confirmationUnitName = (
  target: SemanticDiffTarget,
): string | undefined =>
  target.kind === "unit" || target.kind === "jobnet"
    ? target.unit.name
    : undefined;

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
    rawValues: item.detail.rawValues,
  };
};

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
  "calculated-schedule-run-removed": ({ unitName, rawValues }) => {
    const [date, time] = rawValues;
    return `${unitName ?? "unit"} calculated schedule run ${date ?? ""} ${time ?? ""} removed`.trim();
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
  isJapanese(language)
    ? semanticDiffReportText("generated.confirmation", language, {
        unit: context.unitName ?? localizedKind("unit", language),
        parameter: context.parameterKey,
      })
    : englishConfirmationContent[item.reasonCode](context);

const confirmationRationale = (
  item: SemanticDiffConfirmationRequiredItem,
  language?: string,
): string =>
  isJapanese(language)
    ? semanticDiffReportText("generated.confirmationRationale", language)
    : englishConfirmationRationale[item.reasonCode];

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
  isJapanese(language)
    ? semanticDiffReportText("generated.constraint", language)
    : localizedConstraint(constraint);

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

export const renderScheduleRunChange = (
  change: SemanticDiffScheduleRunChange,
  language?: string,
): string[] => {
  const summary = isJapanese(language)
    ? semanticDiffReportText(
        change.kind === "changed-time"
          ? "generated.scheduleChanged"
          : change.kind === "added"
            ? "generated.scheduleAdded"
            : "generated.scheduleRemoved",
        language,
        { path: change.unitPath, date: change.date },
      )
    : scheduleRunSummary(change);
  const lines = [
    bulletLine(
      `[${localizedKind(change.kind, language)}] ${escapeMarkdown(summary)}`,
    ),
  ];
  const sides = [
    ["Before", change.before],
    ["After", change.after],
  ] as const;
  sides.forEach(([side, run]) => {
    if (run) {
      lines.push(
        indentedLine(
          `${label(side, language)}: ${escapeMarkdown(`${run.date} ${run.time} ${label("rule", language)} ${run.rule}`)}`,
        ),
      );
    }
  });
  return lines;
};

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

const scheduleRunSummary = (change: SemanticDiffScheduleRunChange): string => {
  if (change.kind === "changed-time") {
    return `${change.unitPath} run on ${change.date} changed from ${change.before?.time ?? ""} to ${change.after?.time ?? ""}`;
  }
  const run = change.kind === "removed" ? change.before : change.after;
  return `${change.unitPath} run on ${change.date} ${run?.time ?? ""} ${change.kind}`.trim();
};

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
