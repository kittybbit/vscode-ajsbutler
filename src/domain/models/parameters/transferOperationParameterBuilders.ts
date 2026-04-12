import { Top1, Top2, Top3, Top4 } from "../parameters";
import { Cj } from "../units/Cj";
import { J } from "../units/J";
import { buildTopParameter } from "./parameterHelpers";

export const transferOperationParameterBuilders = {
  top1(unit: J | Cj) {
    return buildTopParameter(
      {
        unit: unit,
        parameter: "top1",
        index: 1,
      },
      (param) => new Top1(param),
    );
  },
  top2(unit: J | Cj) {
    return buildTopParameter(
      {
        unit: unit,
        parameter: "top2",
        index: 2,
      },
      (param) => new Top2(param),
    );
  },
  top3(unit: J | Cj) {
    return buildTopParameter(
      {
        unit: unit,
        parameter: "top3",
        index: 3,
      },
      (param) => new Top3(param),
    );
  },
  top4(unit: J | Cj) {
    return buildTopParameter(
      {
        unit: unit,
        parameter: "top4",
        index: 4,
      },
      (param) => new Top4(param),
    );
  },
};
