import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";
import { N } from "../../domain/models/units/N";
import { J } from "../../domain/models/units/J";
import { Qj } from "../../domain/models/units/Qj";
import { Rc } from "../../domain/models/units/Rc";
import {
  findNextRelations,
  findNextUnits,
  findPreviousRelations,
  findPreviousUnits,
} from "../../domain/models/units/unitRelationHelpers";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  gty=n;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=job-a,j,+240+144;
    el=job-b,qj,+400+144;
    el=.CONDITION,rc,+0+0;
    ar=(f=job-a,t=job-b,seq);
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

const parseJobnet = (): { jobnet: N; jobA: J; jobB: Qj; condition: Rc } => {
  const result = parseAjs(validDefinition);
  assert.deepStrictEqual(result.errors, []);

  const root = tyFactory(result.rootUnits[0]);
  const jobnet = root.children[0] as N;

  return {
    jobnet,
    jobA: jobnet.children[0] as J,
    jobB: jobnet.children[1] as Qj,
    condition: jobnet.children[2] as Rc,
  };
};

suite("Unit relation helpers", () => {
  test("finds previous and next relations from sibling ar definitions", () => {
    const { jobA, jobB, condition } = parseJobnet();

    assert.deepStrictEqual(
      findPreviousRelations(jobA).map((relation) => relation.value()),
      ["(f=.CONDITION,t=job-a,con)"],
    );
    assert.deepStrictEqual(
      findNextRelations(jobA).map((relation) => relation.value()),
      ["(f=job-a,t=job-b,seq)"],
    );
    assert.deepStrictEqual(
      findNextRelations(condition).map((relation) => relation.value()),
      ["(f=.CONDITION,t=job-a,con)"],
    );
    assert.deepStrictEqual(
      findPreviousRelations(jobB).map((relation) => relation.value()),
      ["(f=job-a,t=job-b,seq)"],
    );
  });

  test("maps related sibling units with relation types", () => {
    const { jobA, jobB, condition } = parseJobnet();

    assert.deepStrictEqual(
      findPreviousUnits(jobA).map((link) => ({
        name: link.unitEntity?.name,
        relationType: link.relationType,
      })),
      [{ name: ".CONDITION", relationType: "con" }],
    );
    assert.deepStrictEqual(
      findNextUnits(jobA).map((link) => ({
        name: link.unitEntity?.name,
        relationType: link.relationType,
      })),
      [{ name: "job-b", relationType: "seq" }],
    );
    assert.deepStrictEqual(
      findNextUnits(condition).map((link) => ({
        name: link.unitEntity?.name,
        relationType: link.relationType,
      })),
      [{ name: "job-a", relationType: "con" }],
    );
    assert.deepStrictEqual(findNextUnits(jobB), []);
  });
});
