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

export const describeTarget = (
  target: SemanticDiffTarget | undefined,
  language?: string,
): string => {
  if (!target) return semanticDiffReportText("generated.none", language);
  switch (target.kind) {
    case "job-group":
      return `${localizedKind("job-group", language)} ${optionalText(target.path)}`;
    case "jobnet":
    case "unit":
      return `${localizedKind(target.kind, language)} ${target.unit.absolutePath}`;
    case "relation":
      return `${localizedKind("relation", language)} ${describeRelationTarget(target)}`;
    case "attribute":
      return semanticDiffReportText("generated.attributeTarget", language, {
        parameter: target.parameterKey,
        path: target.unit.absolutePath,
      });
  }
};

const unitNames = (change: SemanticDiffChange) => ({
  before:
    change.before?.kind === "unit" || change.before?.kind === "jobnet"
      ? change.before.unit
      : undefined,
  after:
    change.after?.kind === "unit" || change.after?.kind === "jobnet"
      ? change.after.unit
      : undefined,
});

const localizedUnitChange = (
  change: SemanticDiffChange,
  language: string | undefined,
): string => {
  const { before, after } = unitNames(change);
  if (change.confirmationLevel === "candidate") {
    return semanticDiffReportText("generated.candidate", language, {
      unit: before?.name ?? after?.name ?? localizedKind("unit", language),
    });
  }
  if (change.kind === "renamed") {
    return semanticDiffReportText("generated.renamed", language, {
      before: before?.name ?? localizedKind("unit", language),
      after: after?.name ?? localizedKind("unit", language),
    });
  }
  if (change.kind === "moved") {
    const unit = before?.name ?? after?.name ?? localizedKind("unit", language);
    if (isJapanese(language)) {
      return semanticDiffReportText("generated.moved", language, { unit });
    }
    const beforeParent = before
      ? before.absolutePath.slice(0, before.absolutePath.lastIndexOf("/"))
      : "";
    const afterParent = after
      ? after.absolutePath.slice(0, after.absolutePath.lastIndexOf("/"))
      : "";
    return `${unit} moved from ${beforeParent} to ${afterParent}`;
  }
  if (change.elementKind === "attribute") {
    const target = isJapanese(language)
      ? change.after?.kind === "attribute"
        ? change.after
        : change.before?.kind === "attribute"
          ? change.before
          : undefined
      : change.before?.kind === "attribute"
        ? change.before
        : change.after?.kind === "attribute"
          ? change.after
          : undefined;
    return semanticDiffReportText("generated.attribute", language, {
      unit: target?.unit.name ?? localizedKind("unit", language),
      parameter: target?.parameterKey ?? localizedKind("attribute", language),
    });
  }
  return semanticDiffReportText("generated.elementChange", language, {
    element:
      before?.name ??
      after?.name ??
      localizedKind(change.elementKind, language),
    kind: localizedKind(change.kind, language),
  });
};

export const localizedChangeSummary = (
  change: SemanticDiffChange,
  language?: string,
): string => {
  if (change.elementKind === "relation") {
    if (isJapanese(language)) {
      return semanticDiffReportText(
        change.kind === "added"
          ? "generated.relationAdded"
          : "generated.relationRemoved",
        language,
      );
    }
    const pair = change.relationPair.canonicalPair;
    return `${pair.sourceUnitId}->${pair.targetUnitId} relation ${change.kind}`;
  }
  return localizedUnitChange(change, language);
};

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

export const renderConfirmationRequiredItem = (
  item: SemanticDiffConfirmationRequiredItem,
  language?: string,
): string[] => {
  const japanese = isJapanese(language);
  const unitName =
    item.target.kind === "unit" || item.target.kind === "jobnet"
      ? item.target.unit.name
      : undefined;
  const parameterKey = item.detail.parameterKey ?? "";
  const relationPair = item.detail.relationPair?.canonicalPair;
  const pair = relationPair
    ? `${relationPair.sourceUnitId}->${relationPair.targetUnitId}`
    : "";
  const englishContent = (() => {
    switch (item.reasonCode) {
      case "conditional-relation-removed":
        return `${pair} conditional relation removed or changed`;
      case "wait-release-source-changed":
        return `${unitName ?? "unit"} wait release source changed`;
      case "timeout-removed":
        return `${unitName ?? "unit"} explicit timeout ${parameterKey} removed`;
      case "condition-judgment-changed":
        return `${unitName ?? "unit"} ${parameterKey} condition or judgment changed`;
      case "wait-target-changed":
        return `${unitName ?? "unit"} wait target ${parameterKey} changed`;
      case "no-calculated-schedule-run":
        return `${unitName ?? "unit"} has no calculated runs in the schedule comparison period`;
      case "calculated-schedule-run-removed": {
        const [date, time] = item.detail.rawValues;
        return `${unitName ?? "unit"} calculated schedule run ${date ?? ""} ${time ?? ""} removed`.trim();
      }
      case "execution-user-type-changed":
        return `${unitName ?? "unit"} execution user type changed`;
      case "jp1-resource-group-changed":
        return `${unitName ?? "unit"} JP1 resource group changed`;
    }
  })();
  const content = japanese
    ? semanticDiffReportText("generated.confirmation", language, {
        unit: unitName ?? localizedKind("unit", language),
        parameter: parameterKey,
      })
    : englishContent;
  const rationale = japanese
    ? semanticDiffReportText("generated.confirmationRationale", language)
    : (() => {
        switch (item.reasonCode) {
          case "conditional-relation-removed":
            return "a previously conditional branch path may no longer be available";
          case "wait-release-source-changed":
            return "a previously available within-job-group release source may no longer release this wait";
          case "timeout-removed":
            return "removing a previously explicit wait timeout may leave a wait unresolved for longer than before";
          case "condition-judgment-changed":
            return "a previously established start, end, or branch path may no longer be available";
          case "wait-target-changed":
            return "the compared definition now waits for a different file, event, or event filter";
          case "no-calculated-schedule-run":
            return "a schedule-defined jobnet may no longer have an execution opportunity in the compared period";
          case "calculated-schedule-run-removed":
            return "a previously calculated execution opportunity is absent in the compared period";
          case "execution-user-type-changed":
            return "execution prerequisites may differ after the definition change";
          case "jp1-resource-group-changed":
            return "resource availability and contention may differ after the definition change";
        }
      })();
  const lines = [
    bulletLine(escapeMarkdown(content)),
    indentedLine(
      `${label("Target", language)}: ${escapeMarkdown(describeTarget(item.target, language))}`,
    ),
    indentedLine(
      `${label("Rationale", language)}: ${escapeMarkdown(rationale)}`,
    ),
  ];
  if (item.relatedTargets.length > 0) {
    lines.push(
      indentedLine(
        `${label("Related", language)}: ${item.relatedTargets.map((target) => escapeMarkdown(describeTarget(target, language))).join(", ")}`,
      ),
    );
  }
  return [
    ...lines,
    ...item.constraints.map((constraint) =>
      indentedLine(
        `${label("Constraint", language)}: ${escapeMarkdown(japanese ? semanticDiffReportText("generated.constraint", language) : localizedConstraint(constraint))}`,
      ),
    ),
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

const localizedConstraint = (
  constraint: SemanticDiffConfirmationRequiredItem["constraints"][number],
): string => {
  switch (constraint.code) {
    case "jp1-ajs3-v13-rule-basis":
      return constraint.detail.period
        ? "Rule basis: JP1/AJS3 v13 unit definition schedule parameters sd and st for explicit directly defined jobnet schedules."
        : "Rule basis: JP1/AJS3 v13 unit definition parameters for relations, wait units, event receiving, file monitoring, and job end judgment.";
    case "runtime-state-not-verified":
      return "Runtime history and external conditions are not verified by this comparison.";
    case "external-state-not-verified":
      return "External files, events, hosts, users, permissions, and resource groups are not verified.";
    case "comparison-period":
      return constraint.detail.period
        ? `Comparison period: ${constraint.detail.period.from} to ${constraint.detail.period.to} (exclusive)`
        : "Comparison period";
  }
};

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

export const renderSummary = (
  input: SemanticDiffResult | SemanticDiffOutputContext,
  language?: string,
): string[] => {
  const result = "summary" in input ? input.result : input;
  const summary = "summary" in input ? input.summary : undefined;
  const scheduleChangeCount =
    summary?.scheduleRunChangeCount ??
    result.scheduleComparison?.runChanges.length ??
    0;
  const counts: Array<[number, string]> = [
    [result.changes.length, "semantic change"],
    [result.confirmationRequired.length, "confirmation-required item"],
    [result.unsupportedItems.length, "unsupported item"],
    [result.limitations.length, "limitation"],
  ];
  const lines = [
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
  if (result.scheduleComparison) {
    lines.push(
      bulletLine(
        semanticDiffReportText("generated.period", language, {
          from: escapeMarkdown(result.scheduleComparison.period.from),
          to: escapeMarkdown(result.scheduleComparison.period.to),
        }),
      ),
      bulletLine(
        pluralize(
          scheduleChangeCount,
          label("schedule run change", language),
          language,
        ),
      ),
    );
  }
  lines.push(
    bulletLine(
      (summary?.hasFindings ?? hasFindings(result))
        ? label(
            "Result: semantic differences or review notes are present.",
            language,
          )
        : label("Result: no semantic changes detected.", language),
    ),
  );
  return lines;
};
