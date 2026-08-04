export type ScheduleDateWeekday =
  | "su"
  | "mo"
  | "tu"
  | "we"
  | "th"
  | "fr"
  | "sa";

export type ScheduleDateDay =
  | { kind: "calendar"; value: number }
  | { kind: "relative"; value: number }
  | { kind: "open"; value: number }
  | { kind: "closed"; value: number }
  | {
      kind: "backward";
      prefix: "+" | "*" | "@" | undefined;
      offset: number | undefined;
    }
  | {
      kind: "weekday";
      prefix: "+" | "";
      weekday: ScheduleDateWeekday;
      occurrence: number | "b" | undefined;
    }
  | { kind: "en" }
  | { kind: "ud" };

export type ScheduleDateInterpretation = {
  rule: number;
  hasExplicitRuleNumber: boolean;
  year: number | undefined;
  month: number | undefined;
  dayValue: string;
  day: ScheduleDateDay;
};

const scheduleDateValuePattern =
  /^((\d{1,3}),)?(?:(?:(\d{4})\/)?(\d{2})\/)?(.+)$/;

const scheduleDateWeekdayPattern = /^(\+?)(su|mo|tu|we|th|fr|sa)(?::(\d|b))?$/;

const scheduleDateWeekdays = new Set<ScheduleDateWeekday>([
  "su",
  "mo",
  "tu",
  "we",
  "th",
  "fr",
  "sa",
]);

const interpretScheduleDateDay = (
  dayValue: string,
): ScheduleDateDay | undefined => {
  const numericDay = /^([+*@])?(\d{2})$/.exec(dayValue);
  if (numericDay) {
    const value = Number(numericDay[2]);
    switch (numericDay[1]) {
      case "+":
        return { kind: "relative", value };
      case "*":
        return { kind: "open", value };
      case "@":
        return { kind: "closed", value };
      default:
        return { kind: "calendar", value };
    }
  }

  const backwardDay = /^([+*@])?b(?:-(\d{2}))?$/.exec(dayValue);
  if (backwardDay) {
    return {
      kind: "backward",
      prefix: backwardDay[1] as "+" | "*" | "@" | undefined,
      offset: backwardDay[2] === undefined ? undefined : Number(backwardDay[2]),
    };
  }

  const weekday = scheduleDateWeekdayPattern.exec(dayValue);
  if (weekday && scheduleDateWeekdays.has(weekday[2] as ScheduleDateWeekday)) {
    const occurrence = weekday[3];
    return {
      kind: "weekday",
      prefix: weekday[1] as "+" | "",
      weekday: weekday[2] as ScheduleDateWeekday,
      occurrence:
        occurrence === undefined
          ? undefined
          : occurrence === "b"
            ? "b"
            : Number(occurrence),
    };
  }

  if (dayValue === "en") {
    return { kind: "en" };
  }

  if (dayValue === "ud") {
    return { kind: "ud" };
  }

  return undefined;
};

export const interpretScheduleDateValue = (
  rawValue: string | undefined,
): ScheduleDateInterpretation | undefined => {
  const matched = scheduleDateValuePattern.exec(rawValue ?? "");
  if (!matched) {
    return undefined;
  }

  const dayValue = matched[5];
  const day = interpretScheduleDateDay(dayValue);
  if (!day) {
    return undefined;
  }

  return {
    rule: matched[1] === undefined ? 1 : Number(matched[2]),
    hasExplicitRuleNumber: matched[1] !== undefined,
    year: matched[3] === undefined ? undefined : Number(matched[3]),
    month: matched[4] === undefined ? undefined : Number(matched[4]),
    dayValue,
    day,
  };
};
