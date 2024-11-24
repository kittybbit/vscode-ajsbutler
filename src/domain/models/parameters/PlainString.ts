import { isTySymbol } from "../../values/AjsType";
import Parameter from "./Parameter";

class PlainString extends Parameter { }
export default PlainString;

export class Ab extends PlainString { }
export class Abr extends PlainString { }
export class Ar extends PlainString {
    #pattern = /\(f=(.+?),t=(.+?),(.+)\)/;
    get f(): string {
        const result = this.#pattern.exec(this.value() as string);
        if (result?.length === 4) {
            return result[1];
        } else {
            throw new Error(`unexpected format: ${this.value()}`);
        }
    }
    get t(): string | undefined {
        const result = this.#pattern.exec(this.value() as string);
        if (result?.length === 4) {
            return result[2];
        } else {
            throw new Error(`unexpected format: ${this.value()}`);
        }
    }
    get relationType(): string | undefined {
        const result = this.#pattern.exec(this.value() as string);
        if (result?.length === 4) {
            return result[3];
        } else {
            throw new Error(`unexpected format: ${this.value()}`);
        }
    }
}
export class Cd extends PlainString { }
export class Cgs extends PlainString { }
export class Cmaif extends PlainString { }
export class Cmsts extends PlainString { }
export class Cond extends PlainString { }
export class Cty extends PlainString { }
export class De extends PlainString { }
export class Ed extends PlainString { }
export class Ega extends PlainString { }
export class Ej extends PlainString { }
export class Ejc extends PlainString { }
export class Ejg extends PlainString { }
export class Ejh extends PlainString { }
export class Eji extends PlainString { }
export class Ejl extends PlainString { }
export class Ejm extends PlainString { }
export class Ejn extends PlainString { }
export class Ejs extends PlainString { }
export class Ejt extends PlainString { }
export class Eju extends PlainString { }
export class Ejv extends PlainString { }
export class El extends PlainString {
    get name(): string | undefined {
        return this.value()?.split(',')[0];
    }
    get ty(): string | undefined {
        return this.value()?.split(',')[1];
    }
    get hv(): string | undefined {
        return this.value()?.split(',')[2];
    }
}
export class Etm extends PlainString { }
export class Etn extends PlainString { }
export class Ets extends PlainString { }
export class Eu extends PlainString { }
export class Eun extends PlainString { }
export class Evesc extends PlainString { }
export class Evgid extends PlainString { }
export class Evipa extends PlainString { }
export class Evpid extends PlainString { }
export class Evsid extends PlainString { }
export class Evspl extends PlainString { }
export class Evsrc extends PlainString { }
export class Evsrt extends PlainString { }
export class Evssv extends PlainString { }
export class Evtmc extends PlainString { }
export class Evuid extends PlainString { }
export class Evwfr extends PlainString { }
export class Evwid extends PlainString { }
export class Evwms extends PlainString { }
export class Evwsv extends PlainString { }
export class F extends PlainString { }
export class Fd extends PlainString { }
export class Flco extends PlainString { }
export class Flwc extends PlainString { }
export class Flwi extends PlainString { }
export class Fxg extends PlainString { }
export class Gty extends PlainString { }
export class Ha extends PlainString { }
export class Htcdm extends PlainString { }
export class Htexm extends PlainString { }
export class Htknd extends PlainString { }
export class Htspt extends PlainString { }
export class Jc extends PlainString { }
export class Jd extends PlainString { }
export class Jpoif extends PlainString { }
export class Jty extends PlainString { }
export class Lfcre extends PlainString { }
export class Lfdft extends PlainString { }
export class Lffnm extends PlainString { }
export class Lfhds extends PlainString { }
export class Lfmks extends PlainString { }
export class Lfmxl extends PlainString { }
export class Lfrft extends PlainString { }
export class Lfsiv extends PlainString { }
export class Lfsrc extends PlainString { }
export class Lftpd extends PlainString { }
export class Mcs extends PlainString { }
export class Md extends PlainString { }
export class Mlatf extends PlainString { }
export class Mlftx extends PlainString { }
export class Mlsav extends PlainString { }
export class Mm extends PlainString { }
export class Mp extends PlainString { }
export class Mqcor extends PlainString { }
export class Mqdsc extends PlainString { }
export class Mqeqn extends PlainString { }
export class Mqhld extends PlainString { }
export class Mqmdl extends PlainString { }
export class Mqmdn extends PlainString { }
export class Mqmfn extends PlainString { }
export class Mqmgr extends PlainString { }
export class Mqpgm extends PlainString { }
export class Mqpri extends PlainString { }
export class Mqprm extends PlainString { }
export class Mqque extends PlainString { }
export class Mqsfn extends PlainString { }
export class Ms extends PlainString { }
export class Msapl extends PlainString { }
export class Mshld extends PlainString { }
export class Msjnl extends PlainString { }
export class Mslbl extends PlainString { }
export class Mslmt extends PlainString { }
export class Msmod extends PlainString { }
export class Mspri extends PlainString { }
export class Msqlb extends PlainString { }
export class Msqpt extends PlainString { }
export class Msrer extends PlainString { }
export class Mssvf extends PlainString { }
export class Mstfn extends PlainString { }
export class Msttp extends PlainString { }
export class Msunr extends PlainString { }
export class Mu extends PlainString { }
export class Ncex extends PlainString { }
export class Ncl extends PlainString { }
export class Ncn extends PlainString { }
export class Ncr extends PlainString { }
export class Ncs extends PlainString { }
export class Ncsv extends PlainString { }
export class Ni extends PlainString {
    get priority(): number {
        const nice = Number(this.value());
        if (nice > 10) {
            return 5;
        } else if (nice > 0) {
            return 4;
        } else if (nice == 0) {
            return 3;
        } else if (nice > -11) {
            return 2;
        } else {
            return 1;
        }
    }
}
export class Nmg extends PlainString { }
export class Ntcls extends PlainString { }
export class Ntdis extends PlainString { }
export class Nteid extends PlainString { }
export class Ntevt extends PlainString { }
export class Ntlgt extends PlainString { }
export class Ntncl extends PlainString { }
export class Ntnei extends PlainString { }
export class Ntnsr extends PlainString { }
export class Ntolg extends PlainString { }
export class Ntsrc extends PlainString { }
export class Pfm extends PlainString { }
export class Pr extends PlainString { }
export class Pwlf extends PlainString { }
export class Pwlt extends PlainString { }
export class Pwrf extends PlainString { }
export class Pwrh extends PlainString { }
export class Pwrn extends PlainString { }
export class Pwrp extends PlainString { }
export class Pwrr extends PlainString { }
export class Pwrw extends PlainString { }
export class Rec extends PlainString { }
export class Rei extends PlainString { }
export class Rg extends PlainString { }
export class Rje extends PlainString { }
export class Rjs extends PlainString { }
export class Sea extends PlainString { }
export class Soa extends PlainString { }
export class Stt extends PlainString { }
export class Sz extends PlainString { }
export class T extends PlainString { }
export class Tho extends PlainString { }
export class Tmitv extends PlainString { }
export class Top1 extends PlainString { }
export class Top2 extends PlainString { }
export class Top3 extends PlainString { }
export class Top4 extends PlainString { }
export class Ty extends PlainString {
    override value() {
        const ty = super.value();
        if (ty && isTySymbol(ty)) {
            return ty;
        }
        throw new Error(`Unknown ty value. ${ty}`);
    }
}
export class Uem extends PlainString { }
export class Unit extends PlainString { }
export class Wth extends PlainString { }
