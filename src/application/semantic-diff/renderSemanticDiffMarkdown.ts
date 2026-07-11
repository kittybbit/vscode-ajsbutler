import type {
  SemanticDiffAttributeCategory,
  SemanticDiffChange,
  SemanticDiffChangeSet,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffLimitation,
  SemanticDiffScheduleRunChange,
  SemanticDiffTarget,
  SemanticDiffUnsupportedItem,
} from "../../domain/models/semantic-diff/SemanticDiff";
import { semanticDiffReportText } from "../../domain/services/i18n/nls";

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

const structuralElementOrder = new Map<string, number>([
  ["job-group", 0],
  ["jobnet", 1],
  ["unit", 2],
  ["relation", 3],
]);

const compareStrings = (left: string, right: string): number =>
  left.localeCompare(right);

const isJapanese = (language: string | undefined): boolean =>
  language?.toLowerCase() === "ja" ||
  language?.toLowerCase().startsWith("ja-") === true;

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

const label = (english: string, language?: string): string =>
  labelKeys[english]
    ? semanticDiffReportText(labelKeys[english], language)
    : english;

const localizedKind = (value: string, language?: string): string => {
  const translated = semanticDiffReportText(`kind.${value}`, language);
  return translated === `semanticDiff.kind.${value}` ? value : translated;
};

const compareChanges = (
  left: SemanticDiffChange,
  right: SemanticDiffChange,
): number => compareStrings(left.id, right.id);

const pluralize = (count: number, label: string, language?: string): string =>
  isJapanese(language)
    ? semanticDiffReportText("generated.count", language, {
        count: String(count),
        label,
      })
    : `${count} ${label}${count === 1 ? "" : "s"}`;

const escapeMarkdown = (value: string): string =>
  value.replace(/([\\`*_{}[\]()#+!|>])/g, "\\$1");

const optionalText = (value: string | undefined): string =>
  value && value.length > 0 ? value : "(not specified)";

const describeRelationTarget = (target: SemanticDiffTarget): string => {
  if (target.kind !== "relation") {
    return "";
  }

  const source =
    target.sourceUnit?.absolutePath ?? target.relation.sourceUnitId;
  const destination =
    target.targetUnit?.absolutePath ?? target.relation.targetUnitId;
  return `${source} -> ${destination} (${target.relation.type})`;
};

const describeTarget = (
  target: SemanticDiffTarget | undefined,
  language?: string,
): string => {
  if (!target) {
    return semanticDiffReportText("generated.none", language);
  }
  if (target.kind === "job-group") {
    return `${localizedKind("job-group", language)} ${optionalText(target.path)}`;
  }
  if (target.kind === "jobnet" || target.kind === "unit") {
    return `${localizedKind(target.kind, language)} ${target.unit.absolutePath}`;
  }
  if (target.kind === "relation") {
    return `${localizedKind("relation", language)} ${describeRelationTarget(target)}`;
  }
  if (target.kind === "attribute") {
    return semanticDiffReportText("generated.attributeTarget", language, {
      parameter: target.parameterKey,
      path: target.unit.absolutePath,
    });
  }
  return semanticDiffReportText("generated.unknown", language);
};

const bulletLine = (value: string): string => `- ${value}`;

const indentedLine = (value: string): string => `  - ${value}`;

const sectionOrNone = (lines: string[], language?: string): string[] =>
  lines.length > 0 ? lines : [bulletLine(label("None", language))];

const localizedChangeSummary = (
  change: SemanticDiffChange,
  language?: string,
): string => {
  if (!isJapanese(language)) return change.summary;
  const beforeUnit =
    change.before?.kind === "unit" ? change.before.unit : undefined;
  const afterUnit =
    change.after?.kind === "unit" ? change.after.unit : undefined;
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
  if (change.confirmationLevel === "candidate") {
    return semanticDiffReportText("generated.candidate", language, {
      unit:
        beforeUnit?.name ?? afterUnit?.name ?? localizedKind("unit", language),
    });
  }
  if (change.kind === "renamed") {
    return semanticDiffReportText("generated.renamed", language, {
      before: beforeUnit?.name ?? localizedKind("unit", language),
      after: afterUnit?.name ?? localizedKind("unit", language),
    });
  }
  if (change.kind === "moved") {
    return semanticDiffReportText("generated.moved", language, {
      unit:
        beforeUnit?.name ?? afterUnit?.name ?? localizedKind("unit", language),
    });
  }
  const unit = beforeUnit ?? afterUnit;
  return semanticDiffReportText("generated.elementChange", language, {
    element: unit?.name ?? localizedKind(change.elementKind, language),
    kind: localizedKind(change.kind, language),
  });
};

const localizedRationale = (
  change: SemanticDiffChange,
  language?: string,
): string | undefined => {
  if (!change.rationale || !isJapanese(language)) return change.rationale;
  if (change.confirmationLevel === "candidate") {
    return semanticDiffReportText("generated.rationaleCandidate", language);
  }
  return change.rationale.includes("exact")
    ? semanticDiffReportText("generated.rationaleExact", language)
    : semanticDiffReportText("generated.rationaleFingerprint", language);
};

const renderChangeDetails = (
  change: SemanticDiffChange,
  language?: string,
): string[] => {
  const lines: string[] = [
    bulletLine(
      `[${localizedKind(change.confirmationLevel, language)}] ${localizedKind(change.kind, language)} ${localizedKind(change.elementKind, language)}: ${escapeMarkdown(localizedChangeSummary(change, language))}`,
    ),
  ];
  if (change.before) {
    lines.push(
      indentedLine(
        `${label("Before", language)}: ${escapeMarkdown(describeTarget(change.before, language))}`,
      ),
    );
  }
  if (change.after) {
    lines.push(
      indentedLine(
        `${label("After", language)}: ${escapeMarkdown(describeTarget(change.after, language))}`,
      ),
    );
  }
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

const renderStructuralChanges = (
  changes: SemanticDiffChange[],
  language?: string,
): string[] =>
  changes
    .filter((change) => change.elementKind !== "attribute")
    .sort((left, right) => {
      const elementComparison =
        (structuralElementOrder.get(left.elementKind) ?? 99) -
        (structuralElementOrder.get(right.elementKind) ?? 99);
      return elementComparison || compareChanges(left, right);
    })
    .flatMap((change) => renderChangeDetails(change, language));

const renderAttributeChanges = (
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
      .sort(compareChanges);

    if (categoryChanges.length === 0) {
      return [];
    }

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

const renderConfirmationRequiredItem = (
  item: SemanticDiffConfirmationRequiredItem,
  language?: string,
): string[] => {
  const japanese = isJapanese(language);
  const unitName =
    item.target.kind === "unit" || item.target.kind === "jobnet"
      ? item.target.unit.name
      : undefined;
  const idParts = item.id.split(":");
  const parameterKey = idParts[idParts.length - 1];
  const japaneseChangeContent = (): string =>
    semanticDiffReportText("generated.confirmation", language, {
      unit: unitName ?? localizedKind("unit", language),
      parameter: parameterKey,
    });
  const lines = [
    bulletLine(
      escapeMarkdown(japanese ? japaneseChangeContent() : item.changeContent),
    ),
    indentedLine(
      `${label("Target", language)}: ${escapeMarkdown(describeTarget(item.target, language))}`,
    ),
    indentedLine(
      `${label("Rationale", language)}: ${escapeMarkdown(
        japanese
          ? semanticDiffReportText("generated.confirmationRationale", language)
          : item.rationale,
      )}`,
    ),
  ];

  if (item.relatedTargets.length > 0) {
    lines.push(
      indentedLine(
        `${label("Related", language)}: ${item.relatedTargets
          .map((target) => escapeMarkdown(describeTarget(target, language)))
          .join(", ")}`,
      ),
    );
  }
  if (item.constraints.length > 0) {
    lines.push(
      ...item.constraints.map((constraint) =>
        indentedLine(
          `${label("Constraint", language)}: ${escapeMarkdown(
            japanese
              ? semanticDiffReportText("generated.constraint", language)
              : constraint,
          )}`,
        ),
      ),
    );
  }

  return lines;
};

const renderConfirmationRequired = (
  items: SemanticDiffConfirmationRequiredItem[],
  language?: string,
): string[] =>
  sectionOrNone(
    [...items]
      .sort((left, right) => compareStrings(left.id, right.id))
      .flatMap((item) => renderConfirmationRequiredItem(item, language)),
    language,
  );

const renderUnsupportedItem = (
  item: SemanticDiffUnsupportedItem,
  language?: string,
): string[] => {
  const lines = [
    bulletLine(
      `[${localizedKind(item.kind, language)}]${item.side ? ` ${localizedKind(item.side, language)}:` : ""} ${escapeMarkdown(item.message)}`,
    ),
  ];
  if (item.target) {
    lines.push(
      indentedLine(
        `${label("Target", language)}: ${escapeMarkdown(describeTarget(item.target, language))}`,
      ),
    );
  }
  return lines;
};

const renderUnsupportedItems = (
  items: SemanticDiffUnsupportedItem[],
  language?: string,
): string[] =>
  sectionOrNone(
    [...items]
      .sort((left, right) => compareStrings(left.id, right.id))
      .flatMap((item) => renderUnsupportedItem(item, language)),
    language,
  );

const renderLimitation = (
  limitation: SemanticDiffLimitation,
  language?: string,
): string => {
  const side = limitation.side
    ? `${localizedKind(limitation.side, language)} `
    : "";
  const path = limitation.unitPath ? ` ${limitation.unitPath}` : "";
  return `[${limitation.kind}:${limitation.code}] ${side}${path} ${limitation.message}`
    .replace(/\s+/g, " ")
    .trim();
};

const renderLimitations = (
  limitations: SemanticDiffLimitation[],
  language?: string,
): string[] =>
  sectionOrNone(
    [...limitations]
      .sort((left, right) =>
        compareStrings(
          `${left.kind}:${left.code}:${left.side ?? ""}:${left.unitPath ?? ""}:${left.message}`,
          `${right.kind}:${right.code}:${right.side ?? ""}:${right.unitPath ?? ""}:${right.message}`,
        ),
      )
      .map((limitation) =>
        bulletLine(escapeMarkdown(renderLimitation(limitation, language))),
      ),
    language,
  );

const renderScheduleRunChange = (
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
  if (change.before) {
    lines.push(
      indentedLine(
        `${label("Before", language)}: ${escapeMarkdown(`${change.before.date} ${change.before.time} ${label("rule", language)} ${change.before.rule}`)}`,
      ),
    );
  }
  if (change.after) {
    lines.push(
      indentedLine(
        `${label("After", language)}: ${escapeMarkdown(`${change.after.date} ${change.after.time} ${label("rule", language)} ${change.after.rule}`)}`,
      ),
    );
  }
  return lines;
};

const renderScheduleComparison = (
  changeSet: SemanticDiffChangeSet,
  language?: string,
): string[] => {
  if (!changeSet.scheduleComparison) {
    return [];
  }

  return [
    `## ${label("Schedule Changes", language)}`,
    "",
    bulletLine(
      semanticDiffReportText("generated.period", language, {
        from: escapeMarkdown(changeSet.scheduleComparison.period.from),
        to: escapeMarkdown(changeSet.scheduleComparison.period.to),
      }),
    ),
    ...sectionOrNone(
      [...changeSet.scheduleComparison.runChanges]
        .sort((left, right) => compareStrings(left.id, right.id))
        .flatMap((change) => renderScheduleRunChange(change, language)),
      language,
    ),
    "",
  ];
};

const renderSummary = (
  changeSet: SemanticDiffChangeSet,
  language?: string,
): string[] => {
  const beforeScope = changeSet.inputs.before.jobGroupPath;
  const afterScope = changeSet.inputs.after.jobGroupPath;
  const scheduleChangeCount =
    changeSet.scheduleComparison?.runChanges.length ?? 0;
  const hasAnyFinding =
    changeSet.changes.length > 0 ||
    changeSet.confirmationRequired.length > 0 ||
    changeSet.unsupportedItems.length > 0 ||
    changeSet.limitations.length > 0 ||
    scheduleChangeCount > 0;

  const lines = [
    bulletLine(
      `${label("Before scope", language)}: ${escapeMarkdown(optionalText(beforeScope))}`,
    ),
    bulletLine(
      `${label("After scope", language)}: ${escapeMarkdown(optionalText(afterScope))}`,
    ),
    bulletLine(
      pluralize(
        changeSet.changes.length,
        label("semantic change", language),
        language,
      ),
    ),
    bulletLine(
      pluralize(
        changeSet.confirmationRequired.length,
        label("confirmation-required item", language),
        language,
      ),
    ),
    bulletLine(
      pluralize(
        changeSet.unsupportedItems.length,
        label("unsupported item", language),
        language,
      ),
    ),
    bulletLine(
      pluralize(
        changeSet.limitations.length,
        label("limitation", language),
        language,
      ),
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
      hasAnyFinding
        ? label(
            "Result: semantic differences or review notes are present.",
            language,
          )
        : label("Result: no semantic changes detected.", language),
    ),
  );

  return lines;
};

export const renderSemanticDiffMarkdown = (
  changeSet: SemanticDiffChangeSet,
  language?: string,
): string => {
  const lines = [
    `# ${label("Semantic Diff Report", language)}`,
    "",
    `## ${label("Summary", language)}`,
    "",
    ...renderSummary(changeSet, language),
    "",
    `## ${label("Structural Changes", language)}`,
    "",
    ...sectionOrNone(
      renderStructuralChanges(changeSet.changes, language),
      language,
    ),
    "",
    `## ${label("Attribute Changes", language)}`,
    "",
    ...renderAttributeChanges(changeSet.changes, language),
    ...renderScheduleComparison(changeSet, language),
    `## ${label("Confirmation Required", language)}`,
    "",
    ...renderConfirmationRequired(changeSet.confirmationRequired, language),
    "",
    `## ${label("Unsupported Items", language)}`,
    "",
    ...renderUnsupportedItems(changeSet.unsupportedItems, language),
    "",
    `## ${label("Limitations", language)}`,
    "",
    ...renderLimitations(changeSet.limitations, language),
  ];

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
};
