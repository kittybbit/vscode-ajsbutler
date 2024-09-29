import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

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