import type {
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffDetail,
  SemanticDiffIdentityDecision,
  SemanticDiffOutputContext,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationPair,
  SemanticDiffScheduleRun,
  SemanticDiffUnsupportedItem,
  SemanticDiffLimitation,
  SemanticDiffWarning,
} from "../../application/semantic-diff/semanticDiffDto";
import { semanticDiffReportText } from "./semanticDiffReportText";
import {
  describeTarget,
  escapeMarkdown,
  renderIdentityDecisionEvidence,
} from "./semanticDiffMarkdownLocalization";
import { renderSemanticDiffFullMarkdown } from "./renderSemanticDiffMarkdown";
import type { SemanticDiffMarkdownRenderer } from "./semanticDiffMarkdownTypes";

const auditText = (key: string, language?: string): string =>
  semanticDiffReportText(`audit.${key}`, language);

const auditBullet = (indent: number, value: string): string =>
  `${" ".repeat(indent)}- ${value}`;

const scalar = (value: string | number | null): string =>
  value === null ? "null" : escapeMarkdown(String(value));

const values = (items: string[]): string =>
  `[${items.map((item) => escapeMarkdown(item)).join(", ")}]`;

const relationEndpoint = (endpoint: SemanticDiffRelationEndpoint): string =>
  `${escapeMarkdown(endpoint.sourceUnitPath ?? endpoint.sourceUnitId)} -> ${escapeMarkdown(endpoint.targetUnitPath ?? endpoint.targetUnitId)} (${escapeMarkdown(endpoint.type)}; sourceUnitId=${escapeMarkdown(endpoint.sourceUnitId)}; targetUnitId=${escapeMarkdown(endpoint.targetUnitId)})`;

const relationEndpointText = (
  endpoint: SemanticDiffRelationEndpoint | null,
): string => (endpoint ? relationEndpoint(endpoint) : "null");

const relationPair = (
  pair: SemanticDiffRelationPair | null,
  language?: string,
): string[] => {
  if (!pair) return ["null"];
  return [
    `${escapeMarkdown(pair.canonicalPair.sourceUnitId)}->${escapeMarkdown(pair.canonicalPair.targetUnitId)} (${escapeMarkdown(pair.canonicalPair.type)})`,
    `  ${auditText("before", language)}: ${relationEndpointText(pair.before)}`,
    `  ${auditText("after", language)}: ${relationEndpointText(pair.after)}`,
  ];
};

const period = (value: { from: string; to: string } | null): string =>
  value
    ? `${escapeMarkdown(value.from)} -> ${escapeMarkdown(value.to)}`
    : "null";

const renderAuditDetail = (
  detail: SemanticDiffDetail,
  indent: number,
  language?: string,
): string[] => {
  const lines = [
    auditBullet(
      indent,
      `${auditText("unitPath", language)}: ${scalar(detail.unitPath)}`,
    ),
    auditBullet(
      indent,
      `${auditText("parameterKey", language)}: ${scalar(detail.parameterKey)}`,
    ),
    auditBullet(indent, `${auditText("relationPair", language)}:`),
  ];
  lines.push(
    ...relationPair(detail.relationPair, language).map((line) =>
      auditBullet(indent + 2, line),
    ),
    auditBullet(
      indent,
      `${auditText("scheduleRule", language)}: ${scalar(detail.scheduleRule)}`,
    ),
    auditBullet(
      indent,
      `${auditText("period", language)}: ${period(detail.period)}`,
    ),
    auditBullet(
      indent,
      `${auditText("beforeValues", language)}: ${values(detail.beforeValues)}`,
    ),
    auditBullet(
      indent,
      `${auditText("afterValues", language)}: ${values(detail.afterValues)}`,
    ),
    auditBullet(
      indent,
      `${auditText("rawValues", language)}: ${values(detail.rawValues)}`,
    ),
    auditBullet(
      indent,
      `${auditText("removedSources", language)}: ${values(detail.removedSources)}`,
    ),
  );
  return lines;
};

const renderWarning = (
  warning: SemanticDiffWarning | null,
  indent: number,
  language?: string,
): string[] => {
  if (!warning) {
    return [auditBullet(indent, `${auditText("warning", language)}: null`)];
  }
  return [
    auditBullet(indent, `${auditText("warning", language)}:`),
    auditBullet(
      indent + 2,
      `${auditText("code", language)}: ${escapeMarkdown(warning.code)}`,
    ),
    auditBullet(
      indent + 2,
      `${auditText("fallbackText", language)}: ${scalar(warning.fallbackText)}`,
    ),
    auditBullet(indent + 2, `${auditText("detail", language)}:`),
    ...renderAuditDetail(warning.detail, indent + 4, language),
  ];
};

const renderIdentityReference = (
  reference: SemanticDiffIdentityDecision["before"][number],
): string =>
  `${escapeMarkdown(reference.name)} (${escapeMarkdown(reference.unitType)}) ${escapeMarkdown(reference.absolutePath)} [${escapeMarkdown(reference.id)}]`;

const renderReferences = (
  references: SemanticDiffIdentityDecision["before"],
  indent: number,
  language?: string,
): string[] =>
  references.length === 0
    ? [auditBullet(indent, auditText("none", language))]
    : references.map((reference) =>
        auditBullet(indent, renderIdentityReference(reference)),
      );

const renderAuditIdentityDecision = (
  decision: SemanticDiffIdentityDecision,
  language?: string,
): string[] => [
  auditBullet(0, escapeMarkdown(decision.id)),
  auditBullet(
    2,
    `${auditText("status", language)}: ${escapeMarkdown(decision.status)}`,
  ),
  auditBullet(2, `${auditText("before", language)}:`),
  ...renderReferences(decision.before, 4, language),
  auditBullet(2, `${auditText("after", language)}:`),
  ...renderReferences(decision.after, 4, language),
  ...renderIdentityDecisionEvidence(decision, language),
];

const renderAuditConstraints = (
  constraints: SemanticDiffConfirmationRequiredItem["constraints"],
  indent: number,
  language?: string,
): string[] =>
  constraints.length === 0
    ? [auditBullet(indent, `${auditText("constraints", language)}: []`)]
    : [
        auditBullet(indent, `${auditText("constraints", language)}:`),
        ...constraints.flatMap((constraint) => [
          auditBullet(indent + 2, escapeMarkdown(constraint.code)),
          auditBullet(indent + 4, `${auditText("detail", language)}:`),
          ...renderAuditDetail(constraint.detail, indent + 6, language),
          ...renderWarning(constraint.warning, indent + 4, language),
        ]),
      ];

const renderAuditConfirmation = (
  item: SemanticDiffConfirmationRequiredItem,
  language?: string,
): string[] => [
  auditBullet(0, escapeMarkdown(item.id)),
  auditBullet(
    2,
    `${auditText("reasonCode", language)}: ${escapeMarkdown(item.reasonCode)}`,
  ),
  auditBullet(
    2,
    `${auditText("target", language)}: ${escapeMarkdown(describeTarget(item.target, language))}`,
  ),
  auditBullet(2, `${auditText("detail", language)}:`),
  ...renderAuditDetail(item.detail, 4, language),
  ...renderAuditConstraints(item.constraints, 2, language),
  ...renderWarning(item.warning, 2, language),
  ...(item.relatedTargets.length === 0
    ? [auditBullet(2, `${auditText("relatedTargets", language)}: []`)]
    : [
        auditBullet(2, `${auditText("relatedTargets", language)}:`),
        ...item.relatedTargets.map((target) =>
          auditBullet(4, escapeMarkdown(describeTarget(target, language))),
        ),
      ]),
];

const renderAuditUnsupported = (
  item: SemanticDiffUnsupportedItem,
  language?: string,
): string[] => [
  auditBullet(0, escapeMarkdown(item.id)),
  auditBullet(
    2,
    `${auditText("code", language)}: ${escapeMarkdown(item.kind)}`,
  ),
  auditBullet(2, `${auditText("side", language)}: ${scalar(item.side)}`),
  auditBullet(
    2,
    `${auditText("reasonCode", language)}: ${escapeMarkdown(item.reasonCode)}`,
  ),
  auditBullet(
    2,
    `${auditText("target", language)}: ${item.target ? escapeMarkdown(describeTarget(item.target, language)) : "null"}`,
  ),
  auditBullet(2, `${auditText("detail", language)}:`),
  ...renderAuditDetail(item.detail, 4, language),
  ...renderWarning(item.warning, 2, language),
];

const renderAuditLimitation = (
  limitation: SemanticDiffLimitation,
  language?: string,
): string[] => [
  auditBullet(0, escapeMarkdown(limitation.code)),
  auditBullet(
    2,
    `${auditText("code", language)}: ${escapeMarkdown(limitation.code)}`,
  ),
  auditBullet(2, `${auditText("side", language)}: ${scalar(limitation.side)}`),
  auditBullet(
    2,
    `${auditText("unitPath", language)}: ${scalar(limitation.unitPath)}`,
  ),
  auditBullet(2, `${auditText("detail", language)}:`),
  ...renderAuditDetail(limitation.detail, 4, language),
  ...renderWarning(limitation.warning, 2, language),
];

const renderScheduleRun = (
  run: SemanticDiffScheduleRun | null,
  indent: number,
  language?: string,
): string[] => {
  if (!run) return [auditBullet(indent, "null")];
  return [
    auditBullet(
      indent,
      `${escapeMarkdown(run.unitPath)} (${escapeMarkdown(run.unitName)})`,
    ),
    auditBullet(
      indent + 2,
      `${auditText("scheduleRule", language)}: ${run.rule}`,
    ),
    auditBullet(
      indent + 2,
      `${auditText("period", language)}: ${escapeMarkdown(run.date)} ${escapeMarkdown(run.time)}`,
    ),
  ];
};

const renderAuditSchedule = (
  context: SemanticDiffOutputContext,
  language?: string,
): string[] => {
  const schedule = context.result.scheduleComparison;
  if (!schedule) {
    return [auditBullet(0, `${auditText("scheduleDetails", language)}: null`)];
  }
  return [
    auditBullet(
      0,
      `${auditText("period", language)}: ${period(schedule.period)}`,
    ),
    ...schedule.runChanges.flatMap((change) => [
      auditBullet(0, escapeMarkdown(change.id)),
      auditBullet(
        2,
        `${auditText("code", language)}: ${escapeMarkdown(change.kind)}`,
      ),
      auditBullet(
        2,
        `${auditText("unitPath", language)}: ${escapeMarkdown(change.unitPath)}`,
      ),
      auditBullet(
        2,
        `${auditText("period", language)}: ${escapeMarkdown(change.date)}`,
      ),
      auditBullet(2, `${auditText("before", language)}:`),
      ...renderScheduleRun(change.before, 4, language),
      auditBullet(2, `${auditText("after", language)}:`),
      ...renderScheduleRun(change.after, 4, language),
    ]),
  ];
};

type AuditSection<T> = {
  titleKey: string;
  items: readonly T[];
  compare: (left: T, right: T) => number;
  render: (item: T, language?: string) => string[];
  language?: string;
};

const renderAuditSection = <T>({
  titleKey,
  items,
  compare,
  render,
  language,
}: AuditSection<T>): string[] => [
  `### ${auditText(titleKey, language)}`,
  "",
  ...(items.length === 0
    ? [auditBullet(0, auditText("none", language))]
    : [...items].sort(compare).flatMap((item) => render(item, language))),
  "",
];

const compareById = <T extends { id: string }>(left: T, right: T): number =>
  left.id.localeCompare(right.id);

const compareByCode = <T extends { code: string }>(left: T, right: T): number =>
  left.code.localeCompare(right.code);

/** Render Full facts plus structured evidence for audit and change-control use. */
export const renderSemanticDiffAuditMarkdown: SemanticDiffMarkdownRenderer = (
  context,
  language,
): string => {
  const lines = [
    renderSemanticDiffFullMarkdown(context, language),
    "",
    `## ${auditText("title", language)}`,
    "",
    auditBullet(0, auditText("definitionEvidence", language)),
    "",
    ...renderAuditSection({
      titleKey: "identityDecisions",
      items: context.result.identityDecisions,
      compare: compareById,
      render: renderAuditIdentityDecision,
      language,
    }),
    ...renderAuditSection({
      titleKey: "confirmationDetails",
      items: context.result.confirmationRequired,
      compare: compareById,
      render: renderAuditConfirmation,
      language,
    }),
    ...renderAuditSection({
      titleKey: "unsupportedDetails",
      items: context.result.unsupportedItems,
      compare: compareById,
      render: renderAuditUnsupported,
      language,
    }),
    ...renderAuditSection({
      titleKey: "limitationDetails",
      items: context.result.limitations,
      compare: compareByCode,
      render: renderAuditLimitation,
      language,
    }),
    `### ${auditText("scheduleDetails", language)}`,
    "",
    ...renderAuditSchedule(context, language),
  ];
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
};
