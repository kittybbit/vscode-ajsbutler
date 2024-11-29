import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

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
    get ha() { return ParamFactory.ha(this); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this); }
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this); }

    /** Whether this jobnet have a unit whose end is being waited for. */
    get hasWaitedFor() {
        return this.eun && this.eun.length > 0;
    }
}
export class Rlfwj extends Lfwj { }