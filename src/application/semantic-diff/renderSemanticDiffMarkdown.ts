import type {
  SemanticDiffAttributeCategory,
  SemanticDiffChange,
  SemanticDiffChangeSet,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffLimitation,
  SemanticDiffTarget,
  SemanticDiffUnsupportedItem,
} from "../../domain/models/semantic-diff/SemanticDiff";

const attributeCategoryLabels: Record<SemanticDiffAttributeCategory, string> = {
  "execution-environment": "Execution Environment",
  "execution-definition": "Execution Definition",
  "start-condition": "Start Condition",
  "end-control": "End Control",
  "abnormal-end-control": "Abnormal End Control",
  "wait-condition": "Wait Condition",
  "external-integration": "External Integration",
  schedule: "Schedule",
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

const structuralElementOrder = new Map<string, number>([
  ["job-group", 0],
  ["jobnet", 1],
  ["unit", 2],
  ["relation", 3],
]);

const compareStrings = (left: string, right: string): number =>
  left.localeCompare(right);

const compareChanges = (
  left: SemanticDiffChange,
  right: SemanticDiffChange,
): number => compareStrings(left.id, right.id);

const pluralize = (count: number, label: string): string =>
  `${count} ${label}${count === 1 ? "" : "s"}`;

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

const describeTarget = (target: SemanticDiffTarget | undefined): string => {
  if (!target) {
    return "(none)";
  }
  if (target.kind === "job-group") {
    return `job-group ${optionalText(target.path)}`;
  }
  if (target.kind === "jobnet" || target.kind === "unit") {
    return `${target.kind} ${target.unit.absolutePath}`;
  }
  if (target.kind === "relation") {
    return `relation ${describeRelationTarget(target)}`;
  }
  if (target.kind === "attribute") {
    return `attribute ${target.parameterKey} on ${target.unit.absolutePath}`;
  }
  return "(unknown)";
};

const bulletLine = (value: string): string => `- ${value}`;

const indentedLine = (value: string): string => `  - ${value}`;

const sectionOrNone = (lines: string[]): string[] =>
  lines.length > 0 ? lines : [bulletLine("None")];

const renderChangeDetails = (change: SemanticDiffChange): string[] => {
  const lines: string[] = [
    bulletLine(
      `[${change.confirmationLevel}] ${change.kind} ${change.elementKind}: ${escapeMarkdown(change.summary)}`,
    ),
  ];
  if (change.before) {
    lines.push(
      indentedLine(`Before: ${escapeMarkdown(describeTarget(change.before))}`),
    );
  }
  if (change.after) {
    lines.push(
      indentedLine(`After: ${escapeMarkdown(describeTarget(change.after))}`),
    );
  }
  if (change.rationale) {
    lines.push(indentedLine(`Rationale: ${escapeMarkdown(change.rationale)}`));
  }
  return lines;
};

const renderStructuralChanges = (changes: SemanticDiffChange[]): string[] =>
  changes
    .filter((change) => change.elementKind !== "attribute")
    .sort((left, right) => {
      const elementComparison =
        (structuralElementOrder.get(left.elementKind) ?? 99) -
        (structuralElementOrder.get(right.elementKind) ?? 99);
      return elementComparison || compareChanges(left, right);
    })
    .flatMap(renderChangeDetails);

const renderAttributeChanges = (changes: SemanticDiffChange[]): string[] => {
  const attributeChanges = changes.filter(
    (change) => change.elementKind === "attribute",
  );

  if (attributeChanges.length === 0) {
    return [bulletLine("None")];
  }

  return attributeCategoryOrder.flatMap((category) => {
    const categoryChanges = attributeChanges
      .filter((change) => change.attributeCategory === category)
      .sort(compareChanges);

    if (categoryChanges.length === 0) {
      return [];
    }

    return [
      `### ${attributeCategoryLabels[category]}`,
      "",
      ...categoryChanges.flatMap(renderChangeDetails),
      "",
    ];
  });
};

const renderConfirmationRequiredItem = (
  item: SemanticDiffConfirmationRequiredItem,
): string[] => {
  const lines = [
    bulletLine(escapeMarkdown(item.changeContent)),
    indentedLine(`Target: ${escapeMarkdown(describeTarget(item.target))}`),
    indentedLine(`Rationale: ${escapeMarkdown(item.rationale)}`),
  ];

  if (item.relatedTargets.length > 0) {
    lines.push(
      indentedLine(
        `Related: ${item.relatedTargets
          .map((target) => escapeMarkdown(describeTarget(target)))
          .join(", ")}`,
      ),
    );
  }
  if (item.constraints.length > 0) {
    lines.push(
      ...item.constraints.map((constraint) =>
        indentedLine(`Constraint: ${escapeMarkdown(constraint)}`),
      ),
    );
  }

  return lines;
};

const renderConfirmationRequired = (
  items: SemanticDiffConfirmationRequiredItem[],
): string[] =>
  sectionOrNone(
    [...items]
      .sort((left, right) => compareStrings(left.id, right.id))
      .flatMap(renderConfirmationRequiredItem),
  );

const renderUnsupportedItem = (item: SemanticDiffUnsupportedItem): string[] => {
  const lines = [
    bulletLine(
      `[${item.kind}]${item.side ? ` ${item.side}:` : ""} ${escapeMarkdown(item.message)}`,
    ),
  ];
  if (item.target) {
    lines.push(
      indentedLine(`Target: ${escapeMarkdown(describeTarget(item.target))}`),
    );
  }
  return lines;
};

const renderUnsupportedItems = (
  items: SemanticDiffUnsupportedItem[],
): string[] =>
  sectionOrNone(
    [...items]
      .sort((left, right) => compareStrings(left.id, right.id))
      .flatMap(renderUnsupportedItem),
  );

const renderLimitation = (limitation: SemanticDiffLimitation): string => {
  const side = limitation.side ? `${limitation.side} ` : "";
  const path = limitation.unitPath ? ` ${limitation.unitPath}` : "";
  return `[${limitation.kind}:${limitation.code}] ${side}${path} ${limitation.message}`
    .replace(/\s+/g, " ")
    .trim();
};

const renderLimitations = (limitations: SemanticDiffLimitation[]): string[] =>
  sectionOrNone(
    [...limitations]
      .sort((left, right) =>
        compareStrings(
          `${left.kind}:${left.code}:${left.side ?? ""}:${left.unitPath ?? ""}:${left.message}`,
          `${right.kind}:${right.code}:${right.side ?? ""}:${right.unitPath ?? ""}:${right.message}`,
        ),
      )
      .map((limitation) =>
        bulletLine(escapeMarkdown(renderLimitation(limitation))),
      ),
  );

const renderSummary = (changeSet: SemanticDiffChangeSet): string[] => {
  const beforeScope = changeSet.inputs.before.jobGroupPath;
  const afterScope = changeSet.inputs.after.jobGroupPath;
  const hasAnyFinding =
    changeSet.changes.length > 0 ||
    changeSet.confirmationRequired.length > 0 ||
    changeSet.unsupportedItems.length > 0 ||
    changeSet.limitations.length > 0;

  return [
    bulletLine(`Before scope: ${escapeMarkdown(optionalText(beforeScope))}`),
    bulletLine(`After scope: ${escapeMarkdown(optionalText(afterScope))}`),
    bulletLine(pluralize(changeSet.changes.length, "semantic change")),
    bulletLine(
      pluralize(
        changeSet.confirmationRequired.length,
        "confirmation-required item",
      ),
    ),
    bulletLine(
      pluralize(changeSet.unsupportedItems.length, "unsupported item"),
    ),
    bulletLine(pluralize(changeSet.limitations.length, "limitation")),
    bulletLine(
      hasAnyFinding
        ? "Result: semantic differences or review notes are present."
        : "Result: no semantic changes detected.",
    ),
  ];
};

export const renderSemanticDiffMarkdown = (
  changeSet: SemanticDiffChangeSet,
): string => {
  const lines = [
    "# Semantic Diff Report",
    "",
    "## Summary",
    "",
    ...renderSummary(changeSet),
    "",
    "## Structural Changes",
    "",
    ...sectionOrNone(renderStructuralChanges(changeSet.changes)),
    "",
    "## Attribute Changes",
    "",
    ...renderAttributeChanges(changeSet.changes),
    "## Confirmation Required",
    "",
    ...renderConfirmationRequired(changeSet.confirmationRequired),
    "",
    "## Unsupported Items",
    "",
    ...renderUnsupportedItems(changeSet.unsupportedItems),
    "",
    "## Limitations",
    "",
    ...renderLimitations(changeSet.limitations),
  ];

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
};
