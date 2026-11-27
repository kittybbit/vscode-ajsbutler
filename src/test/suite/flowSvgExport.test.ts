import * as assert from "assert";
import { JSDOM } from "jsdom";
import type { Edge, Node } from "@xyflow/react";
import type { FlowNodeData } from "../../presentation/webview/editor/ajsFlow/flowNodePresentationModel";
import { createFlowSvg } from "../../presentation/webview/editor/ajsFlow/flowSvgExport";

const unitNode = (
  id: string,
  x: number,
  y: number,
  data: Partial<FlowNodeData> = {},
): Node<FlowNodeData> =>
  ({
    id,
    type: "job",
    position: { x, y },
    width: 160,
    height: 88,
    data: {
      unitId: id,
      label: id,
      ty: "j",
      isRootJobnet: false,
      ...data,
    },
  }) as Node<FlowNodeData>;

const parseSvg = (svg: string): Document => {
  const dom = new JSDOM(svg, { contentType: "image/svg+xml" });
  const document = dom.window.document;
  assert.strictEqual(document.documentElement.localName, "svg");
  assert.strictEqual(document.querySelector("parsererror"), null);
  dom.window.close();
  return document;
};

suite("Flow SVG export", () => {
  test("serializes standalone XML with full bounds, expanded panels, relations, and safe labels", () => {
    const nodes = [
      unitNode("/root/net", -280, -140, {
        label: '日本語 <& "root"',
        comment: "備考 & <job>",
        ty: "n",
        isRootJobnet: true,
      }),
      unitNode("/root/net/job", 820, 470, { label: "child 日本語" }),
      {
        id: "/root/net::nested-panel-bounds",
        type: "group",
        position: { x: -320, y: -180 },
        width: 1380,
        height: 820,
        data: { label: "" },
      } as unknown as Node<FlowNodeData>,
    ];
    const edges: Edge[] = [
      { id: "seq", source: "/root/net", target: "/root/net/job" },
      {
        id: "con",
        source: "/root/net/job",
        target: "/root/net",
        markerStart: "url(#condition-start)",
      },
    ];

    const result = createFlowSvg(nodes, edges);
    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    const document = parseSvg(result.image.svg);
    const svg = document.documentElement;

    assert.strictEqual(svg.getAttribute("width"), String(result.image.width));
    assert.strictEqual(svg.getAttribute("height"), String(result.image.height));
    assert.ok(result.image.width > 1380);
    assert.ok(result.image.height > 820);
    assert.strictEqual(svg.querySelectorAll("g > title").length, 2);
    assert.strictEqual(svg.querySelectorAll("path[marker-end]").length, 2);
    assert.strictEqual(
      svg.querySelectorAll('path[marker-start="url(#flow-arrow)"]').length,
      1,
    );
    assert.ok(svg.textContent?.includes('日本語 <& "root"'));
    assert.ok(svg.textContent?.includes("child 日本語"));
    assert.strictEqual(
      svg.querySelectorAll("script, foreignObject, image").length,
      0,
    );
    assert.strictEqual(
      svg.querySelectorAll("[href], [xlink\\:href]").length,
      0,
    );
    assert.ok(!result.image.svg.includes("\u0001"));
  });

  test("does not include interaction emphasis and strips XML-invalid characters", () => {
    const base = unitNode("job", 0, 0, {
      label: `a\u0001\uD800 & <b>`,
      semanticDiffHighlight: { kind: "changed", changeIds: [] } as never,
      isHovered: true,
      isSelected: true,
      isSearchMatch: true,
    });
    const plain = unitNode("job", 0, 0, { label: `a\u0001\uD800 & <b>` });
    const highlighted = createFlowSvg([base], []);
    const unhighlighted = createFlowSvg([plain], []);

    assert.strictEqual(highlighted.status, "available");
    assert.strictEqual(unhighlighted.status, "available");
    if (
      highlighted.status !== "available" ||
      unhighlighted.status !== "available"
    )
      return;
    assert.strictEqual(highlighted.image.svg, unhighlighted.image.svg);
    assert.ok(highlighted.image.svg.includes("a &amp; &lt;b&gt;"));
    assert.doesNotThrow(() => parseSvg(highlighted.image.svg));
  });

  test("keeps a real unit whose id ends like a synthetic panel and its relation", () => {
    const source = unitNode("report", 0, 0);
    const suffixNamedUnit = unitNode("report::nested-panel-bounds", 240, 0);
    const result = createFlowSvg(
      [source, suffixNamedUnit],
      [
        {
          id: "real-suffix-relation",
          source: source.id,
          target: suffixNamedUnit.id,
        },
      ],
    );

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    const svg = parseSvg(result.image.svg);
    assert.deepStrictEqual(
      Array.from(svg.querySelectorAll("g > title")).map(
        (title) => title.textContent,
      ),
      ["report", "report::nested-panel-bounds"],
    );
    assert.strictEqual(svg.querySelectorAll("path[marker-end]").length, 1);
  });

  test("bounds long Latin and Japanese labels with SVG text length adjustment", () => {
    const wideLatin = "W".repeat(20);
    const wideJapanese = "日本語".repeat(8);
    const result = createFlowSvg(
      [
        unitNode("wide-latin", 0, 0, { label: wideLatin }),
        unitNode("wide-japanese", 240, 0, { label: wideJapanese }),
      ],
      [],
    );

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    const document = parseSvg(result.image.svg);
    assert.match(
      document.documentElement.getAttribute("font-family") ?? "",
      /Noto Sans CJK JP.*Yu Gothic.*Meiryo/s,
    );
    const labels = Array.from(document.querySelectorAll('g > text[y="53"]'));
    assert.strictEqual(labels.length, 2);
    for (const label of labels) {
      assert.strictEqual(label.getAttribute("textLength"), "136");
      assert.strictEqual(
        label.getAttribute("lengthAdjust"),
        "spacingAndGlyphs",
      );
      assert.ok(label.textContent?.endsWith("…"));
    }
    assert.ok(
      Array.from(document.querySelectorAll("g > title")).some(
        (title) => title.textContent === wideLatin,
      ),
    );
    assert.ok(
      Array.from(document.querySelectorAll("g > title")).some(
        (title) => title.textContent === wideJapanese,
      ),
    );
  });

  test("rejects empty or invalid geometry instead of emitting a partial graph", () => {
    assert.deepStrictEqual(createFlowSvg([], []), {
      status: "unavailable",
      reason: "empty-graph",
    });
    assert.deepStrictEqual(createFlowSvg([unitNode("job", NaN, 0)], []), {
      status: "unavailable",
      reason: "invalid-geometry",
    });
    assert.deepStrictEqual(
      createFlowSvg(
        [unitNode("job", 0, 0)],
        [{ id: "missing", source: "job", target: "absent" }],
      ),
      { status: "unavailable", reason: "invalid-geometry" },
    );
    assert.deepStrictEqual(
      createFlowSvg([unitNode("extreme", Number.MAX_VALUE, 0)], []),
      { status: "unavailable", reason: "invalid-geometry" },
    );
    assert.deepStrictEqual(
      createFlowSvg(
        [
          unitNode("left-extreme", -Number.MAX_VALUE, 0),
          unitNode("right-extreme", Number.MAX_VALUE, 0),
        ],
        [],
      ),
      { status: "unavailable", reason: "invalid-geometry" },
    );
    assert.deepStrictEqual(
      createFlowSvg(
        [unitNode("job", 0, 0)],
        [
          {
            id: "broken",
            target: "job",
            get source(): string {
              throw new Error("unexpected edge getter failure");
            },
          } as unknown as Edge,
        ],
      ),
      { status: "unavailable", reason: "invalid-geometry" },
    );
  });

  test("serializes a 1,000-unit graph with every relation and finite image bounds", () => {
    const count = 1000;
    const nodes = Array.from({ length: count }, (_, index) =>
      unitNode(`job-${index}`, index * 180, (index % 20) * 112),
    );
    const edges: Edge[] = Array.from({ length: count - 1 }, (_, index) => ({
      id: `edge-${index}`,
      source: `job-${index}`,
      target: `job-${index + 1}`,
    }));
    const startedAt = performance.now();
    const result = createFlowSvg(nodes, edges);
    const elapsedMilliseconds = performance.now() - startedAt;

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.strictEqual(
      (result.image.svg.match(/<g transform=/g) ?? []).length,
      count,
    );
    assert.strictEqual(
      (result.image.svg.match(/<path d=.*?marker-end=/g) ?? []).length,
      count - 1,
    );
    assert.ok(Number.isFinite(result.image.width) && result.image.width > 0);
    assert.ok(Number.isFinite(result.image.height) && result.image.height > 0);
    assert.ok(result.image.svg.length > count * 100);
    assert.ok(elapsedMilliseconds >= 0);
  });

  test("calculates bounds iteratively for a graph above argument-spread limits", () => {
    const count = 130_000;
    const nodes: Node<FlowNodeData>[] = Array.from(
      { length: count },
      (_, index) => {
        const id = `large-${index}`;
        return {
          id,
          type: "job",
          position: { x: index * 2, y: 0 },
          width: 1,
          height: 1,
          data: {
            unitId: id,
            label: "",
            ty: "j",
            isRootJobnet: false,
          },
        } as Node<FlowNodeData>;
      },
    );

    const result = createFlowSvg(nodes, []);

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.ok(Number.isFinite(result.image.width));
    assert.ok(Number.isFinite(result.image.height));
    assert.ok(result.image.width > count);
  });
});
