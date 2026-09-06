import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import {
  filterSemanticDiffExplorerViewModel,
  type SemanticDiffExplorerLeaf,
  type SemanticDiffExplorerTreeNode,
  type SemanticDiffExplorerViewModel,
} from "../../../application/semantic-diff/semanticDiffExplorer";
import type {
  SemanticDiffDetail,
  SemanticDiffTarget,
} from "../../../application/semantic-diff/semanticDiffDto";
import {
  getSemanticDiffExplorerLabels,
  semanticDiffExplorerCardLabel,
  type SemanticDiffExplorerLabels,
} from "./semanticDiffExplorerLocalization";

export type SemanticDiffExplorerViewProps = Readonly<{
  viewModel: SemanticDiffExplorerViewModel;
  language?: string;
  outputAction?: (element?: HTMLElement) => void;
  action?: (actionId: string, element?: HTMLElement) => void;
  hostAnnouncement?: string;
  /** Optional host for deterministic verification of the imperative path. */
  virtualizedScrollToIndex?: (index: number) => void;
}>;

type ExplorerRow = Readonly<{
  id: string;
  kind: "group" | "leaf";
  level: number;
  position: number;
  size: number;
  parentId: string | undefined;
  node?: SemanticDiffExplorerTreeNode;
  leaf?: SemanticDiffExplorerLeaf;
  expanded?: boolean;
}>;

const targetLabel = (
  target: SemanticDiffTarget | null,
  labels: SemanticDiffExplorerLabels,
): string => {
  if (!target) return "";
  switch (target.kind) {
    case "job-group":
      return target.path ?? labels.value("job-group");
    case "unit":
    case "jobnet":
      return target.unit.absolutePath || target.unit.name;
    case "attribute":
      return `${target.unit.absolutePath || target.unit.name} (${target.parameterKey})`;
    case "relation":
      return `${target.relation.sourceUnitId} → ${target.relation.targetUnitId}`;
  }
};

type LeafFacts = Readonly<{
  changeKind: string | null;
  state: string;
  unsupportedKind: string | null;
  reason: string | null;
}>;

const leafFacts = (
  leaf: SemanticDiffExplorerLeaf,
  labels: SemanticDiffExplorerLabels,
): LeafFacts => {
  switch (leaf.kind) {
    case "change":
      return {
        changeKind: labels.state(leaf.changeKind),
        state: labels.state(leaf.confirmationLevel),
        unsupportedKind: null,
        reason: null,
      };
    case "confirmation":
      return {
        changeKind: null,
        state: labels.state("confirmation-required"),
        unsupportedKind: null,
        reason: labels.reason(leaf.reasonCode),
      };
    case "unsupported": {
      const unsupportedKind = labels.state(leaf.unsupportedKind);
      return {
        changeKind: null,
        state: labels.state("unsupported"),
        unsupportedKind:
          unsupportedKind === labels.state("unsupported")
            ? null
            : unsupportedKind,
        reason: labels.reason(leaf.reasonCode),
      };
    }
    case "limitation": {
      const limitationKind = labels.state(leaf.limitationKind);
      return {
        changeKind: null,
        state: labels.state("limitation"),
        unsupportedKind:
          limitationKind === labels.state("limitation") ? null : limitationKind,
        reason: labels.state(leaf.code),
      };
    }
    case "schedule":
      return {
        changeKind: null,
        state: labels.state(leaf.change.kind),
        unsupportedKind: null,
        reason: null,
      };
  }
};

const leafTarget = (
  leaf: SemanticDiffExplorerLeaf,
): SemanticDiffTarget | null =>
  leaf.kind === "limitation" || leaf.kind === "schedule"
    ? null
    : leaf.target.value;

const flattenTree = (
  root: SemanticDiffExplorerTreeNode,
  expanded: ReadonlySet<string>,
): ExplorerRow[] => {
  const rows: ExplorerRow[] = [];
  const appendNode = (
    node: SemanticDiffExplorerTreeNode,
    level: number,
    parentId: string | undefined,
    position: number,
    size: number,
  ): void => {
    if (node.kind !== "root") {
      rows.push({
        id: node.id,
        kind: "group",
        level,
        position,
        size,
        parentId,
        node,
        expanded: expanded.has(node.id),
      });
    }
    if (node.kind !== "root" && !expanded.has(node.id)) return;
    const childCount = node.leaves.length + node.children.length;
    node.leaves.forEach((leaf, index) => {
      rows.push({
        id: leaf.id,
        kind: "leaf",
        level: node.kind === "root" ? level + 1 : level + 1,
        position: index + 1,
        size: childCount,
        parentId: node.id,
        leaf,
      });
    });
    node.children.forEach((child, index) =>
      appendNode(
        child,
        level + 1,
        node.id,
        node.leaves.length + index + 1,
        childCount,
      ),
    );
  };
  appendNode(root, 0, undefined, 1, 1);
  return rows;
};

export const flattenSemanticDiffExplorerTree = flattenTree;

const allExpandableNodeIds = (
  root: SemanticDiffExplorerTreeNode,
): Set<string> => {
  const ids = new Set<string>();
  const visit = (node: SemanticDiffExplorerTreeNode): void => {
    if (node.kind !== "root") ids.add(node.id);
    node.children.forEach(visit);
  };
  visit(root);
  return ids;
};

const cardLabel = (id: string, language: string): string =>
  semanticDiffExplorerCardLabel(id, language);

const leafLabel = (
  leaf: SemanticDiffExplorerLeaf,
  labels: SemanticDiffExplorerLabels,
): string => {
  const target = targetLabel(leafTarget(leaf), labels);
  const facts = leafFacts(leaf, labels);
  return [
    facts.changeKind,
    facts.state,
    facts.unsupportedKind,
    facts.reason,
    target || null,
  ]
    .filter((value): value is string => value !== null && value.length > 0)
    .join(" — ");
};

const rowLabel = (
  row: ExplorerRow,
  labels: SemanticDiffExplorerLabels,
): string =>
  row.kind === "group"
    ? labels.group(row.node?.label ?? "")
    : leafLabel(row.leaf!, labels);

export const focusExplorerRowAfterVirtualizedScroll = (
  id: string,
  getElement: (rowId: string) => HTMLElement | undefined,
  focus: (element: HTMLElement) => void,
  requestAnimationFrame: (callback: FrameRequestCallback) => number,
  maxAttempts = 8,
): void => {
  let attempts = 0;
  const focusAfterScroll = (): void => {
    const rendered = getElement(id);
    if (rendered) {
      focus(rendered);
      return;
    }
    attempts += 1;
    if (attempts < maxAttempts) requestAnimationFrame(focusAfterScroll);
  };
  requestAnimationFrame(focusAfterScroll);
};

const detailLabel = (
  detail: SemanticDiffDetail,
  labels: SemanticDiffExplorerLabels,
): string => {
  const values = (label: string, entries: readonly string[]): string =>
    entries.length > 0
      ? `${labels.detailField(label)}: ${entries.join(", ")}`
      : "";
  return [
    detail.unitPath ? `${labels.detailField("unit")}: ${detail.unitPath}` : "",
    detail.parameterKey
      ? `${labels.detailField("parameter")}: ${detail.parameterKey}`
      : "",
    values("before", detail.beforeValues),
    values("after", detail.afterValues),
    values("raw", detail.rawValues),
    detail.removedSources.length > 0
      ? `${labels.detailField("removed")}: ${detail.removedSources.join(", ")}`
      : "",
    detail.period
      ? `${labels.detailField("period")}: ${detail.period.from}–${detail.period.to}`
      : "",
  ]
    .filter((value) => value.length > 0)
    .join(" · ");
};

const leafDetails = (
  leaf: SemanticDiffExplorerLeaf,
  labels: SemanticDiffExplorerLabels,
): string => {
  if (leaf.kind === "schedule") {
    const run = leaf.change.after ?? leaf.change.before;
    return run
      ? `${labels.detailField("unit")}: ${leaf.change.unitPath} · ${run.date} ${run.time}`
      : leaf.change.unitPath;
  }
  const details: string[] = [];
  if (leaf.detail) details.push(detailLabel(leaf.detail, labels));
  if ("constraints" in leaf) {
    leaf.constraints.forEach((constraint) =>
      details.push(labels.detailField(constraint.code)),
    );
  }
  if ("warning" in leaf && leaf.warning) {
    details.push(`${labels.warning}: ${labels.reason(leaf.warning.code)}`);
  }
  return details.filter((value) => value.length > 0).join(" · ");
};

const actionButton = (
  actionId: string | null,
  label: string,
  unavailable: string,
  onAction: ((id: string, element?: HTMLElement) => void) | undefined,
): React.ReactElement => (
  <button
    type="button"
    disabled={actionId === null}
    aria-label={actionId === null ? `${label}: ${unavailable}` : label}
    onClick={(event) => {
      if (actionId !== null) onAction?.(actionId, event.currentTarget);
    }}
  >
    {label}
  </button>
);

const unavailableActionLabel = (
  action: SemanticDiffExplorerLeaf["actions"]["source"],
  labels: SemanticDiffExplorerLabels,
): string =>
  action.unavailableReason
    ? labels.reason(action.unavailableReason)
    : labels.unavailable;

const ExplorerRowView = ({
  row,
  selected,
  labels,
  onSelect,
  onToggle,
  onAction,
  rowRef,
}: Readonly<{
  row: ExplorerRow;
  selected: boolean;
  labels: SemanticDiffExplorerLabels;
  onSelect: () => void;
  onToggle: () => void;
  onAction?: (id: string, element?: HTMLElement) => void;
  rowRef: (element: HTMLElement | null) => void;
}>): React.ReactElement => {
  if (row.kind === "group" && row.node) {
    return (
      <div
        ref={rowRef}
        role="treeitem"
        id={row.id}
        aria-level={row.level}
        aria-posinset={row.position}
        aria-setsize={row.size}
        aria-expanded={row.expanded}
        aria-selected={selected}
        data-row-id={row.id}
        onClick={onToggle}
      >
        <span aria-hidden="true">{row.expanded ? "▾" : "▸"}</span>{" "}
        {labels.group(row.node.label)}
      </div>
    );
  }
  const leaf = row.leaf!;
  const details = leafDetails(leaf, labels);
  const facts = leafFacts(leaf, labels);
  const target = targetLabel(leafTarget(leaf), labels);
  return (
    <div
      ref={rowRef}
      role="treeitem"
      id={row.id}
      aria-level={row.level}
      aria-posinset={row.position}
      aria-setsize={row.size}
      aria-selected={selected}
      data-row-id={row.id}
      onClick={onSelect}
    >
      {facts.changeKind ? (
        <span data-fact="change-kind">{facts.changeKind}</span>
      ) : null}
      <span
        data-fact="state"
        aria-label={`${labels.stateLabel}: ${facts.state}`}
      >
        {facts.state}
      </span>
      {facts.unsupportedKind ? (
        <span data-fact="unsupported-kind"> {facts.unsupportedKind}</span>
      ) : null}
      {facts.reason ? <span data-fact="reason"> {facts.reason}</span> : null}
      {target ? <span data-fact="target"> {target}</span> : null}
      {details ? (
        <small aria-label={`${labels.details}: ${details}`}> {details}</small>
      ) : null}
      <span role="group" aria-label={labels.availableActions}>
        {actionButton(
          leaf.actions.source.actionId,
          labels.source,
          unavailableActionLabel(leaf.actions.source, labels),
          onAction,
        )}
        {actionButton(
          leaf.actions.flow.actionId,
          labels.flow,
          unavailableActionLabel(leaf.actions.flow, labels),
          onAction,
        )}
      </span>
    </div>
  );
};

export const SemanticDiffExplorerView = ({
  viewModel,
  language = "en",
  outputAction,
  action,
  hostAnnouncement,
  virtualizedScrollToIndex,
}: SemanticDiffExplorerViewProps): React.ReactElement => {
  const labels = getSemanticDiffExplorerLabels(language);
  const [filter, setFilter] = useState(viewModel.filter);
  const [expanded, setExpanded] = useState<Set<string>>(() =>
    allExpandableNodeIds(viewModel.tree),
  );
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [announcement, setAnnouncement] = useState("");
  const latentSelection = useRef<string | undefined>(undefined);
  const filterRef = useRef<HTMLSelectElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const rowElements = useRef(new Map<string, HTMLElement>());
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const mounted = useRef(true);
  const baseViewModel =
    viewModel.filter === "all"
      ? viewModel
      : filterSemanticDiffExplorerViewModel(viewModel, "all");
  const filteredViewModel = useMemo(
    () => filterSemanticDiffExplorerViewModel(baseViewModel, filter),
    [baseViewModel, filter],
  );
  const rows = useMemo(
    () => flattenTree(filteredViewModel.tree, expanded),
    [expanded, filteredViewModel.tree],
  );
  const selectedIndex = rows.findIndex((row) => row.id === selectedId);
  // Keep a hidden selection as latent state while exposing the first visible
  // row as the deterministic active descendant during a filtered view.
  const activeIndex =
    selectedIndex >= 0 ? selectedIndex : rows.length > 0 ? 0 : -1;
  const activeId = activeIndex >= 0 ? rows[activeIndex]!.id : undefined;

  useEffect(() => {
    if (hostAnnouncement) setAnnouncement(hostAnnouncement);
  }, [hostAnnouncement]);

  useEffect(() => {
    if (rows.length === 0) {
      return;
    }
    if (!selectedId) {
      const latent = latentSelection.current;
      setSelectedId(
        latent && rows.some((row) => row.id === latent) ? latent : rows[0]!.id,
      );
    }
  }, [rows, selectedId]);

  const focusSelected = useCallback(
    (id: string) => {
      latentSelection.current = id;
      setSelectedId(id);
      const element = rowElements.current.get(id);
      if (element) {
        element.scrollIntoView({ block: "nearest" });
        treeRef.current?.focus({ preventScroll: true });
        return;
      }
      const index = rows.findIndex((row) => row.id === id);
      if (
        index < 0 ||
        rows.length <= 200 ||
        (!virtuosoRef.current && !virtualizedScrollToIndex)
      )
        return;
      if (virtualizedScrollToIndex) {
        virtualizedScrollToIndex(index);
      } else {
        virtuosoRef.current.scrollToIndex({
          index,
          align: "center",
          behavior: "auto",
        });
      }
      focusExplorerRowAfterVirtualizedScroll(
        id,
        (rowId) => rowElements.current.get(rowId),
        () => {
          if (mounted.current) treeRef.current?.focus({ preventScroll: true });
        },
        window.requestAnimationFrame,
      );
    },
    [rows, virtualizedScrollToIndex],
  );

  const toggleExpanded = useCallback((id: string): void => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const onTreeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const row = rows[activeIndex];
    if (!row) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next =
        event.key === "ArrowDown"
          ? Math.min(rows.length - 1, selectedIndex < 0 ? 0 : selectedIndex + 1)
          : Math.max(0, selectedIndex < 0 ? 0 : selectedIndex - 1);
      focusSelected(rows[next]!.id);
      setAnnouncement(labels.selected(rowLabel(rows[next]!, labels)));
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next = rows[event.key === "Home" ? 0 : rows.length - 1]!;
      focusSelected(next.id);
      setAnnouncement(labels.selected(rowLabel(next, labels)));
      return;
    }
    if (event.key === "Enter" && row.kind === "leaf") {
      event.preventDefault();
      focusSelected(row.id);
      setAnnouncement(labels.selected(rowLabel(row, labels)));
      return;
    }
    if (row.kind === "group" && event.key === "Enter") {
      event.preventDefault();
      toggleExpanded(row.id);
      setAnnouncement(
        row.expanded
          ? labels.collapsed(labels.group(row.node?.label ?? ""))
          : labels.expanded(labels.group(row.node?.label ?? "")),
      );
      return;
    }
    if (event.key === "ArrowRight") {
      if (row.kind === "group" && !row.expanded) {
        event.preventDefault();
        toggleExpanded(row.id);
        setAnnouncement(labels.expanded(labels.group(row.node?.label ?? "")));
        return;
      }
      const child = rows[activeIndex + 1];
      if (child?.parentId === row.id) {
        event.preventDefault();
        focusSelected(child.id);
        setAnnouncement(labels.selected(rowLabel(child, labels)));
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      if (row.kind === "group" && row.expanded) {
        event.preventDefault();
        toggleExpanded(row.id);
        setAnnouncement(labels.collapsed(labels.group(row.node?.label ?? "")));
        return;
      }
      if (row.parentId) {
        const parent = rows.find((candidate) => candidate.id === row.parentId);
        if (parent) {
          event.preventDefault();
          focusSelected(parent.id);
          setAnnouncement(labels.selected(rowLabel(parent, labels)));
        }
      }
    }
  };

  const registerRow = useCallback((id: string, element: HTMLElement | null) => {
    if (element) rowElements.current.set(id, element);
    else rowElements.current.delete(id);
  }, []);

  const renderRow = useCallback(
    (_index: number, row: ExplorerRow) => (
      <ExplorerRowView
        row={row}
        selected={row.id === selectedId}
        labels={labels}
        onSelect={() => {
          focusSelected(row.id);
          setAnnouncement(labels.selected(rowLabel(row, labels)));
        }}
        onToggle={() => {
          focusSelected(row.id);
          toggleExpanded(row.id);
          setAnnouncement(
            row.expanded
              ? labels.collapsed(labels.group(row.node?.label ?? ""))
              : labels.expanded(labels.group(row.node?.label ?? "")),
          );
        }}
        onAction={(id, element) => action?.(id, element)}
        rowRef={(element) => registerRow(row.id, element)}
      />
    ),
    [action, focusSelected, labels, registerRow, selectedId, toggleExpanded],
  );

  return (
    <main aria-labelledby="semantic-diff-explorer-title">
      <header>
        <h1 id="semantic-diff-explorer-title">{labels.title}</h1>
        <button
          type="button"
          onClick={(event) => outputAction?.(event.currentTarget)}
        >
          {labels.output}
        </button>
        <label>
          {labels.filter}
          <select
            value={filter}
            ref={filterRef}
            aria-label={labels.filter}
            onChange={(event) => {
              const next = event.target.value as
                | "all"
                | "confirmation-required";
              setFilter(next);
              filterRef.current?.focus();
              setAnnouncement(
                next === "all" ? labels.all : labels.confirmationRequired,
              );
            }}
          >
            <option value="all">{labels.all}</option>
            <option value="confirmation-required">
              {labels.confirmationRequired}
            </option>
          </select>
        </label>
      </header>
      <section aria-label={labels.summaryCards}>
        {filteredViewModel.cards.map((card) => (
          <article
            key={card.id}
            aria-label={`${cardLabel(card.id, language)}: ${card.count}`}
          >
            <h2>{cardLabel(card.id, language)}</h2>
            <output>{card.count}</output>
            <dl>
              {Object.entries(card.counts).map(([key, count]) => (
                <div key={key}>
                  <dt>{labels.value(key)}</dt>
                  <dd>{count}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>
      <p role="status">
        {filteredViewModel.status === "findings"
          ? labels.findings
          : filteredViewModel.status === "empty"
            ? labels.empty
            : labels.filterEmpty}
      </p>
      <div aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div
        ref={treeRef}
        role="tree"
        tabIndex={0}
        aria-activedescendant={activeId}
        aria-label={labels.tree}
        style={{
          minHeight: "12rem",
          height: "calc(100vh - 10rem)",
          overflow: "auto",
        }}
        onKeyDown={onTreeKeyDown}
      >
        {rows.length > 200 ? (
          <Virtuoso
            ref={virtuosoRef}
            data={rows}
            totalCount={rows.length}
            overscan={20 * 48}
            itemContent={renderRow}
          />
        ) : (
          rows.map((row, index) => (
            <React.Fragment key={row.id}>
              {renderRow(index, row)}
            </React.Fragment>
          ))
        )}
      </div>
    </main>
  );
};

export default SemanticDiffExplorerView;
