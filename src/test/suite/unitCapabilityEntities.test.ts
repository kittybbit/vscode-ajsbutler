import * as assert from "assert";
import { Cpj } from "../../domain/models/units/Cpj";
import { Evsj } from "../../domain/models/units/Evsj";
import { Fxj } from "../../domain/models/units/Fxj";
import { Mlwj } from "../../domain/models/units/Mlwj";
import { Mqsj } from "../../domain/models/units/Mqsj";
import { Mssj } from "../../domain/models/units/Mssj";
import { Mqwj } from "../../domain/models/units/Mqwj";
import { Mswj } from "../../domain/models/units/Mswj";
import { N } from "../../domain/models/units/N";
import { Ntwj } from "../../domain/models/units/Ntwj";
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

  test("keeps shared execution and macro-passing getters on message queue wait jobs", () => {
    const result = parseAjs(`
      mqwj=/mq-wait;
      ty=mqwj;
      jpoif=macro-a:info-a;
      etm=7;
      fd=00:10;
      ex="agent-a";
      ha=y;
      eu=ent;
      ets=kl;

      mswj=/ms-wait;
      ty=mswj;
      jpoif=macro-b:info-b;
      etm=8;
      fd=00:20;
      ex="agent-b";
      ha=n;
      eu=def;
      ets=nr;
    `);

    assert.deepStrictEqual(result.errors, []);
    const mqwj = tyFactory(result.rootUnits[0]) as Mqwj;
    const mswj = tyFactory(result.rootUnits[1]) as Mswj;

    assert.strictEqual(mqwj.jpoif?.[0]?.value(), "macro-a:info-a");
    assert.strictEqual(mqwj.etm?.value(), "7");
    assert.strictEqual(mqwj.fd?.value(), "00:10");
    assert.strictEqual(mqwj.ex?.value(), "agent-a");
    assert.strictEqual(mqwj.ha?.value(), "y");
    assert.strictEqual(mqwj.eu?.value(), "ent");
    assert.strictEqual(mqwj.ets?.value(), "kl");

    assert.strictEqual(mswj.jpoif?.[0]?.value(), "macro-b:info-b");
    assert.strictEqual(mswj.etm?.value(), "8");
    assert.strictEqual(mswj.fd?.value(), "00:20");
    assert.strictEqual(mswj.ex?.value(), "agent-b");
    assert.strictEqual(mswj.ha?.value(), "n");
    assert.strictEqual(mswj.eu?.value(), "def");
    assert.strictEqual(mswj.ets?.value(), "nr");
  });

  test("keeps shared execution-user and macro-passing getters on wait jobs", () => {
    const result = parseAjs(`
      fxj=/flex;
      ty=fxj;
      ha=y;
      eu=ent;

      mlwj=/mail-wait;
      ty=mlwj;
      jpoif=mail-macro:mail-info;
      etm=7;
      fd=00:10;
      ex="mail-agent";
      ha=n;
      eu=def;
      ets=wr;

      ntwj=/eventlog-wait;
      ty=ntwj;
      jpoif=event-macro:event-info;
      etm=8;
      fd=00:20;
      ex="event-agent";
      ha=y;
      eu=ent;
      ets=an;
    `);

    assert.deepStrictEqual(result.errors, []);
    const fxj = tyFactory(result.rootUnits[0]) as Fxj;
    const mlwj = tyFactory(result.rootUnits[1]) as Mlwj;
    const ntwj = tyFactory(result.rootUnits[2]) as Ntwj;

    assert.strictEqual(fxj.ha?.value(), "y");
    assert.strictEqual(fxj.eu?.value(), "ent");

    assert.strictEqual(mlwj.jpoif?.[0]?.value(), "mail-macro:mail-info");
    assert.strictEqual(mlwj.etm?.value(), "7");
    assert.strictEqual(mlwj.fd?.value(), "00:10");
    assert.strictEqual(mlwj.ex?.value(), "mail-agent");
    assert.strictEqual(mlwj.ha?.value(), "n");
    assert.strictEqual(mlwj.eu?.value(), "def");
    assert.strictEqual(mlwj.ets?.value(), "wr");

    assert.strictEqual(ntwj.jpoif?.[0]?.value(), "event-macro:event-info");
    assert.strictEqual(ntwj.etm?.value(), "8");
    assert.strictEqual(ntwj.fd?.value(), "00:20");
    assert.strictEqual(ntwj.ex?.value(), "event-agent");
    assert.strictEqual(ntwj.ha?.value(), "y");
    assert.strictEqual(ntwj.eu?.value(), "ent");
    assert.strictEqual(ntwj.ets?.value(), "an");
  });

  test("keeps shared execution and job-type getters on event sending jobs", () => {
    const result = parseAjs(`
      evsj=/event-send;
      ty=evsj;
      pfm=u;
      etm=7;
      fd=00:10;
      ex="event-agent";
      ha=y;
      eu=ent;
      jty=q;
    `);

    assert.deepStrictEqual(result.errors, []);
    const evsj = tyFactory(result.rootUnits[0]) as Evsj;

    assert.strictEqual(evsj.pfm?.value(), "u");
    assert.strictEqual(evsj.etm?.value(), "7");
    assert.strictEqual(evsj.fd?.value(), "00:10");
    assert.strictEqual(evsj.ex?.value(), "event-agent");
    assert.strictEqual(evsj.ha?.value(), "y");
    assert.strictEqual(evsj.eu?.value(), "ent");
    assert.strictEqual(evsj.jty?.value(), "q");
  });
});
