import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import {
  parseNormalizedRelation,
  resolveNormalizedRelations,
} from "../../domain/models/ajs/normalizeRelationHelpers";
import {
  AjsNormalizationWarning,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    ar=(f=job-a,t=job-b);
    ar=(f=.CONDITION,t=job-a,con);
    unit=job-a,,jp1admin,;
    {
      ty=j;
    }
    unit=job-b,,jp1admin,;
    {
      ty=qj;
    }
    unit=.CONDITION,,jp1admin,;
    {
      ty=rc;
    }
  }
}
`;

const invalidDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    ar=(f=job-a,con);
    ar=(f=job-a,t=missing,con);
    unit=job-a,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

suite("Normalize relation helpers", () => {
  test("parses normalized relations from ar parameter values", () => {
    assert.deepStrictEqual(parseNormalizedRelation("(f=job-a,t=job-b)"), {
      sourceName: "job-a",
      targetName: "job-b",
      type: "seq",
    });
    assert.deepStrictEqual(
      parseNormalizedRelation("(f=.CONDITION,t=job-a,con)"),
      {
        sourceName: ".CONDITION",
        targetName: "job-a",
        type: "con",
      },
    );
    assert.strictEqual(parseNormalizedRelation("(f=job-a,con)"), undefined);
  });

  test("resolves normalized relations and records relation warnings", () => {
    const validResult = parseAjs(validDefinition);
    assert.deepStrictEqual(validResult.errors, []);
    const validJobnet = validResult.rootUnits[0].children[0];
    const validChildren = validJobnet.children.map(
      (child): AjsUnit => ({
        id: child.absolutePath(),
        name: child.name,
        unitAttribute: child.unitAttribute,
        permission: child.permission,
        jp1Username: child.jp1Username,
        jp1ResourceGroup: child.jp1ResourceGroup,
        unitType: "j",
        absolutePath: child.absolutePath(),
        depth: 0,
        isRoot: false,
        isRootJobnet: false,
        hasSchedule: false,
        hasWaitedFor: false,
        layout: { h: 0, v: 0 },
        parameters: [],
        relations: [],
        children: [],
      }),
    );
    const validWarnings: AjsNormalizationWarning[] = [];

    assert.deepStrictEqual(
      resolveNormalizedRelations(validJobnet, validChildren, validWarnings),
      [
        {
          sourceUnitId: "/root/jobnet/job-a",
          targetUnitId: "/root/jobnet/job-b",
          type: "seq",
        },
        {
          sourceUnitId: "/root/jobnet/.CONDITION",
          targetUnitId: "/root/jobnet/job-a",
          type: "con",
        },
      ],
    );
    assert.deepStrictEqual(validWarnings, []);

    const invalidResult = parseAjs(invalidDefinition);
    assert.deepStrictEqual(invalidResult.errors, []);
    const invalidJobnet = invalidResult.rootUnits[0].children[0];
    const invalidChildren = [
      {
        ...validChildren[0],
        id: "/root/jobnet/job-a",
        name: "job-a",
        absolutePath: "/root/jobnet/job-a",
      },
    ];
    const invalidWarnings: AjsNormalizationWarning[] = [];

    assert.deepStrictEqual(
      resolveNormalizedRelations(
        invalidJobnet,
        invalidChildren,
        invalidWarnings,
      ),
      [],
    );
    assert.deepStrictEqual(invalidWarnings, [
      {
        code: "invalid-relation",
        message: "Relation could not be parsed for /root/jobnet.",
        unitPath: "/root/jobnet",
      },
      {
        code: "missing-relation-target",
        message: "Relation target was not found for /root/jobnet.",
        unitPath: "/root/jobnet",
      },
    ]);
  });
});
