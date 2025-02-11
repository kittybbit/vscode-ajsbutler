import { isTySymbol } from "../values/AjsType";
import { Unit } from "../values/Unit";
import { UnitEntity } from "../models/units/UnitEntities";
import { G } from "../models/units/G";
import { Cj, Rcj } from "../models/units/Cj";
import { Cmsj, Rcmsj } from "../models/units/Cmsj";
import { Cpj, Rcpj } from "../models/units/Cpj";
import { Evsj, Revsj } from "../models/units/Evsj";
import { Evwj, Revwj } from "../models/units/Evwj";
import { Flwj, Rflwj } from "../models/units/Flwj";
import { Fxj, Rfxj } from "../models/units/Fxj";
import { Htpj, Rhtpj } from "../models/units/Htpj";
import { J, Rj, Pj, Rp } from "../models/units/J";
import { Jdj, Rjdj } from "../models/units/Jdj";
import { Lfwj, Rlfwj } from "../models/units/Lfwj";
import { Mg, Mn } from "../models/units/Mg";
import { Mlsj, Rmlsj } from "../models/units/Mlsj";
import { Mlwj, Rmlwj } from "../models/units/Mlwj";
import { Mqsj, Rmqsj } from "../models/units/Mqsj";
import { Mqwj, Rmqwj } from "../models/units/Mqwj";
import { Mssj, Rmssj } from "../models/units/Mssj";
import { Mswj, Rmswj } from "../models/units/Mswj";
import { N, Rn, Rm, Rr } from "../models/units/N";
import { Nc } from "../models/units/Nc";
import { Ntwj, Rntwj } from "../models/units/Ntwj";
import { Orj, Rorj } from "../models/units/Orj";
import { Pwlj, Rpwlj } from "../models/units/Pwlj";
import { Pwrj, Rpwrj } from "../models/units/Pwrj";
import { Qj, Rq } from "../models/units/Qj";
import { Rc } from "../models/units/Rc";
import { Tmwj, Rtmwj } from "../models/units/Tmwj";

const tyClasses = {
  g: G,
  mg: Mg,
  n: N,
  rn: Rn,
  rm: Rm,
  rr: Rr,
  rc: Rc,
  mn: Mn,
  j: J,
  rj: Rj,
  pj: Pj,
  rp: Rp,
  qj: Qj,
  rq: Rq,
  jdj: Jdj,
  rjdj: Rjdj,
  orj: Orj,
  rorj: Rorj,
  evwj: Evwj,
  revwj: Revwj,
  flwj: Flwj,
  rflwj: Rflwj,
  mlwj: Mlwj,
  rmlwj: Rmlwj,
  mqwj: Mqwj,
  rmqwj: Rmqwj,
  mswj: Mswj,
  rmswj: Rmswj,
  lfwj: Lfwj,
  rlfwj: Rlfwj,
  ntwj: Ntwj,
  rntwj: Rntwj,
  tmwj: Tmwj,
  rtmwj: Rtmwj,
  evsj: Evsj,
  revsj: Revsj,
  mlsj: Mlsj,
  rmlsj: Rmlsj,
  mqsj: Mqsj,
  rmqsj: Rmqsj,
  mssj: Mssj,
  rmssj: Rmssj,
  cmsj: Cmsj,
  rcmsj: Rcmsj,
  pwlj: Pwlj,
  rpwlj: Rpwlj,
  pwrj: Pwrj,
  rpwrj: Rpwrj,
  cj: Cj,
  rcj: Rcj,
  cpj: Cpj,
  rcpj: Rcpj,
  fxj: Fxj,
  rfxj: Rfxj,
  htpj: Htpj,
  rhtpj: Rhtpj,
  nc: Nc,
} as const;

export const tyFactory = <T extends UnitEntity>(
  unit: Unit,
  parent?: UnitEntity,
): T => {
  const tyValue = unit.parameters.find((v) => v.key === "ty")?.value;
  if (!tyValue) {
    throw new Error("ty value is undefined.");
  }
  if (!isTySymbol(tyValue)) {
    throw new Error(`'${tyValue}' is not ty type.`);
  }
  const unitEntity = new tyClasses[tyValue](unit, parent) as T;
  // console.log(JSON.stringify(unitEntity.prettyJSON(), null, 2));
  return unitEntity;
};

export const flattenChildren = (unitEntities: UnitEntity[]): UnitEntity[] =>
  unitEntities.reduce(
    (acc, unitEntity) =>
      acc.concat(unitEntity, flattenChildren(unitEntity.children || [])),
    Array.of<UnitEntity>(),
  );
