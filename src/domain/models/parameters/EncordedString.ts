import Parameter from "./Parameter";

class EncordedString extends Parameter {
  override value(): string | undefined {
    return super
      .value()
      ?.replace(/^"(.*)"$/, "$1")
      .replace(/#"/g, '"')
      .replace(/##/g, "#");
  }
}

export class Cm extends EncordedString {}
export class Da extends EncordedString {}
export class Ejf extends EncordedString {}
export class Env extends EncordedString {}
export class Ev extends EncordedString {}
export class Evdet extends EncordedString {}
export class Evgrp extends EncordedString {}
export class Evhst extends EncordedString {}
export class Evsfr extends EncordedString {}
export class Evsms extends EncordedString {}
export class Evusr extends EncordedString {}
export class Ex extends EncordedString {}
export class Flwf extends EncordedString {}
export class Htcfl extends EncordedString {}
export class Htrbf extends EncordedString {}
export class Htrhf extends EncordedString {}
export class Htrqf extends EncordedString {}
export class Htrqm extends EncordedString {}
export class Htrqu extends EncordedString {}
export class Htstf extends EncordedString {}
export class Jdf extends EncordedString {}
export class Mh extends EncordedString {}
export class Mladr extends EncordedString {}
export class Mlafl extends EncordedString {}
export class Mllst extends EncordedString {}
export class Mlprf extends EncordedString {}
export class Mlsbj extends EncordedString {}
export class Mlsfd extends EncordedString {}
export class Mlstx extends EncordedString {}
export class Mltxt extends EncordedString {}
export class Nchn extends EncordedString {}
export class Prm extends EncordedString {}
export class Qm extends EncordedString {}
export class Qu extends EncordedString {}
export class Req extends EncordedString {}
export class Rh extends EncordedString {}
export class Sc extends EncordedString {}
export class Se extends EncordedString {}
export class Si extends EncordedString {}
export class So extends EncordedString {}
export class Td1 extends EncordedString {}
export class Td2 extends EncordedString {}
export class Td3 extends EncordedString {}
export class Td4 extends EncordedString {}
export class Te extends EncordedString {}
export class Ts1 extends EncordedString {}
export class Ts2 extends EncordedString {}
export class Ts3 extends EncordedString {}
export class Ts4 extends EncordedString {}
export class Un extends EncordedString {}
export class Wkp extends EncordedString {}
