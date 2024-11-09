import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

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

    /** Whether this jobnet have a unit whose end is being waited for. */
    get hasWaitedFor() {
        return this.eun && this.eun.length > 0;
    }
}