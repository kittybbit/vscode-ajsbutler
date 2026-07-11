import type {
  SemanticDiffAttributeCategory,
  SemanticDiffChange,
  SemanticDiffChangeSet,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffScheduleRunChange,
  SemanticDiffTarget,
} from "../../domain/models/semantic-diff/SemanticDiff";
import { semanticDiffReportText } from "../../domain/services/i18n/nls";

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

export const optionalText = (value: string | undefined): string =>
  value && value.length > 0 ? value : "(not specified)";

export const bulletLine = (value: string): string => `- ${value}`;

export const indentedLine = (value: string): string => `  - ${value}`;

const describeRelationTarget = (target: SemanticDiffTarget): string => {
  if (target.kind !== "relation") return "";
  const source =
    target.sourceUnit?.absolutePath ?? target.relation.sourceUnitId;
  const destination =
    target.targetUnit?.absolutePath ?? target.relation.targetUnitId;
  return `${source} -> ${destination} (${target.relation.type})`;
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
  before: change.before?.kind === "unit" ? change.before.unit : undefined,
  after: change.after?.kind === "unit" ? change.after.unit : undefined,
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
    return semanticDiffReportText("generated.moved", language, {
      unit: before?.name ?? after?.name ?? localizedKind("unit", language),
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
  if (!isJapanese(language)) return change.summary;
  if (change.elementKind === "attribute") {
    const target =
      change.after?.kind === "attribute"
        ? change.after
        : change.before?.kind === "attribute"
          ? change.before
          : undefined;
    return semanticDiffReportText("generated.attribute", language, {
      unit: target?.unit.name ?? localizedKind("unit", language),
      parameter: target?.parameterKey ?? localizedKind("attribute", language),
    });
  }
  if (change.elementKind === "relation") {
    return semanticDiffReportText(
      change.kind === "added"
        ? "generated.relationAdded"
        : "generated.relationRemoved",
      language,
    );
  }
  return localizedUnitChange(change, language);
};

const localizedRationale = (
  change: SemanticDiffChange,
  language?: string,
): string | undefined => {
  if (!change.rationale || !isJapanese(language)) return change.rationale;
  return change.confirmationLevel === "candidate"
    ? semanticDiffReportText("generated.rationaleCandidate", language)
    : change.rationale.includes("exact")
      ? semanticDiffReportText("generated.rationaleExact", language)
      : semanticDiffReportText("generated.rationaleFingerprint", language);
};

export const renderChangeDetails = (
  change: SemanticDiffChange,
  language?: string,
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
    if (target) {
      lines.push(
        indentedLine(
          `${label(side, language)}: ${escapeMarkdown(describeTarget(target, language))}`,
        ),
      );
    }
  });
  const rationale = localizedRationale(change, language);
  if (rationale) {
    lines.push(
      indentedLine(
        `${label("Rationale", language)}: ${escapeMarkdown(rationale)}`,
      ),
    );
  }
  return lines;
};

export const renderAttributeChanges = (
  changes: SemanticDiffChange[],
  language?: string,
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
        renderChangeDetails(change, language),
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
  const parameterKey = item.id.split(":").at(-1) ?? "";
  const content = japanese
    ? semanticDiffReportText("generated.confirmation", language, {
        unit: unitName ?? localizedKind("unit", language),
        parameter: parameterKey,
      })
    : item.changeContent;
  const rationale = japanese
    ? semanticDiffReportText("generated.confirmationRationale", language)
    : item.rationale;
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
        `${label("Constraint", language)}: ${escapeMarkdown(japanese ? semanticDiffReportText("generated.constraint", language) : constraint)}`,
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
    : change.summary;
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

const hasFindings = (changeSet: SemanticDiffChangeSet): boolean =>
  [
    changeSet.changes.length,
    changeSet.confirmationRequired.length,
    changeSet.unsupportedItems.length,
    changeSet.limitations.length,
    changeSet.scheduleComparison?.runChanges.length ?? 0,
  ].some((count) => count > 0);

export const renderSummary = (
  changeSet: SemanticDiffChangeSet,
  language?: string,
): string[] => {
  const scheduleChangeCount =
    changeSet.scheduleComparison?.runChanges.length ?? 0;
  const counts: Array<[number, string]> = [
    [changeSet.changes.length, "semantic change"],
    [changeSet.confirmationRequired.length, "confirmation-required item"],
    [changeSet.unsupportedItems.length, "unsupported item"],
    [changeSet.limitations.length, "limitation"],
  ];
  const lines = [
    bulletLine(
      `${label("Before scope", language)}: ${escapeMarkdown(optionalText(changeSet.inputs.before.jobGroupPath))}`,
    ),
    bulletLine(
      `${label("After scope", language)}: ${escapeMarkdown(optionalText(changeSet.inputs.after.jobGroupPath))}`,
    ),
    ...counts.map(([count, countLabel]) =>
      bulletLine(pluralize(count, label(countLabel, language), language)),
    ),
  ];
  if (changeSet.scheduleComparison) {
    lines.push(
      bulletLine(
        semanticDiffReportText("generated.period", language, {
          from: escapeMarkdown(changeSet.scheduleComparison.period.from),
          to: escapeMarkdown(changeSet.scheduleComparison.period.to),
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
      hasFindings(changeSet)
        ? label(
            "Result: semantic differences or review notes are present.",
            language,
          )
        : label("Result: no semantic changes detected.", language),
    ),
  );
  return lines;
};
