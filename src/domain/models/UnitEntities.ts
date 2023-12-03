/** JP1/AJS3 unit entities  */

import { Ar, Parameter } from './ParameterEntities';
import { Unit } from '../values/Unit';
import { ParamsType, Ty, TyType, isParams, isTy } from '../values/AjsType';
import { ParamFactory } from './ParameterFactory';

/** abstract class of unit unit for decorator */
export abstract class UnitEntity {

    #unit: Unit;

    constructor(unit: Unit) {
        this.#unit = unit;
    }

    get unitAttribute() { return this.#unit.unitAttribute; }
    get parameters() { return this.#unit.parameters; }
    get parent(): UnitEntity | undefined {
        return this.#unit.parent ? tyFactory(this.#unit.parent) : undefined;
    }
    get children() { return this.#unit.children.map(v => tyFactory(v)); }
    get name() { return this.#unit.name; }
    get permission() { return this.#unit.permission; }
    get jp1Username() { return this.#unit.jp1Username; }
    get jp1ResourceGroup() { return this.#unit.jp1ResourceGroup; }

    /* ty={g|mg|n|rn|rm|rr|rc|mn|j|rj|pj|
     rp|qj|rq|jdj|rjdj|orj|rorj|evwj|
     revwj|flwj|rflwj|mlwj|rmlwj|mqwj|
     rmqwj|mswj|rmswj|lfwj|rlfwj|ntwj|
     rntwj|tmwj|rtmwj|evsj|revsj|mlsj|
     rmlsj|mqsj|rmqsj|mssj|rmssj|cmsj|
     rcmsj|pwlj|rpwlj|pwrj|rpwrj|cj|rcj|
     cpj|rcpj|fxj|rfxj|htpj|rhtpj|hln|nc}; */
    get ty() { return ParamFactory.ty(this); }
    // [cm="comment";] 
    get cm() { return ParamFactory.cm(this); }
    // [el=unit-name, unit-type, +H +V;]
    get el() { return ParamFactory.el(this) }
    // [sz=lateral-icon-count-times-longitudinal-icon-count;]
    get sz() { return ParamFactory.sz(this) }

    isRoot() {
        return this.#unit.isRoot();
    }
    absolutePath() {
        return this.#unit.absolutePath();
    }
    previous() {
        const ar = this.parent?.params<Ar[] | undefined>('ar');
        return ar ? ar.filter(a => a.t === this.name) : [];
    }
    isRecovery() {
        // There is no concept of recovery.
        const excludes: TyType[] = ['g', 'mg', 'rc', 'mn', 'nc'];
        if (excludes.includes(this.ty.value())) {
            return undefined;
        }

        return Ty
            .filter(ty => ty.charAt(0) === 'r')
            .filter(r => !['rm'].includes(r))
            .includes(this.ty.value())
            ? true
            : false;
    }
    /** key of unit difinition parameter */
    defineParams() {
        let proto = Object.getPrototypeOf(this);
        let params: string[] = [];
        while (proto && proto.constructor.name !== 'Object') {
            params = params.concat(Object.getOwnPropertyNames(proto));
            proto = Object.getPrototypeOf(proto);
        }
        return params
            .filter(v => isParams(v))
            .map(v => v as ParamsType)
            .sort();
    }
    /** Specified parameters in unit definitions */
    params<T>(param: ParamsType): T | undefined {
        return this[param as keyof typeof this] as T;
    }
    /** human readable json */
    prettyJSON() {
        return {
            path: this.absolutePath(),
            ty: `${this.ty.value()}`,
            cm: `${this.cm ? this.cm.value() : ''}`,
            parent: this.parent?.name,
            params: this.defineParams()
                .map(v => this.params<Parameter | Parameter[] | undefined>(v))
                .filter(p => p)
                .map(p => {
                    if (Array.isArray(p)) {
                        //return (p instanceof Parameter) ? p.map(q => q.prettyJSON()) : undefined;
                        return p.map(q => q.prettyJSON());
                    } else if (p instanceof Parameter) {
                        return p.prettyJSON()
                    } else {
                        return; // not here
                    }
                }),
        };
    }
}

/** job group */
export class G extends UnitEntity {
    // [op={yyyy/mm/dd|{su|mo|tu|we|th|fr|sa}};]
    get op() { return ParamFactory.op(this); }
    // [cl={yyyy/mm/dd|{su|mo|tu|we|th|fr|sa}};]
    get cl() { return ParamFactory.cl(this); }
    // [sdd={dd|{su|mo|tu|we|th|fr|sa}:n};]
    get sdd() { return ParamFactory.sdd(this, '1'); }
    // [md={th|ne};]
    get md() { return ParamFactory.md(this, 'th'); }
    // [stt=hh:mm;]
    get stt() { return ParamFactory.stt(this, '00:00'); }
    // [gty={p|n};]
    get gty() { return ParamFactory.gty(this, 'n'); }
    // [ncl={y|n};]
    get ncl() { return ParamFactory.ncl(this, 'n'); }
    // [ncn=jobnet-connector-name;]
    get ncn() { return ParamFactory.ncn(this); }
    // [ncs={y|n};]
    get ncs() { return ParamFactory.ncs(this, 'n'); }
    // [ncex={y|n};]
    get ncex() { return ParamFactory.ncex(this, 'n'); }
    // [nchn="connection-host-name";]
    get nchn() { return ParamFactory.nchn(this); }
    // [ncsv=connection-service-name;]
    get ncsv() { return ParamFactory.ncsv(this); }

    get su() {
        if (this.op === undefined && this.cl === undefined) {
            return undefined;
        } else if (this.op && this.op.find(v => v.su)) {
            return true;
        } else if (this.cl && this.cl.find(v => v.su)) {
            return false;
        }
        return undefined;
    }

    get mo() {
        if (this.op === undefined && this.cl === undefined) {
            return undefined;
        } else if (this.op && this.op.find(v => v.mo)) {
            return true;
        } else if (this.cl && this.cl.find(v => v.mo)) {
            return false;
        }
        return undefined;
    }

    get tu() {
        if (this.op === undefined && this.cl === undefined) {
            return undefined;
        } else if (this.op && this.op.find(v => v.tu)) {
            return true;
        } else if (this.cl && this.cl.find(v => v.tu)) {
            return false;
        }
        return undefined;
    }

    get we() {
        if (this.op === undefined && this.cl === undefined) {
            return undefined;
        } else if (this.op && this.op.find(v => v.we)) {
            return true;
        } else if (this.cl && this.cl.find(v => v.we)) {
            return false;
        }
        return undefined;
    }

    get th() {
        if (this.op === undefined && this.cl === undefined) {
            return undefined;
        } else if (this.op && this.op.find(v => v.th)) {
            return true;
        } else if (this.cl && this.cl.find(v => v.th)) {
            return false;
        }
        return undefined;
    }

    get fr() {
        if (this.op === undefined && this.cl === undefined) {
            return undefined;
        } else if (this.op && this.op.find(v => v.fr)) {
            return true;
        } else if (this.cl && this.cl.find(v => v.fr)) {
            return false;
        }
        return undefined;
    }

    get sa() {
        if (this.op === undefined && this.cl === undefined) {
            return undefined;
        } else if (this.op && this.op.find(v => v.sa)) {
            return true;
        } else if (this.cl && this.cl.find(v => v.sa)) {
            return false;
        }
        return undefined;
    }

    isPlanning() {
        return this.gty?.value() === 'p';
    }
}
export class Mg extends UnitEntity {
    // [mh="manager-host-name";]
    get mh() { return ParamFactory.mh(this); }
    // [mu=manager-unit-name;]
    get mu() { return ParamFactory.mu(this); }
}
export class Mn extends Mg { }
export class N extends UnitEntity {
    /** whether root jobnet or not. */
    get isRootJobnet() {
        if (!this.parent) {
            return true;
        }
        return this.parent.ty.value() !== 'n'
            ? true
            : false;
    }
    // [sd=[N,]{[[yyyy/]mm/]{[+|*|@]dd|[+|*|@]b[-DD]|[+]{su|mo|tu|we|th|fr|sa}[:{n|b}]}|en|ud};]
    get sd() { return ParamFactory.sd(this, this.isRootJobnet ? 'en' : undefined); }
    // [st=[N,][+]hh:mm;]
    get st() { return ParamFactory.st(this, '+00:00'); }
    // [sy=[N,]hh:mm|{M|U|C}mmmm;]
    get sy() { return ParamFactory.sy(this); }
    // [ey=[N,]hh:mm|{M|U|C}mmmm;]
    get ey() { return ParamFactory.ey(this); }
    // [ln=[N,]n;]
    get ln() { return ParamFactory.ln(this); }
    // [cy=[N,] (n,{y|m|w|d});]
    get cy() { return ParamFactory.cy(this); }
    // [sh=[N,]{be|af|ca|no};]
    get sh() { return ParamFactory.sh(this); }
    // [shd=[N,]n;]
    get shd() { return ParamFactory.shd(this, '2'); }
    // [wt=[N,]{no|hh:mm|mmmm|un};]
    get wt() { return ParamFactory.wt(this, 'no'); }
    // [wc=[N,]{no|n|un};]
    get wc() { return ParamFactory.wc(this, 'no'); }
    // [cftd=[N,]{no|be|af|db|da}[,n[,N]];]
    get cftd() { return ParamFactory.cftd(this, 'no'); }
    // [ed=yyyy/mm/dd;]
    get ed() { return ParamFactory.ed(this); }
    // [rg=n;]
    get rg() { return ParamFactory.rg(this, this.isRootJobnet ? '1' : undefined); }
    // [pr=n;]
    get pr() { return ParamFactory.pr(this, '1'); }
    // [ni=n;]
    get ni() { return ParamFactory.ni(this, '-39'); }
    // [ha={y|w|a|n};]
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [ejn=exclusive-jobnet-name;]
    get ejn() { return ParamFactory.ejn(this); }
    // [cd={no|un|n};]
    get cd() { return ParamFactory.cd(this, 'n'); }
    // [de={y|n};]
    get de() { return ParamFactory.de(this, 'y'); }
    // [ms={sch|mlt};]
    get ms() { return ParamFactory.ms(this, 'sch'); }
    // [mp={y|n};]
    get mp() { return ParamFactory.mp(this, 'n'); }
    // [jc=full-path-job-group-name;]
    get jc() { return ParamFactory.jc(this); }
    // [rh="execution-manager-name";]
    get rh() { return ParamFactory.rh(this); }
    // [ex="execution-agent-name";]
    get ex() { return ParamFactory.ex(this); }
    // [fd=time-required-for-execution;]
    get fd() { return ParamFactory.fd(this); }
    // [ar=(f=preceding-unit-name, t=succeeding-unit-name[,relation-type]);]
    get ar() { return ParamFactory.ar(this); }
    // [ncl={y|n};]
    get ncl() { return ParamFactory.ncl(this, this.isRootJobnet ? 'n' : undefined); }
    // [ncn=jobnet-connector-name;]
    get ncn() { return ParamFactory.ncn(this); }
    // [ncs={y|n};]
    get ncs() { return ParamFactory.ncs(this, this.isRootJobnet ? 'n' : undefined); }
    // [ncex={y|n};]
    get ncex() { return ParamFactory.ncex(this, this.isRootJobnet ? 'n' : undefined); }
    // [nchn="connection-host-name";]
    get nchn() { return ParamFactory.nchn(this); }
    // [ncsv=connection-service-name;]
    get ncsv() { return ParamFactory.ncsv(this); }
    // [mm={and|or};]
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};]
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;]
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};]
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};]
    get uem() { return ParamFactory.uem(this, 'n'); }

    get priority(): number {
        const pr = this.pr;
        const ni = this.ni;
        if (pr && ni && !pr.inherited && !ni.inherited) {
            return pr.position > ni.position ? Number(pr.value()) : ni.priority
        } else if (pr && !pr.inherited) {
            return Number(pr.value())
        } else if (ni && !ni.inherited) {
            return ni.priority
        }

        switch (this.parent && this.parent.ty.value()) {
            case 'n':
            case 'rn':
                return (this.parent as N | Rn).priority;
        }
        return 1;
    }
}
export class Rn extends N { }
export class Rm extends N { }
export class Rr extends N { }
export class Rc extends UnitEntity {
    // [cond={and|or};]
    get cond() { return ParamFactory.cond(this, 'and'); }
    // [mcs={m|w|s};]
    get mcs() { return ParamFactory.mcs(this, 'm'); }
    // [cgs={y|n};]
    get cgs() { return ParamFactory.cgs(this, 'y'); }
    // [ab={exec|hold|stop};]
    get ab() { return ParamFactory.ab(this, 'exec'); }
}
export class J extends UnitEntity {
    // [te="command-text";]
    get te() { return ParamFactory.te(this); }
    // [sc="script-file-name";]
    get sc() { return ParamFactory.sc(this); }
    // [prm="parameter";]
    get prm() { return ParamFactory.prm(this); }
    // [wkp="work-path-name";]
    get wkp() { return ParamFactory.wkp(this); }
    // [ev="environmental-variable-file-name";]
    get ev() { return ParamFactory.ev(this); }
    // [env="environment-variable";]...
    get env() { return ParamFactory.env(this); }
    // [si="standard-input-file-name";]
    get si() { return ParamFactory.si(this); }
    // [so="standard-output-file-name";]
    get so() { return ParamFactory.so(this); }
    // [se="standard-error-output-file-name";]
    get se() { return ParamFactory.se(this); }
    // [soa={new|add};]
    get soa() { return ParamFactory.soa(this, 'new'); }
    // [sea={new|add};]
    get sea() { return ParamFactory.sea(this, 'new'); }
    // [etm=n;]
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;]
    get fd() { return ParamFactory.fd(this); }
    // [pr=n;]
    get pr() { return ParamFactory.pr(this, '1'); }
    // [ni=n;]
    get ni() { return ParamFactory.ni(this, '-39'); }
    // [ex="execution-agent-name";]
    get ex() { return ParamFactory.ex(this); }
    // [un="target-user-name";]
    get un() { return ParamFactory.un(this); }
    // [jd={nm|ab|cod|mdf|exf};]
    get jd() { return ParamFactory.jd(this, 'cod'); }
    // [wth=n;]
    get wth() { return ParamFactory.wth(this); }
    // [tho=n;]
    get tho() { return ParamFactory.tho(this, '0'); }
    // [jdf="end-judgment-file-name";]
    get jdf() { return ParamFactory.jdf(this); }
    // [abr={y|n};]
    get abr() { return ParamFactory.abr(this, 'n'); }
    // [rjs=lower-limit-of-return-codes-to-be-retried-automatically;]
    get rjs() { return ParamFactory.rjs(this); }
    // [rje=upper-limit-of-return-codes-to-be-retried-automatically;]
    get rje() { return ParamFactory.rje(this); }
    // [rec=maximum-number-of-retry-executions;]
    get rec() { return ParamFactory.rec(this, '1'); }
    // [rei=retry-interval;]
    get rei() { return ParamFactory.rei(this, '1'); }
    // [ts1="transfer-source-file-name-1";]
    get ts1() { return ParamFactory.ts1(this); }
    // [td1="transfer-destination-file-name-1";]
    get td1() { return ParamFactory.td1(this); }
    // [top1={sav|del};]
    get top1() { return ParamFactory.top1(this, this.ts1 && this.td1 ? 'sav' : this.ts1 && !this.td1 ? 'del' : ''); }
    // [ts2="transfer-source-file-name-2";]
    get ts2() { return ParamFactory.td2(this); }
    // [td2="transfer-destination-file-name-2";]
    get td2() { return ParamFactory.td2(this); }
    // [top2={sav|del};]
    get top2() { return ParamFactory.top2(this, this.ts2 && this.td2 ? 'sav' : this.ts2 && !this.td2 ? 'del' : ''); }
    // [ts3="transfer-source-file-name-3";]
    get ts3() { return ParamFactory.ts3(this) }
    // [td3="transfer-destination-file-name-3";]
    get td3() { return ParamFactory.td3(this) }
    // [top3={sav|del};]
    get top3() { return ParamFactory.top3(this, this.ts3 && this.td3 ? 'sav' : this.ts3 && !this.td3 ? 'del' : ''); }
    // [ts4="transfer-source-file-name-4";]
    get ts4() { return ParamFactory.ts4(this); }
    // [td4="transfer-destination-file-name-4";]
    get td4() { return ParamFactory.td4(this); }
    // [top4={sav|del};]
    get top4() { return ParamFactory.top4(this, this.ts4 && this.td4 ? 'sav' : this.ts4 && !this.td4 ? 'del' : ''); }
    // [ha={y|n};]
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};]
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [jty={q|n};]
    get jty() { return ParamFactory.jty(this, 'q'); }
    // [mm={and|or};]
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};]
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;]
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};]
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};]
    get uem() { return ParamFactory.uem(this, 'n'); }

    get priority(): number {
        const pr = this.pr;
        const ni = this.ni;
        if (pr && ni && !pr.inherited && !ni.inherited) {
            return pr.position > ni.position ? Number(pr.value()) : ni.priority
        } else if (pr && !pr.inherited) {
            return Number(pr.value())
        } else if (ni && !ni.inherited) {
            return ni.priority
        }

        switch (this.parent && this.parent.ty.value()) {
            case 'n':
            case 'rn':
                return (this.parent as N | Rn).priority;
        }
        return 1;
    }
}
export class Rj extends J { }
export class Pj extends J { }
export class Rp extends J { }
export class Qj extends UnitEntity {

    // [qu="queue-name";]
    get qu() { return ParamFactory.qu(this); }
    // [qm="queue-name";]
    get qm() { return ParamFactory.qm(this); }
    // [req="job-name";]
    get req() { return ParamFactory.req(this); }
    // [sc="script-file-name";]
    get sc() { return ParamFactory.sc(this); }
    // [prm="parameter";]
    get prm() { return ParamFactory.prm(this); }
    // [fd=time-required-for-execution;]
    get fd() { return ParamFactory.fd(this); }
    // [pr=n;]
    get pr() { return ParamFactory.pr(this, '1'); }
    // [ni=n;]
    get ni() { return ParamFactory.ni(this, '-39'); }
    // [jd={nm|ab|cod};]
    get jd() { return ParamFactory.jd(this, 'cod'); }
    // [wth=n;]
    get wth() { return ParamFactory.wth(this); }
    // [tho=n;]
    get tho() { return ParamFactory.tho(this, '0'); }
    // [abr={y|n};]
    get abr() { return ParamFactory.abr(this, 'n'); }
    // [rjs=lower-limit-of-return-codes-to-be-retried-automatically;]
    get rjs() { return ParamFactory.rjs(this); }
    // [rje=upper-limit-of-return-codes-to-be-retried-automatically;]
    get rje() { return ParamFactory.rje(this); }
    // [rec=maximum-number-of-retry-executions;]
    get rec() { return ParamFactory.rec(this, '1'); }
    // [rei=retry-interval;]
    get rei() { return ParamFactory.rei(this, '1'); }
    // [ts1="transfer-source-file-name-1";]
    get ts1() { return ParamFactory.ts1(this); }
    // [td1="transfer-destination-file-name-1";]
    get td1() { return ParamFactory.td1(this); }
    // [ts2="transfer-source-file-name-2";]
    get ts2() { return ParamFactory.ts2(this); }
    // [td2="transfer-destination-file-name-2";]
    get td2() { return ParamFactory.td2(this); }
    // [ts3="transfer-source-file-name-3";]
    get ts3() { return ParamFactory.ts3(this); }
    // [td3="transfer-destination-file-name-3";]
    get td3() { return ParamFactory.td3(this); }
    // [ts4="transfer-source-file-name-4";]
    get ts4() { return ParamFactory.ts4(this); }
    // [td4="transfer-destination-file-name-4";]
    get td4() { return ParamFactory.td4(this); }
    // [ha={y|n};]
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};]
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [mm={and|or};]
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};]
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;]
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};]
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};]
    get uem() { return ParamFactory.uem(this, 'n'); }

    get priority(): number {
        const pr = this.pr;
        const ni = this.ni;
        if (pr && ni && !pr.inherited && !ni.inherited) {
            return pr.position > ni.position ? Number(pr.value()) : ni.priority
        } else if (pr && !pr.inherited) {
            return Number(pr.value())
        } else if (ni && !ni.inherited) {
            return ni.priority
        }

        switch (this.parent && this.parent.ty.value()) {
            case 'n':
            case 'rn':
                return (this.parent as N | Rn).priority;
        }
        return 1;
    }

}
export class Rq extends Qj { }
export class Jdj extends UnitEntity {
    // [ej={gt|ge|lt|le|eq|ne|ri|ro|ef|nf|vgt|vge|vlt|vle|veq|vne|vri|vro|sce|spe|sne|spn|snn|snl};]
    get ej() { return ParamFactory.ej(this, 'gt'); }
    // [ejc=judgment-return-code;]
    get ejc() { return ParamFactory.ejc(this, '0'); }
    // [ejl=lower-limit-of-judgment-return-codes;]
    get ejl() { return ParamFactory.ejl(this); }
    // [ejh=upper-limit-of-judgment-return-codes;]
    get ejh() { return ParamFactory.ejh(this); }
    // [ejf="end-judgment-file-name";]
    get ejf() { return ParamFactory.ejf(this); }
    // [ejv=variable-name;]
    get ejv() { return ParamFactory.ejv(this); }
    // [ejt="judgment-value-for-variable (string)";]
    get ejt() { return ParamFactory.ejt(this); }
    // [eji=judgment-value-for-variable (numeric);]
    get eji() { return ParamFactory.eji(this, '0'); }
    // [ejs=lower-limit-judgment-value-for-variable_(numeric);]
    get ejs() { return ParamFactory.ejs(this); }
    // [ejg=upper-limit-judgment-value-for-variable_(numeric);]
    get ejg() { return ParamFactory.ejg(this); }
    // [ejm={gt|ge};]
    get ejm() { return ParamFactory.ejm(this, 'ge'); }
    // [eju={lt|le};]
    get eju() { return ParamFactory.eju(this, 'le'); }
    // [ha={y|n};]
    get ha() { return ParamFactory.ha(this, 'n'); }
}
export class Rjdj extends Jdj { }
export class Orj extends UnitEntity {
    // There are no individual parameters.
}
export class Rorj extends Orj { }
export class Evwj extends UnitEntity {
    // [evwid=event-ID;]
    get evwid() { return ParamFactory.evwid(this); }
    // [evusr="event-issue-source-user-name";]
    get evusr() { return ParamFactory.evusr(this); }
    // [evgrp="event-issue-source-group-name";]
    get evgrp() { return ParamFactory.evgrp(this); }
    // [evhst="event-issue-source-host-name";]
    get evhst() { return ParamFactory.evhst(this); }
    // [evipa=event-issue-source-IP-address;]
    get evipa() { return ParamFactory.evipa(this); }
    // [evwms="message";]
    get evwms() { return ParamFactory.evwms(this); }
    // [evdet="detailed-event-information";]
    get evdet() { return ParamFactory.evdet(this); }
    // [evwsv=em[:al[:cr[:er[:wr[:no[:in[:db]]]]]]];]
    get evwsv() { return ParamFactory.evwsv(this); }
    // [evwfr=optional-extended-attribute-name:"value";]
    get evwfr() { return ParamFactory.evwfr(this); }
    // [evtmc={n|a|n:"file-name"|a:"file-name"
    //      |d:"file-name"|b:"file-name"};]
    get evtmc() { return ParamFactory.evtmc(this, 'n'); }
    // [evuid=event-issue-source-user-ID;]
    get evuid() { return ParamFactory.evuid(this); }
    // [evgid=event-issue-source-group-ID;]
    get evgid() { return ParamFactory.evgid(this); }
    // [evpid=event-issue-source-process-ID;]
    get evpid() { return ParamFactory.evpid(this); }
    // [jpoif=macro-variable-name:passing-information-name;]
    get jpoif() { return ParamFactory.jpoif(this); }
    // [etm=n;]
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;]
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";]
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};]
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};]
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [evesc={no|minutes};]
    get evesc() { return ParamFactory.evesc(this, 'no'); }
    // [ets={kl|nr|wr|an};]
    get ets() { return ParamFactory.ets(this, 'kl'); }
    // [mm={and|or};]
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};]
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;]
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};]
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};]
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Revwj extends Evwj { }
export class Flwj extends UnitEntity {
    // [flwf="name-of-file-to-be-monitored";]
    get flwf() { return ParamFactory.flwf(this); }
    // [flwc=c[:d[:{s|m}]];]
    get flwc() { return ParamFactory.flwc(this, 'c'); }
    // [flwi=monitoring-interval;]
    get flwi() { return ParamFactory.flwi(this, '60'); }
    // [flco={y|n};] 
    get flco() { return ParamFactory.flco(this, 'n'); }
    // [jpoif=macro-variable-name:passing-information-name;] 
    get jpoif() { return ParamFactory.jpoif(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this, 'kl'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rflwj extends Flwj { }
export class Mlwj extends UnitEntity {
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this, 'p'); }
    // [mlprf="profile-name";] 
    get mlprf() { return ParamFactory.mlprf(this); }
    // [mladr="sender";] 
    get mladr() { return ParamFactory.mladr(this); }
    // [mlsbj="subject";] 
    get mlsbj() { return ParamFactory.mlsbj(this); }
    // [mltxt="text";] 
    get mltxt() { return ParamFactory.mltxt(this); }
    // [mlsav={y|n};] 
    get mlsav() { return ParamFactory.mlsav(this, 'y'); }
    // [mllst="received-email-list";] 
    get mllst() { return ParamFactory.mllst(this); }
    // [mlstx="name-of-text-file";] 
    get mlstx() { return ParamFactory.mlstx(this); }
    // [mlsfd="name-of-folder-to-save-attached-file";] 
    get mlsfd() { return ParamFactory.mlsfd(this); }
    // [mlafl="name-of-list-file";] 
    get mlafl() { return ParamFactory.mlafl(this); }
    // [jpoif=macro-variable-name:passing-information-name;] 
    get jpoif() { return ParamFactory.jpoif(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this, 'kl'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rmlwj extends Mlwj { }
export class Mqwj extends UnitEntity {
    // [mqcor=correlation-ID;] 
    get mqcor() { return ParamFactory.mqcor(this); }
    // [mqque=message-input-queue-name;] 
    get mqque() { return ParamFactory.mqque(this); }
    // [mqdsc=message-ID;] 
    get mqdsc() { return ParamFactory.mqdsc(this); }
    // [mqmdl=model-queue-name;] 
    get mqmdl() { return ParamFactory.mqmdl(this); }
    // [mqsfn="message-storage-file-name";] 
    get mqsfn() { return ParamFactory.mqsfn(this); }
    // [jpoif=macro-variable-name:passing-information-name;] 
    get jpoif() { return ParamFactory.jpoif(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this, 'kl'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rmqwj extends Mqwj { }
export class Mswj extends UnitEntity {
    // [msqpt="path-name";] 
    get msqpt() { return ParamFactory.msqpt(this); }
    // [msrer=correlation-ID;] 
    get msrer() { return ParamFactory.msrer(this); }
    // [mslbl="message-label";] 
    get mslbl() { return ParamFactory.mslbl(this); }
    // [msapl=application-information;] 
    get msapl() { return ParamFactory.msapl(this); }
    // [mssvf="message-storage-file-name";] 
    get mssvf() { return ParamFactory.mssvf(this); }
    // [jpoif=macro-variable-name:passing-information-name;] 
    get jpoif() { return ParamFactory.jpoif(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this, 'kl'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rmswj extends Mswj { }
export class Lfwj extends UnitEntity {
    // [lftpd=[!]"trap-data-1"[:[!]"trap-data-2"...];]... 
    get lftpd() { return ParamFactory.lftpd(this); }
    // [lffnm="log-file-name";] 
    get lffnm() { return ParamFactory.lffnm(this); }
    // [lfdft={s|s2|w1|w2};] 
    get lfdft() { return ParamFactory.lfdft(this); }
    // [lfrft={v:'[\]delimiter'|f:record-length};] 
    get lfrft() { return ParamFactory.lfrft(this); }
    // [lfhds={l:header-row-count|s:header-size};] 
    get lfhds() { return ParamFactory.lfhds(this); }
    // [lfmks=[!]"data-1-other-than-log-information" 
    get lfmks() { return ParamFactory.lfmks(this); }
    //      [: [!]"data-2-other-than-log-information"...];]
    // [lfsiv=file-monitoring-interval;] 
    get lfsiv() { return ParamFactory.lfsiv(this); }
    // [lfmxl=maximum-event-data-length;] 
    get lfmxl() { return ParamFactory.lfmxl(this); }
    // [lfsrc={y|n};] 
    get lfsrc() { return ParamFactory.lfsrc(this); }
    // [lfcre={y|n};] 
    get lfcre() { return ParamFactory.lfcre(this); }
    // [jpoif=macro-variable-name:passing-information-name;] 
    get jpoif() { return ParamFactory.jpoif(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this, 'kl'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rlfwj extends Lfwj { }
export class Ntwj extends UnitEntity {
    // [ntlgt={sys|sec|app|dns|dir|frs|oth};] 
    get ntlgt() { return ParamFactory.ntlgt(this); }
    // [ntolg="any-log-type";] 
    get ntolg() { return ParamFactory.ntolg(this); }
    // [ntevt=[v[: i[: w[: e[: s[: c[: f]]]]]]];] 
    get ntevt() { return ParamFactory.ntevt(this); }
    // [ntnsr={y|n};] 
    get ntnsr() { return ParamFactory.ntnsr(this); }
    // [ntsrc="source";] 
    get ntsrc() { return ParamFactory.ntsrc(this); }
    // [ntncl={y|n};] 
    get ntncl() { return ParamFactory.ntncl(this); }
    // [ntcls="class";] 
    get ntcls() { return ParamFactory.ntcls(this); }
    // [ntnei={y|n};] 
    get ntnei() { return ParamFactory.ntnei(this); }
    // [nteid=event-ID;] 
    get nteid() { return ParamFactory.nteid(this); }
    // [ntdis="explanation";] 
    get ntdis() { return ParamFactory.ntdis(this); }
    // [jpoif=macro-variable-name:passing-information-name;] 
    get jpoif() { return ParamFactory.jpoif(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this, 'kl'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rntwj extends Ntwj { }
export class Tmwj extends UnitEntity {
    // [tmitv=wait-time;] 
    get tmitv() { return ParamFactory.tmitv(this); }
    // [etn={y|n};] 
    get etn() { return ParamFactory.etn(this, 'n'); }
    // [jpoif=macro-variable-name:passing-information-name;] 
    get jpoif() { return ParamFactory.jpoif(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this, 'kl'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rtmwj extends Tmwj { }
export class Evsj extends UnitEntity {
    // [evsid=event-ID;] 
    get evsid() { return ParamFactory.evsid(this); }
    // [evhst="event-destination-host-name";] 
    get evhst() { return ParamFactory.evhst(this); }
    // [evsms="message";] 
    get evsms() { return ParamFactory.evsms(this); }
    // [evssv={em|al|cr|er|wr|no|in|db};] 
    get evssv() { return ParamFactory.evssv(this, 'no'); }
    // [evsfr=extended-attribute-name:"value";] 
    get evsfr() { return ParamFactory.evsfr(this); }
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this, 'p'); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [evsrt={y|n};] 
    get evsrt() { return ParamFactory.evsrt(this, 'n'); }
    // [evspl=check-interval;] 
    get evspl() { return ParamFactory.evspl(this, '10'); }
    // [evsrc=check-count;] 
    get evsrc() { return ParamFactory.evsrc(this, '0'); }
    // [jty={q|n};] 
    get jty() { return ParamFactory.jty(this, 'q'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Revsj extends Evsj { }
export class Mlsj extends UnitEntity {
    // [mladr={to|cc|bcc}:"address";] 
    get mladr() { return ParamFactory.mladr(this); }
    // [mlprf="profile-name";] 
    get mlprf() { return ParamFactory.mlprf(this); }
    // [mlsbj="subject";] 
    get mlsbj() { return ParamFactory.mlsbj(this); }
    // [mltxt="text";] 
    get mltxt() { return ParamFactory.mltxt(this); }
    // [mlftx="text-file-name";] 
    get mlftx() { return ParamFactory.mlftx(this); }
    // [mlatf="attached-file-name";] 
    get mlatf() { return ParamFactory.mlatf(this); }
    // [mlafl="attached-file-list-name";] 
    get mlafl() { return ParamFactory.mlafl(this); }
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this, 'p'); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [jty={q|n};] 
    get jty() { return ParamFactory.jty(this, 'q'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rmlsj extends Mlsj { }
export class Mqsj extends UnitEntity {
    // [mqque=queue-name;] 
    get mqque() { return ParamFactory.mqque(this); }
    // [mqcor=correlation-ID;] 
    get mqcor() { return ParamFactory.mqcor(this); }
    // [mqdsc=message-ID;] 
    get mqdsc() { return ParamFactory.mqdsc(this); }
    // [mqprm={y|n};] 
    get mqprm() { return ParamFactory.mqprm(this); }
    // [mqmgr=queue-manager-name;] 
    get mqmgr() { return ParamFactory.mqmgr(this); }
    // [mqmdl=model-queue-name;] 
    get mqmdl() { return ParamFactory.mqmdl(this); }
    // [mqpgm=related-queue-management-program-name;] 
    get mqpgm() { return ParamFactory.mqpgm(this); }
    // [mqmfn=format-name;] 
    get mqmfn() { return ParamFactory.mqmfn(this); }
    // [mqmdn="message-data-file-name";] 
    get mqmdn() { return ParamFactory.mqmdn(this); }
    // [mqhld=hold-time;] 
    get mqhld() { return ParamFactory.mqhld(this); }
    // [mqpri=priority:] 
    get mqpri() { return ParamFactory.mqpri(this); }
    // [mqeqn=dead-letter-queue-name;] 
    get mqeqn() { return ParamFactory.mqeqn(this); }
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this, 'p'); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [jty={q|n};] 
    get jty() { return ParamFactory.jty(this, 'q'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rmqsj extends Mqsj { }
export class Mssj extends UnitEntity {
    // [msqpt="queue-path-name";] 
    get msqpt() { return ParamFactory.msqpt(this); }
    // [msqlb="queue-label-name";] 
    get msqlb() { return ParamFactory.msqlb(this); }
    // [msrer=correlation-ID;] 
    get msrer() { return ParamFactory.msrer(this); }
    // [mslmt={-2|-1|n};] 
    get mslmt() { return ParamFactory.mslmt(this); }
    // [mshld={-1|n};] 
    get mshld() { return ParamFactory.mshld(this); }
    // [msmod={h|r};] 
    get msmod() { return ParamFactory.msmod(this); }
    // [mspri=priority;] 
    get mspri() { return ParamFactory.mspri(this); }
    // [msjnl={y|n};] 
    get msjnl() { return ParamFactory.msjnl(this); }
    // [msunr={y|n};] 
    get msunr() { return ParamFactory.msunr(this); }
    // [mstfn="text-file-name";] 
    get mstfn() { return ParamFactory.mstfn(this); }
    // [msttp=text-type;] 
    get msttp() { return ParamFactory.msttp(this); }
    // [mslbl="message-label";] 
    get mslbl() { return ParamFactory.mslbl(this); }
    // [msapl=application-information;] 
    get msapl() { return ParamFactory.msapl(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [jty={q|n};] 
    get jty() { return ParamFactory.jty(this, 'q'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rmssj extends Mssj { }
export class Cmsj extends UnitEntity {
    // [cmsts={un|no|wa|mi|ma|cr|re|te|di};] 
    get cmsts() { return ParamFactory.cmsts(this); }
    // [cmaif="additional-information";] 
    get cmaif() { return ParamFactory.cmaif(this); }
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this, 'p'); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [jty={q|n};] 
    get jty() { return ParamFactory.jty(this, 'q'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rcmsj extends Cmsj { }
export class Pwlj extends UnitEntity {
    // [pwlt={f|r|s};] 
    get pwlt() { return ParamFactory.pwlt(this); }
    // [pwlf={m|r|f|p};] 
    get pwlf() { return ParamFactory.pwlf(this); }
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this, 'p'); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [jty={q|n};] 
    get jty() { return ParamFactory.jty(this, 'q'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rpwlj extends Pwlj { }
export class Pwrj extends UnitEntity {
    // [pwrh="target-host-name";] 
    get pwrh() { return ParamFactory.pwrh(this); }
    // [pwrf={o|m|r|f|p|s};] 
    get pwrf() { return ParamFactory.pwrf(this); }
    // [pwrn={n|a|c:[mm/dd.]hh:mm};] 
    get pwrn() { return ParamFactory.pwrn(this); }
    // [pwrr={y|n};] 
    get pwrr() { return ParamFactory.pwrr(this); }
    // [pwrw={y|n};] 
    get pwrw() { return ParamFactory.pwrw(this); }
    // [pwrp={p|u};] 
    get pwrp() { return ParamFactory.pwrp(this); }
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this, 'p'); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [jty={q|n};] 
    get jty() { return ParamFactory.jty(this, 'q'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rpwrj extends Pwrj { }
export class Cj extends UnitEntity {
    // [cty="custom-job-class-name";] 
    get cty() { return ParamFactory.cty(this); }
    // [te="command-text";] 
    get te() { return ParamFactory.te(this); }
    // [sc="script-file-name";] 
    get sc() { return ParamFactory.sc(this); }
    // [prm="parameter";] 
    get prm() { return ParamFactory.prm(this); }
    // [env="environment-variable";] 
    get env() { return ParamFactory.env(this); }
    // [so="standard-output-file-name";] 
    get so() { return ParamFactory.so(this); }
    // [se="standard-error-output-file-name";] 
    get se() { return ParamFactory.se(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [pr=n;] 
    get pr() { return ParamFactory.pr(this, '1'); }
    // [ex="job-execution-agent-host-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [un="target-user-name";] 
    get un() { return ParamFactory.un(this); }
    // [jd={nm|ab|cod|mdf|exf};] 
    get jd() { return ParamFactory.jd(this, 'cod'); }
    // [wth=n;] 
    get wth() { return ParamFactory.wth(this); }
    // [tho=n;] 
    get tho() { return ParamFactory.tho(this, '0'); }
    // [jdf="end-judgment-file-name";] 
    get jdf() { return ParamFactory.jdf(this); }
    // [abr={y|n};] 
    get abr() { return ParamFactory.abr(this, 'n'); }
    // [rjs=lower-limit-of-return-codes-to-be-retried-automatically;] 
    get rjs() { return ParamFactory.rjs(this); }
    // [rje=upper-limit-of-return-codes-to-be-retried-automatically;] 
    get rje() { return ParamFactory.rje(this); }
    // [rec=maximum-number-of-retry-executions;] 
    get rec() { return ParamFactory.rec(this, '1'); }
    // [rei=retry-interval;] 
    get rei() { return ParamFactory.rei(this, '1'); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [wkp="work-path-name";] 
    get wkp() { return ParamFactory.wkp(this); }
    // [ev="environmental-variable-file-name";] 
    get ev() { return ParamFactory.ev(this); }
    // [si="standard-input-file-name";] 
    get si() { return ParamFactory.si(this); }
    // [soa={new|add};] 
    get soa() { return ParamFactory.soa(this, 'new'); }
    // [sea={new|add};] 
    get sea() { return ParamFactory.sea(this, 'new'); }
    // [ts1="transfer-source-file-name-1";] 
    get ts1() { return ParamFactory.ts1(this); }
    // [td1="transfer-destination-file-name-1";] 
    get td1() { return ParamFactory.td1(this); }
    // [top1={sav|del};] 
    get top1() { return ParamFactory.top1(this, this.ts1 && this.td1 ? 'sav' : this.ts1 && !this.td1 ? 'del' : ''); }
    // [ts2="transfer-source-file-name-2";] 
    get ts2() { return ParamFactory.ts2(this); }
    // [td2="transfer-destination-file-name-2";] 
    get td2() { return ParamFactory.td2(this); }
    // [top2={sav|del};] 
    get top2() { return ParamFactory.top2(this, this.ts2 && this.td2 ? 'sav' : this.ts2 && !this.td2 ? 'del' : ''); }
    // [ts3="transfer-source-file-name-3";] 
    get ts3() { return ParamFactory.ts3(this); }
    // [td3="transfer-destination-file-name-3";] 
    get td3() { return ParamFactory.td3(this); }
    // [top3={sav|del};] 
    get top3() { return ParamFactory.top3(this, this.ts3 && this.td3 ? 'sav' : this.ts3 && !this.td3 ? 'del' : ''); }
    // [ts4="transfer-source-file-name-4";] 
    get ts4() { return ParamFactory.ts4(this); }
    // [td4="transfer-destination-file-name-4";] 
    get td4() { return ParamFactory.td4(this); }
    // [top4={sav|del};] 
    get top4() { return ParamFactory.top4(this, this.ts4 && this.td4 ? 'sav' : this.ts4 && !this.td4 ? 'del' : ''); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rcj extends Cj { }
export class Cpj extends UnitEntity {
    // cty="AJSVAR"; 
    get cty() { return ParamFactory.cty(this); }
    // sc="$JP1AJS2_JPOEXEPATH$/jpqpinfoset"; 
    get sc() { return ParamFactory.sc(this); }
    // prm="-o output-variable-1 [-o output-variable-2...]"; 
    get prm() { return ParamFactory.prm(this); }
    // env="AJS2SO_GLOBMACFILE=?AJS2SO_GLOBMACFILE?"; 
    // env="AJS2SO_STDOUTFILE=?AJS2SO_STDOUTFILE?"; 
    // env="AJS2SO_RE_output-variable-1=regular-expression-1"; 
    // [env="AJS2SO_RE_output-variable-2=regular-expression-2";...] 
    get env() { return ParamFactory.env(this); }
    // [wth=n;] 
    get wth() { return ParamFactory.wth(this); }
    // [tho=n;] 
    get tho() { return ParamFactory.tho(this, '0'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rcpj extends Cpj { }
export class Fxj extends UnitEntity {
    // [ex="relay-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // da="destination-or-broadcast-agent"; 
    get da() { return ParamFactory.da(this); }
    // [fxg={none|sync|async};] 
    get fxg() { return ParamFactory.fxg(this, 'none'); }
    // sc="name-of-the-file-to-be-executed-on-the-agent-host"; 
    get sc() { return ParamFactory.sc(this); }
    // [prm="parameter";] 
    get prm() { return ParamFactory.prm(this); }
    // [env="environment-variable";]... 
    get env() { return ParamFactory.env(this); }
    // [jd={nm|ab|cod|mdf|exf};] 
    get jd() { return ParamFactory.jd(this, 'cod'); }
    // [wth=n;] 
    get wth() { return ParamFactory.wth(this); }
    // [tho=n;] 
    get tho() { return ParamFactory.tho(this, '0'); }
    // [jdf="end-judgment-file-name";] 
    get jdf() { return ParamFactory.jdf(this); }
    // [abr={y|n};] 
    get abr() { return ParamFactory.abr(this, 'n'); }
    // [rjs=lower-limit-of-return-codes-to-be-retried-automatically;] 
    get rjs() { return ParamFactory.rjs(this); }
    // [rje=upper-limit-of-return-codes-to-be-retried-automatically;] 
    get rje() { return ParamFactory.rje(this); }
    // [rec=maximum-number-of-retry-executions;] 
    get rec() { return ParamFactory.rec(this, '1'); }
    // [rei=retry-interval;] 
    get rei() { return ParamFactory.rei(this, '1'); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rfxj extends Fxj { }
export class Htpj extends UnitEntity {
    // htcfl="connection-configuration-file-name"; 
    get htcfl() { return ParamFactory.htcfl(this); }
    // [htknd={GET|POST|PUT|DELETE};] 
    get htknd() { return ParamFactory.htknd(this, 'GET'); }
    // [htexm={y|n};] 
    get htexm() { return ParamFactory.htexm(this, 'n'); }
    // [htrqf="transmission-information-file-name";] 
    get htrqf() { return ParamFactory.htrqf(this); }
    // [htrqu="transmission-information-file-name-(URL-parameter)";] 
    get htrqu() { return ParamFactory.htrqu(this); }
    // [htrqm="transmission-information-file-name-(message-body)";] 
    get htrqm() { return ParamFactory.htrqm(this); }
    // htstf="statuses-store-file-name"; 
    get htstf() { return ParamFactory.htstf(this); }
    // [htspt={diff|same};] 
    get htspt() { return ParamFactory.htspt(this, 'diff'); }
    // htrhf="received-header-store-file-name"; 
    get htrhf() { return ParamFactory.htrhf(this); }
    // [htrbf="received-body-store-file-name";] 
    get htrbf() { return ParamFactory.htrbf(this); }
    // [htcdm=return-code-1:HTTP-status-code-1,[HTTP-status-code-2...];] 
    get htcdm() { return ParamFactory.htcdm(this); }
    // [so="standard-output-file-name";] 
    get so() { return ParamFactory.so(this); }
    // [se="standard-error-output-file-name";] 
    get se() { return ParamFactory.se(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [pr=n;] 
    get pr() { return ParamFactory.pr(this, '1'); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [un="target-user-name";] 
    get un() { return ParamFactory.un(this); }
    // [jd={nm|ab|cod|mdf|exf};] 
    get jd() { return ParamFactory.jd(this, 'cod'); }
    // [wth=n;] 
    get wth() { return ParamFactory.wth(this); }
    // [tho=n;] 
    get tho() { return ParamFactory.tho(this, '0'); }
    // [jdf="end-judgment-file-name";] 
    get jdf() { return ParamFactory.jdf(this); }
    // [abr={y|n};] 
    get abr() { return ParamFactory.abr(this, 'n'); }
    // [rjs=lower-limit-of-return-codes-to-be-retried-automatically;] 
    get rjs() { return ParamFactory.rjs(this); }
    // [rje=upper-limit-of-return-codes-to-be-retried-automatically;] 
    get rje() { return ParamFactory.rje(this); }
    // [rec=maximum-number-of-retry-executions;] 
    get rec() { return ParamFactory.rec(this, '1'); }
    // [rei=retry-interval;]  
    get rei() { return ParamFactory.rei(this, '1'); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rhtpj extends Htpj { }
export class Nc extends UnitEntity {
    // [ncr=connection-destination-root-jobnet-name;] 
    get ncr() { return ParamFactory.ncr(this); }
    // [ncex={y|n};] 
    get ncex() { return ParamFactory.ncex(this); }
    // [nchn="connection-host-name";] 
    get nchn() { return ParamFactory.nchn(this); }
    // [ncsv=connection-service-name;] 
    get ncsv() { return ParamFactory.ncsv(this); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}

const tyClasses = {
    'g': G, 'mg': Mg, 'n': N, 'rn': Rn, 'rm': Rm, 'rr': Rr, 'rc': Rc, 'mn': Mn, 'j': J, 'rj': Rj, 'pj': Pj, 'rp': Rp, 'qj': Qj, 'rq': Rq,
    'jdj': Jdj, 'rjdj': Rjdj, 'orj': Orj, 'rorj': Rorj, 'evwj': Evwj, 'revwj': Revwj, 'flwj': Flwj, 'rflwj': Rflwj, 'mlwj': Mlwj, 'rmlwj': Rmlwj, 'mqwj': Mqwj, 'rmqwj': Rmqwj,
    'mswj': Mswj, 'rmswj': Rmswj, 'lfwj': Lfwj, 'rlfwj': Rlfwj, 'ntwj': Ntwj, 'rntwj': Rntwj, 'tmwj': Tmwj, 'rtmwj': Rtmwj, 'evsj': Evsj, 'revsj': Revsj, 'mlsj': Mlsj,
    'rmlsj': Rmlsj, 'mqsj': Mqsj, 'rmqsj': Rmqsj, 'mssj': Mssj, 'rmssj': Rmssj, 'cmsj': Cmsj, 'rcmsj': Rcmsj, 'pwlj': Pwlj, 'rpwlj': Rpwlj, 'pwrj': Pwrj, 'rpwrj': Rpwrj,
    'cj': Cj, 'rcj': Rcj, 'cpj': Cpj, 'rcpj': Rcpj, 'fxj': Fxj, 'rfxj': Rfxj, 'htpj': Htpj, 'rhtpj': Rhtpj, 'nc': Nc
} as const;
export function tyFactory<T extends UnitEntity>(unit: Unit): T {
    if (!unit) {
        throw new Error('unit is undefined.');
    }
    const tyValue = unit.parameters.find((v) => v.key === 'ty')?.value;
    if (!tyValue) {
        throw new Error('ty value is undefined.');
    }
    if (!isTy(tyValue)) {
        throw new Error(`'${tyValue}' is not ty type.`);
    }
    return new tyClasses[tyValue](unit) as T;
}
