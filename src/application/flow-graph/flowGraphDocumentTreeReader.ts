import type { FlowGraphUnitDto } from "./flowGraphDocument";
import {
  addFatalIssue,
  isRecord,
  type ValidationState,
} from "./flowGraphDocumentUnitValidation";
import { readUnit, type ReadUnitInput } from "./flowGraphDocumentUnitReader";

type ValidationFrame =
  | {
      phase: "enter";
      value: unknown;
      expectedParentId: string | undefined;
      expectedDepth: number;
      target: FlowGraphUnitDto[];
    }
  | { phase: "exit"; value: object };

type ParsedUnit = { unit: FlowGraphUnitDto; children: unknown[] };

const createRootFrames = (
  values: unknown[],
  rootUnits: FlowGraphUnitDto[],
): ValidationFrame[] =>
  values
    .map<ValidationFrame>((value) => ({
      phase: "enter",
      value,
      expectedParentId: undefined,
      expectedDepth: 0,
      target: rootUnits,
    }))
    .reverse();

const isRepeatedObject = (value: unknown, state: ValidationState): boolean =>
  isRecord(value) && (state.visiting.has(value) || state.visited.has(value));

const enteredObject = (frame: ValidationFrame): object | undefined => {
  if (frame.phase !== "enter") return undefined;
  if (!isRecord(frame.value)) return undefined;
  return frame.value;
};

const recordEnteredObject = (
  value: object,
  state: ValidationState,
): boolean => {
  const repeated = isRepeatedObject(value, state);
  if (repeated) {
    addFatalIssue(state, {
      code: "parent_cycle",
      message: "A repeated or cyclic flow-unit object was found.",
    });
  } else {
    state.visiting.add(value);
  }
  return repeated;
};

const markEnteredObject = (
  frame: ValidationFrame,
  state: ValidationState,
): boolean => {
  const value = enteredObject(frame);
  return value ? recordEnteredObject(value, state) : false;
};

const finishInvalidFrame = (
  frame: ValidationFrame,
  state: ValidationState,
): void => {
  if (frame.phase === "enter" && isRecord(frame.value)) {
    state.visiting.delete(frame.value);
    state.visited.add(frame.value);
  }
};

const finishExitFrame = (
  frame: Extract<ValidationFrame, { phase: "exit" }>,
  state: ValidationState,
): void => {
  state.visiting.delete(frame.value);
  state.visited.add(frame.value);
};

const readEnteredFrame = (
  frame: Extract<ValidationFrame, { phase: "enter" }>,
  state: ValidationState,
): ParsedUnit | undefined =>
  readUnit({
    value: frame.value,
    expectedParentId: frame.expectedParentId,
    expectedDepth: frame.expectedDepth,
    state,
  } satisfies ReadUnitInput);

const readFrame = (
  frame: ValidationFrame,
  state: ValidationState,
): ParsedUnit | undefined => {
  if (frame.phase === "exit") {
    finishExitFrame(frame, state);
    return undefined;
  }
  return readActiveFrame(frame, state);
};

const readActiveFrame = (
  frame: Extract<ValidationFrame, { phase: "enter" }>,
  state: ValidationState,
): ParsedUnit | undefined => {
  if (markEnteredObject(frame, state)) return undefined;
  const parsed = readEnteredFrame(frame, state);
  if (!parsed) finishInvalidFrame(frame, state);
  return parsed;
};

const appendChildFrames = (
  frame: Extract<ValidationFrame, { phase: "enter" }>,
  parsed: ParsedUnit,
  pending: ValidationFrame[],
): void => {
  pending.push({ phase: "exit", value: frame.value as object });
  parsed.children
    .map((value) => ({
      phase: "enter" as const,
      value,
      expectedParentId: parsed.unit.id,
      expectedDepth: parsed.unit.depth + 1,
      target: parsed.unit.children,
    }))
    .reverse()
    .forEach((child) => pending.push(child));
};

const appendParsedFrame = (
  frame: ValidationFrame,
  parsed: ParsedUnit | undefined,
  pending: ValidationFrame[],
): void => {
  if (!parsed || frame.phase === "exit") return;
  frame.target.push(parsed.unit);
  appendChildFrames(frame, parsed, pending);
};

export const readRootUnits = (
  values: unknown[],
  state: ValidationState,
): FlowGraphUnitDto[] => {
  const rootUnits: FlowGraphUnitDto[] = [];
  const pending = createRootFrames(values, rootUnits);
  while (pending.length > 0) {
    const frame = pending.pop() as ValidationFrame;
    const parsed = readFrame(frame, state);
    appendParsedFrame(frame, parsed, pending);
  }
  return rootUnits;
};
