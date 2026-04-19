import * as assert from "assert";
import {
  findRowIndexByAbsolutePath,
  getRevealUnitAbsolutePath,
  resolveFlowRevealTarget,
} from "../../ui-component/editor/revealUnit";

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
    const unitById = new Map([
      [
        "root",
        {
          id: "root",
          absolutePath: "/root",
          unitType: "n",
          children: [{}],
        },
      ],
      [
        "job",
        {
          id: "job",
          absolutePath: "/root/job",
          unitType: "j",
          parentId: "root",
          children: [],
        },
      ],
    ]);

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

  test("opens the direct condition scope for units under .condition", () => {
    const unitById = new Map([
      [
        "root",
        {
          id: "root",
          absolutePath: "/root",
          unitType: "n",
          children: [{}],
        },
      ],
      [
        "condition",
        {
          id: "condition",
          absolutePath: "/root/.condition",
          unitType: "rc",
          parentId: "root",
          children: [{}],
        },
      ],
      [
        "job",
        {
          id: "job",
          absolutePath: "/root/.condition/job",
          unitType: "j",
          parentId: "condition",
          children: [],
        },
      ],
    ]);

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
    const unitById = new Map([
      [
        "root",
        {
          id: "root",
          absolutePath: "/root",
          unitType: "n",
          children: [{}],
        },
      ],
      [
        "child-net",
        {
          id: "child-net",
          absolutePath: "/root/child-net",
          unitType: "n",
          parentId: "root",
          children: [{}],
        },
      ],
      [
        "job",
        {
          id: "job",
          absolutePath: "/root/child-net/job",
          unitType: "j",
          parentId: "child-net",
          children: [],
        },
      ],
    ]);

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
