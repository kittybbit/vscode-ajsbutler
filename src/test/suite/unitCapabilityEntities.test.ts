import * as assert from "assert";
import { Cpj } from "../../domain/models/units/Cpj";
import { Mqsj } from "../../domain/models/units/Mqsj";
import { Mssj } from "../../domain/models/units/Mssj";
import { N } from "../../domain/models/units/N";
import { Qj } from "../../domain/models/units/Qj";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";

suite("Unit capability entities", () => {
  test("keeps shared wait-state getters on waitable wrappers", () => {
    const result = parseAjs(`
      pj=/root;
      ty=n;
      {
        ty=cpj;
        nm=extract-env;
        eun=job-a;
        ega=exec;
        uem=y;
      }
    `);

    assert.deepStrictEqual(result.errors, []);
    const root = tyFactory(result.rootUnits[0]) as N;
    const child = root.children[0] as Cpj;

    assert.strictEqual(child.eun?.[0]?.value(), "job-a");
    assert.strictEqual(child.hasWaitedFor, true);
    assert.strictEqual(child.ega?.value(), "exec");
    assert.strictEqual(child.uem?.value(), "y");
  });

  test("keeps shared priority and wait-state behavior on prioritizable wrappers", () => {
    const result = parseAjs(`
      pj=/root;
      ty=n;
      ni=7;
      {
        ty=qj;
        nm=queue-job;
        pr=5;
        eun=job-a;
      }
    `);

    assert.deepStrictEqual(result.errors, []);
    const root = tyFactory(result.rootUnits[0]) as N;
    const child = root.children[0] as Qj;

    assert.strictEqual(root.priority, 7);
    assert.strictEqual(child.priority, 5);
    assert.strictEqual(child.hasWaitedFor, true);
  });

  test("keeps shared execution and job-type getters on message queue send jobs", () => {
    const result = parseAjs(`
      mqsj=/mq-send;
      ty=mqsj;
      etm=7;
      fd=00:10;
      ex="agent-a";
      ha=y;
      eu=ent;
      jty=q;
      pfm=p;

      mssj=/ms-send;
      ty=mssj;
      etm=8;
      fd=00:20;
      ex="agent-b";
      ha=n;
      eu=def;
      jty=n;
    `);

    assert.deepStrictEqual(result.errors, []);
    const mqsj = tyFactory(result.rootUnits[0]) as Mqsj;
    const mssj = tyFactory(result.rootUnits[1]) as Mssj;

    assert.strictEqual(mqsj.etm?.value(), "7");
    assert.strictEqual(mqsj.fd?.value(), "00:10");
    assert.strictEqual(mqsj.ex?.value(), "agent-a");
    assert.strictEqual(mqsj.ha?.value(), "y");
    assert.strictEqual(mqsj.eu?.value(), "ent");
    assert.strictEqual(mqsj.jty?.value(), "q");
    assert.strictEqual(mqsj.pfm?.value(), "p");

    assert.strictEqual(mssj.etm?.value(), "8");
    assert.strictEqual(mssj.fd?.value(), "00:20");
    assert.strictEqual(mssj.ex?.value(), "agent-b");
    assert.strictEqual(mssj.ha?.value(), "n");
    assert.strictEqual(mssj.eu?.value(), "def");
    assert.strictEqual(mssj.jty?.value(), "n");
  });
});
