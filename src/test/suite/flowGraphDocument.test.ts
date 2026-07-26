import * as assert from "assert";
import {
  buildFlowGraphFromValidatedDocument,
  buildFlowGraphResult,
  type FlowGraphBuildResult,
} from "../../application/flow-graph/buildFlowGraph";
import {
  type FlowGraphUnitDto,
  toFlowGraphDocumentDto,
  validateFlowGraphDocument,
} from "../../application/flow-graph/flowGraphDocument";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import { createViewerDocumentChangedMessage } from "../../presentation/webview/viewerHostMessages";
import { parseAjsDocumentForTest } from "../support/parseAjs";
import { assertPlainJsonValue } from "../support/plainJson";

const definition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=job-a,j,+240+144;
    el=job-b,qj,+400+144;
    ar=(f=job-a,t=job-b);
    unit=job-a,,jp1admin,;
    {
      ty=j;
    }
    unit=job-b,,jp1admin,;
    {
      ty=qj;
    }
  }
}
`;

const createDocument = () =>
  toFlowGraphDocumentDto(parseAjsDocumentForTest(definition));

const cloneDocument = (): ReturnType<typeof createDocument> =>
  JSON.parse(JSON.stringify(createDocument())) as ReturnType<
    typeof createDocument
  >;

const issueCodes = (result: FlowGraphBuildResult): string[] =>
  result.issues.map((issue) => issue.code);

suite("Flow Graph Document", () => {
  test("validates a plain JSON document and builds stable indexes", () => {
    const serialized = JSON.parse(JSON.stringify(createDocument())) as unknown;

    const result = validateFlowGraphDocument(serialized);

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.strictEqual(result.index.unitById.size, 4);
    assert.strictEqual(
      result.index.unitByAbsolutePath.get("/root/jobnet/job-b")?.name,
      "job-b",
    );
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(result.document)),
      result.document,
    );
  });

  test("rejects duplicate identities and absolute paths", () => {
    const duplicateId = cloneDocument();
    const jobnet = duplicateId.rootUnits[0].children[0];
    jobnet.children[1].id = jobnet.children[0].id;
    const duplicateIdResult = validateFlowGraphDocument(duplicateId);

    const duplicatePath = cloneDocument();
    const duplicatePathJobnet = duplicatePath.rootUnits[0].children[0];
    duplicatePathJobnet.children[1].absolutePath =
      duplicatePathJobnet.children[0].absolutePath;
    const duplicatePathResult = validateFlowGraphDocument(duplicatePath);

    assert.strictEqual(duplicateIdResult.status, "unavailable");
    assert.ok(
      duplicateIdResult.issues.some(({ code }) => code === "duplicate_unit_id"),
    );
    assert.strictEqual(duplicatePathResult.status, "unavailable");
    assert.ok(
      duplicatePathResult.issues.some(
        ({ code }) => code === "duplicate_absolute_path",
      ),
    );
  });

  test("rejects inconsistent hierarchy, invalid layout, and object cycles", () => {
    const inconsistent = cloneDocument();
    inconsistent.rootUnits[0].children[0].parentId = "wrong-parent";

    const invalidLayout = cloneDocument();
    invalidLayout.rootUnits[0].layout.h = Number.NaN;

    const cyclic = cloneDocument();
    cyclic.rootUnits[0].children.push(cyclic.rootUnits[0]);

    const inconsistentResult = validateFlowGraphDocument(inconsistent);
    const invalidLayoutResult = validateFlowGraphDocument(invalidLayout);
    const cyclicResult = validateFlowGraphDocument(cyclic);

    assert.strictEqual(inconsistentResult.status, "unavailable");
    assert.ok(
      inconsistentResult.issues.some(
        ({ code }) => code === "inconsistent_parent",
      ),
    );
    assert.strictEqual(invalidLayoutResult.status, "unavailable");
    assert.ok(
      invalidLayoutResult.issues.some(({ code }) => code === "invalid_layout"),
    );
    assert.strictEqual(cyclicResult.status, "unavailable");
    assert.ok(cyclicResult.issues.some(({ code }) => code === "parent_cycle"));
  });

  test("isolates malformed relations while retaining valid graph content", () => {
    const document = cloneDocument();
    const jobnet = document.rootUnits[0].children[0];
    jobnet.relations.push({
      sourceUnitId: jobnet.children[0].id,
      targetUnitId: "missing-target",
      type: "seq",
    });
    jobnet.relations.push({
      sourceUnitId: jobnet.children[0].id,
      targetUnitId: document.rootUnits[0].id,
      type: "seq",
    });
    jobnet.relations.push({
      sourceUnitId: jobnet.children[0].id,
      targetUnitId: jobnet.children[1].id,
      type: "invalid",
    } as never);

    const result = buildFlowGraphResult(document, jobnet.id);

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.strictEqual(result.graph.nodes.length, 4);
    assert.deepStrictEqual(result.graph.edges, [
      {
        source: jobnet.children[0].id,
        target: jobnet.children[1].id,
        type: "seq",
        semanticDiffHighlight: undefined,
      },
    ]);
    assert.deepStrictEqual(issueCodes(result), [
      "invalid_relation",
      "invalid_relation",
      "invalid_relation",
    ]);
  });

  test("revalidates a changed document instead of returning stale data", () => {
    const document = cloneDocument();
    const jobnetId = document.rootUnits[0].children[0].id;

    const before = validateFlowGraphDocument(document);
    assert.strictEqual(before.status, "available");
    if (before.status !== "available") return;
    const firstGraph = buildFlowGraphFromValidatedDocument(before, jobnetId);
    const secondGraph = buildFlowGraphFromValidatedDocument(before, jobnetId);
    document.rootUnits[0].children[0].layout.h = Number.NaN;
    const after = validateFlowGraphDocument(document);

    assert.strictEqual(firstGraph.status, "available");
    assert.strictEqual(secondGraph.status, "available");
    if (
      firstGraph.status !== "available" ||
      secondGraph.status !== "available"
    ) {
      return;
    }
    assert.strictEqual(firstGraph.index, secondGraph.index);
    assert.deepStrictEqual(firstGraph.graph, secondGraph.graph);
    assert.strictEqual(after.status, "unavailable");
    assert.ok(after.issues.some(({ code }) => code === "invalid_layout"));
  });

  test("keeps a representative large document deterministic", () => {
    const document = cloneDocument();
    const jobnet = document.rootUnits[0].children[0];
    jobnet.children = Array.from({ length: 500 }, (_, index) => ({
      ...jobnet.children[0],
      id: `job-${index}`,
      name: `job-${index}`,
      absolutePath: `/root/jobnet/job-${index}`,
      layout: { h: index, v: index % 10 },
    }));
    jobnet.relations = [];

    const first = validateFlowGraphDocument(document);
    const second = validateFlowGraphDocument(document);

    assert.strictEqual(first.status, "available");
    assert.strictEqual(second.status, "available");
    if (first.status !== "available" || second.status !== "available") return;
    assert.strictEqual(first.index.unitById.size, 502);
    assert.deepStrictEqual(first.document, second.document);
  });

  test("projects and validates a representative deeply nested document", () => {
    const source = cloneDocument();
    const root = source.rootUnits[0];
    const template = root.children[0].children[0];
    root.children = [];
    let parent: FlowGraphUnitDto = root;
    let parentPath = root.absolutePath;
    const depth = 1_500;
    for (let index = 1; index <= depth; index++) {
      const absolutePath = `${parentPath}/nested-${index}`;
      const child: FlowGraphUnitDto = {
        ...template,
        id: `nested-${index}`,
        name: `nested-${index}`,
        absolutePath,
        depth: index,
        parentId: parent.id,
        isRoot: false,
        layout: { h: index, v: index },
        parameters: template.parameters.map((parameter) => ({ ...parameter })),
        relations: [],
        children: [],
      };
      parent.children = [child];
      parent = child;
      parentPath = absolutePath;
    }

    const projected = toFlowGraphDocumentDto({
      rootUnits: source.rootUnits,
      warnings: [],
    });
    const result = validateFlowGraphDocument(projected);

    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.strictEqual(result.index.unitById.size, depth + 1);
    assert.strictEqual(
      result.index.unitById.get(`nested-${depth}`)?.depth,
      depth,
    );
    const message = createViewerDocumentChangedMessage(
      toUnitListDocumentDto({ rootUnits: source.rootUnits, warnings: [] }),
    );
    assertPlainJsonValue(message);
    const restored = JSON.parse(JSON.stringify(message)) as typeof message;
    assert.strictEqual(restored.data?.unitList.rows.length, depth + 1);
    assert.strictEqual(
      restored.data?.unitList.rows.at(-1)?.absolutePath,
      parentPath,
    );
  });
});
