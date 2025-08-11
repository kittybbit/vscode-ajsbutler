import React, { JSX } from "react";
import { Box } from "@mui/material";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { ParamSymbol, TySymbol } from "../../../../domain/values/AjsType";
import Parameter from "../../../../domain/models/parameters/Parameter";

type PrimitiveType =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;
const isPrimitiveType = (value: unknown): value is PrimitiveType => {
  const type = typeof value;
  return (
    value === null ||
    type === "string" ||
    type === "number" ||
    type === "bigint" ||
    type === "boolean" ||
    type === "symbol" ||
    type === "undefined"
  );
};
type BoxType = Parameter | PrimitiveType;
export type AccessorType = BoxType | BoxType[];

/** accessorFn for cell method of tableDefaultColumnDef. */
export const defaultAccessorFn = <T extends AccessorType>(
  param: ParamSymbol,
) => {
  return (row: UnitEntity /*, index: number*/): T => {
    return row.params(param) as T;
  };
};

const defaultFn = <T,>(param: T, index: number): JSX.Element => {
  if (param instanceof Parameter) {
    return (
      <Box
        key={index}
        data-param={param.parameter}
        data-raw={param.rawValue}
        data-inherited={param.inherited}
        data-defalut={param.isDefault}
        sx={() => {
          if (param.isDefault || param.inherited) {
            return { color: "text.disabled" };
          }
          return {};
        }}
      >
        {param.value()}
      </Box>
    );
  }
  if (isPrimitiveType(param)) {
    return (
      <Box
        key={index}
        data-param={undefined}
        data-raw={param}
        data-inherited={false}
        data-defalut={false}
      >
        {new String(param).toString()}
      </Box>
    );
  }
  return <></>;
};

/**
 * Create a box element for display.
 * @param param parameter for display
 * @param index index for display
 * @param fn function to customize display
 * @returns JSX.Element
 */
export const box = <T,>(
  param: T,
  index: number = 0,
  fn: (param: T, index: number) => JSX.Element = defaultFn,
) => fn(param, index);

/** When ty matches, invoke accessorFn. */
export const tyAccessorFn = <T extends AccessorType>(
  targetTy: TySymbol[],
  accessorFn: (row: UnitEntity, index: number) => T,
) => {
  return (row: UnitEntity, index: number): T => {
    return targetTy.includes(row.ty.value())
      ? accessorFn(row, index)
      : (undefined as T);
  };
};
