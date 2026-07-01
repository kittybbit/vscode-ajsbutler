import * as assert from "assert";
import {
  findRowIndexByAbsolutePath,
  getRevealUnitAbsolutePath,
  resolveFlowRevealTarget,
} from "../../presentation/webview/editor/revealUnit";

type FlowRevealUnit =
  Parameters<typeof resolveFlowRevealTarget>[0] extends ReadonlyMap<
    string,
    infer T
  >
    ? T
    : never;

type FlowRevealUnitFixture = Omit<FlowRevealUnit, "children"> & {
  children?: Array<unknown>;
};

const createFlowRevealUnit = ({
  children = [],
  ...unit
}: FlowRevealUnitFixture): FlowRevealUnit => ({
  ...unit,
  children,
});

const createUnitById = (
  ...units: FlowRevealUnitFixture[]
): Map<string, FlowRevealUnit> =>
  new Map(
    units.map(createFlowRevealUnit).map((unit) => [unit.id, unit] as const),
  );

const createRootScopedTargetUnits = (
  scope: Pick<FlowRevealUnitFixture, "id" | "absolutePath" | "unitType">,
): Map<string, FlowRevealUnit> =>
  createUnitById(
    {
      id: "root",
      absolutePath: "/root",
      unitType: "n",
      children: [{}],
    },
    {
      ...scope,
      parentId: "root",
      children: [{}],
    },
    {
      id: "job",
      absolutePath: `${scope.absolutePath}/job`,
      unitType: "j",
      parentId: scope.id,
    },
  );

suite("Reveal unit helpers", () => {
  test("reads a reveal-unit absolute path from event data", () => {
    assert.strictEqual(
      getRevealUnitAbsolutePath({ absolutePath: "/root/jobnet/job" }),
      "/root/jobnet/job",
    );
    assert.strictEqual(
      getRevealUnitAbsolutePath({ absolutePath: 1 }),
      undefined,
    );
    assert.strictEqual(getRevealUnitAbsolutePath(undefined), undefined);
  });

  test("opens the containing jobnet and highlights the revealed unit", () => {
    const unitById = createUnitById(
      {
        id: "root",
        absolutePath: "/root",
        unitType: "n",
        children: [{}],
      },
      {
        id: "job",
        absolutePath: "/root/job",
        unitType: "j",
        parentId: "root",
      },
    );

    assert.deepStrictEqual(resolveFlowRevealTarget(unitById, "/root/job"), {
      scopeUnitId: "root",
      revealedUnitId: "job",
      expandedAncestorUnitIds: [],
    });
    assert.strictEqual(
      resolveFlowRevealTarget(unitById, "/missing"),
      undefined,
    );
  });

  test("opens the first root jobnet when revealing a job group", () => {
    const unitById = createUnitById(
      {
        id: "job-group",
        absolutePath: "/job-group",
        unitType: "g",
        children: [{}],
      },
      {
        id: "root-jobnet",
        absolutePath: "/job-group/root-jobnet",
        unitType: "n",
        parentId: "job-group",
        isRootJobnet: true,
      },
    );

    assert.deepStrictEqual(resolveFlowRevealTarget(unitById, "/job-group"), {
      scopeUnitId: "root-jobnet",
      revealedUnitId: "job-group",
      expandedAncestorUnitIds: [],
    });
  });

  test("opens the direct condition scope for units under .condition", () => {
    const unitById = createRootScopedTargetUnits({
      id: "condition",
      absolutePath: "/root/.condition",
      unitType: "rc",
    });

    assert.deepStrictEqual(
      resolveFlowRevealTarget(unitById, "/root/.condition/job"),
      {
        scopeUnitId: "condition",
        revealedUnitId: "job",
        expandedAncestorUnitIds: [],
      },
    );
  });

  test("expands nested jobnets needed to reveal the target unit", () => {
    const unitById = createRootScopedTargetUnits({
      id: "child-net",
      absolutePath: "/root/child-net",
      unitType: "n",
    });

    assert.deepStrictEqual(
      resolveFlowRevealTarget(unitById, "/root/child-net/job"),
      {
        scopeUnitId: "child-net",
        revealedUnitId: "job",
        expandedAncestorUnitIds: [],
      },
    );
  });

  test("finds a table row index from a stable absolute path", () => {
    const rowIndexByAbsolutePath = new Map<string, number>([
      ["/root", 0],
      ["/root/job", 3],
    ]);

    assert.strictEqual(
      findRowIndexByAbsolutePath(rowIndexByAbsolutePath, "/root/job"),
      3,
    );
    assert.strictEqual(
      findRowIndexByAbsolutePath(rowIndexByAbsolutePath, "/missing"),
      undefined,
    );
  });
});
