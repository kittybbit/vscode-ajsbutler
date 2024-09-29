import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

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