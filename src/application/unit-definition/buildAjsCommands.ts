import { AjsUnit } from "../../domain/models/ajs/AjsDocument";

export type LocalizedTextDto = {
  labelKey: string;
};

export type UnitDefinitionCommandDto = {
  id: string;
  label: string;
  value: string;
};

export type UnitDefinitionCommandBuilderChoiceDto = LocalizedTextDto & {
  value: string;
  tokens: string[];
  argumentFieldId?: string;
};

export type UnitDefinitionCommandBuilderFieldDto = LocalizedTextDto & {
  id: string;
  descriptionKey: string;
} & (
    | {
        kind: "checkbox";
        option: string;
        defaultValue: boolean;
      }
    | {
        kind: "select";
        defaultValue: string;
        choices: UnitDefinitionCommandBuilderChoiceDto[];
      }
    | {
        kind: "text";
        option?: string;
        defaultValue: string;
        placeholder: string;
        usage: "independent" | "argument";
      }
  );

export type UnitDefinitionCommandBuilderDto = LocalizedTextDto & {
  id: string;
  commandName: string;
  descriptionKey: string;
  manualUrl: LocalizedTextDto & {
    urlByLang: Record<"en" | "ja", string>;
  };
  target: LocalizedTextDto & {
    value: string;
  };
  fields: UnitDefinitionCommandBuilderFieldDto[];
};

export type CommandBuilderValues = Record<string, string | boolean>;

const manualUrls = {
  ajsshow: {
    labelKey: "commandBuilder.common.commandReference",
    urlByLang: {
      en: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0131.HTM",
      ja: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920/AJSO0131.HTM",
    },
  },
  ajsprint: {
    labelKey: "commandBuilder.common.commandReference",
    urlByLang: {
      en: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0121.HTM",
      ja: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920/AJSO0121.HTM",
    },
  },
};

const formatArgument = (argument: string): string =>
  /\s|"/.test(argument) ? `"${argument.replaceAll('"', '\\"')}"` : argument;

const fieldValue = (
  field: UnitDefinitionCommandBuilderFieldDto,
  values: CommandBuilderValues,
): string | boolean => values[field.id] ?? field.defaultValue;

const argumentValue = (
  argumentFieldId: string,
  builder: UnitDefinitionCommandBuilderDto,
  values: CommandBuilderValues,
): string => {
  const field = builder.fields.find(({ id }) => id === argumentFieldId);
  if (!field || field.kind !== "text") return "";

  const value = fieldValue(field, values);
  return typeof value === "string" ? value.trim() : "";
};

export const buildCommandLine = (
  builder: UnitDefinitionCommandBuilderDto,
  values: CommandBuilderValues = {},
): string => {
  const tokens = [builder.commandName];

  builder.fields.forEach((field) => {
    const value = fieldValue(field, values);

    if (field.kind === "checkbox" && value === true) {
      tokens.push(field.option);
      return;
    }

    if (
      field.kind === "text" &&
      field.usage === "independent" &&
      typeof value === "string" &&
      value.trim()
    ) {
      if (field.option) tokens.push(field.option);
      tokens.push(formatArgument(value.trim()));
      return;
    }

    if (field.kind === "select" && typeof value === "string") {
      const choice = field.choices.find(
        (candidate) => candidate.value === value,
      );
      if (!choice) return;

      tokens.push(...choice.tokens);
      if (choice.argumentFieldId) {
        const argument = argumentValue(choice.argumentFieldId, builder, values);
        if (argument) tokens.push(formatArgument(argument));
      }
    }
  });

  tokens.push(formatArgument(builder.target.value));
  return tokens.join(" ");
};

export const buildAjsCommandBuilders = (
  unit: AjsUnit,
): UnitDefinitionCommandBuilderDto[] => [
  {
    id: "ajsshow",
    commandName: "ajsshow",
    labelKey: "commandBuilder.ajsshow.label",
    descriptionKey: "commandBuilder.ajsshow.description",
    manualUrl: manualUrls.ajsshow,
    target: {
      labelKey: "commandBuilder.common.target",
      value: unit.absolutePath,
    },
    fields: [
      {
        id: "serviceName",
        kind: "text",
        option: "-F",
        usage: "independent",
        labelKey: "commandBuilder.common.serviceName.label",
        descriptionKey: "commandBuilder.common.serviceName.description",
        placeholder: "AJSROOT1",
        defaultValue: "",
      },
      {
        id: "outputMode",
        kind: "select",
        labelKey: "commandBuilder.ajsshow.outputMode.label",
        descriptionKey: "commandBuilder.ajsshow.outputMode.description",
        defaultValue: "standard",
        choices: [
          {
            value: "standard",
            labelKey: "commandBuilder.ajsshow.outputMode.standard",
            tokens: [],
          },
          {
            value: "nextCycleRegistration",
            labelKey: "commandBuilder.ajsshow.outputMode.nextCycleRegistration",
            tokens: ["-s"],
          },
          {
            value: "nextSchedule",
            labelKey: "commandBuilder.ajsshow.outputMode.nextSchedule",
            tokens: ["-p"],
          },
          {
            value: "resultList",
            labelKey: "commandBuilder.ajsshow.outputMode.resultList",
            tokens: ["-l"],
          },
          {
            value: "waitConditions",
            labelKey: "commandBuilder.ajsshow.outputMode.waitConditions",
            tokens: ["-xw"],
          },
          {
            value: "stderrFile",
            labelKey: "commandBuilder.ajsshow.outputMode.stderrFile",
            tokens: ["-r"],
          },
          {
            value: "format",
            labelKey: "commandBuilder.ajsshow.outputMode.format",
            tokens: ["-f"],
            argumentFieldId: "formatIndicator",
          },
          {
            value: "twoByteFormat",
            labelKey: "commandBuilder.ajsshow.outputMode.twoByteFormat",
            tokens: ["-i"],
            argumentFieldId: "twoByteFormatIndicator",
          },
        ],
      },
      {
        id: "formatIndicator",
        kind: "text",
        usage: "argument",
        labelKey: "commandBuilder.ajsshow.formatIndicator.label",
        descriptionKey: "commandBuilder.ajsshow.formatIndicator.description",
        placeholder: "%J",
        defaultValue: "",
      },
      {
        id: "twoByteFormatIndicator",
        kind: "text",
        usage: "argument",
        labelKey: "commandBuilder.ajsshow.twoByteFormatIndicator.label",
        descriptionKey:
          "commandBuilder.ajsshow.twoByteFormatIndicator.description",
        placeholder: "%ab",
        defaultValue: "",
      },
      {
        id: "recursive",
        kind: "checkbox",
        option: "-R",
        labelKey: "commandBuilder.common.recursive.label",
        descriptionKey: "commandBuilder.common.recursive.description",
        defaultValue: true,
      },
      {
        id: "registeredOnly",
        kind: "checkbox",
        option: "-E",
        labelKey: "commandBuilder.ajsshow.registeredOnly.label",
        descriptionKey: "commandBuilder.ajsshow.registeredOnly.description",
        defaultValue: false,
      },
      {
        id: "rootJobnet",
        kind: "checkbox",
        option: "-T",
        labelKey: "commandBuilder.common.rootJobnet.label",
        descriptionKey: "commandBuilder.common.rootJobnet.description",
        defaultValue: false,
      },
      {
        id: "unitType",
        kind: "select",
        labelKey: "commandBuilder.ajsshow.unitType.label",
        descriptionKey: "commandBuilder.ajsshow.unitType.description",
        defaultValue: "all",
        choices: [
          {
            value: "all",
            labelKey: "commandBuilder.common.unitType.all",
            tokens: [],
          },
          {
            value: "jobnet",
            labelKey: "commandBuilder.common.unitType.jobnet",
            tokens: ["-N"],
          },
          {
            value: "job",
            labelKey: "commandBuilder.common.unitType.job",
            tokens: ["-J"],
          },
        ],
      },
      {
        id: "generations",
        kind: "text",
        option: "-g",
        usage: "independent",
        labelKey: "commandBuilder.ajsshow.generations.label",
        descriptionKey: "commandBuilder.ajsshow.generations.description",
        placeholder: "1",
        defaultValue: "",
      },
      {
        id: "userName",
        kind: "text",
        option: "-u",
        usage: "independent",
        labelKey: "commandBuilder.ajsshow.userName.label",
        descriptionKey: "commandBuilder.ajsshow.userName.description",
        placeholder: "jp1admin",
        defaultValue: "",
      },
    ],
  },
  {
    id: "ajsprint",
    commandName: "ajsprint",
    labelKey: "commandBuilder.ajsprint.label",
    descriptionKey: "commandBuilder.ajsprint.description",
    manualUrl: manualUrls.ajsprint,
    target: {
      labelKey: "commandBuilder.common.target",
      value: unit.absolutePath,
    },
    fields: [
      {
        id: "serviceName",
        kind: "text",
        option: "-F",
        usage: "independent",
        labelKey: "commandBuilder.common.serviceName.label",
        descriptionKey: "commandBuilder.common.serviceName.description",
        placeholder: "AJSROOT1",
        defaultValue: "",
      },
      {
        id: "outputMode",
        kind: "select",
        labelKey: "commandBuilder.ajsprint.outputMode.label",
        descriptionKey: "commandBuilder.ajsprint.outputMode.description",
        defaultValue: "definition",
        choices: [
          {
            value: "definition",
            labelKey: "commandBuilder.ajsprint.outputMode.definition",
            tokens: ["-a"],
          },
          {
            value: "calendar",
            labelKey: "commandBuilder.ajsprint.outputMode.calendar",
            tokens: ["-c"],
            argumentFieldId: "calendarDate",
          },
          {
            value: "calendarParameters",
            labelKey: "commandBuilder.ajsprint.outputMode.calendarParameters",
            tokens: ["-d"],
          },
          {
            value: "format",
            labelKey: "commandBuilder.ajsprint.outputMode.format",
            tokens: ["-f"],
            argumentFieldId: "formatIndicator",
          },
          {
            value: "macroVariables",
            labelKey: "commandBuilder.ajsprint.outputMode.macroVariables",
            tokens: ["-v"],
          },
        ],
      },
      {
        id: "calendarDate",
        kind: "text",
        usage: "argument",
        labelKey: "commandBuilder.ajsprint.calendarDate.label",
        descriptionKey: "commandBuilder.ajsprint.calendarDate.description",
        placeholder: "2026/04/23",
        defaultValue: "",
      },
      {
        id: "formatIndicator",
        kind: "text",
        usage: "argument",
        labelKey: "commandBuilder.ajsprint.formatIndicator.label",
        descriptionKey: "commandBuilder.ajsprint.formatIndicator.description",
        placeholder: "%J",
        defaultValue: "",
      },
      {
        id: "sortRelations",
        kind: "select",
        labelKey: "commandBuilder.ajsprint.sortRelations.label",
        descriptionKey: "commandBuilder.ajsprint.sortRelations.description",
        defaultValue: "default",
        choices: [
          {
            value: "default",
            labelKey: "commandBuilder.ajsprint.sortRelations.default",
            tokens: [],
          },
          {
            value: "yes",
            labelKey: "commandBuilder.ajsprint.sortRelations.yes",
            tokens: ["-s", "yes"],
          },
          {
            value: "no",
            labelKey: "commandBuilder.ajsprint.sortRelations.no",
            tokens: ["-s", "no"],
          },
        ],
      },
      {
        id: "unitType",
        kind: "select",
        labelKey: "commandBuilder.ajsprint.unitType.label",
        descriptionKey: "commandBuilder.ajsprint.unitType.description",
        defaultValue: "all",
        choices: [
          {
            value: "all",
            labelKey: "commandBuilder.common.unitType.all",
            tokens: [],
          },
          {
            value: "job",
            labelKey: "commandBuilder.common.unitType.job",
            tokens: ["-J"],
          },
          {
            value: "jobnet",
            labelKey: "commandBuilder.common.unitType.jobnet",
            tokens: ["-N"],
          },
          {
            value: "jobGroup",
            labelKey: "commandBuilder.ajsprint.unitType.jobGroup",
            tokens: ["-G"],
          },
        ],
      },
      {
        id: "recursive",
        kind: "checkbox",
        option: "-R",
        labelKey: "commandBuilder.common.recursive.label",
        descriptionKey: "commandBuilder.common.recursive.description",
        defaultValue: true,
      },
      {
        id: "registrationState",
        kind: "select",
        labelKey: "commandBuilder.ajsprint.registrationState.label",
        descriptionKey: "commandBuilder.ajsprint.registrationState.description",
        defaultValue: "all",
        choices: [
          {
            value: "all",
            labelKey: "commandBuilder.ajsprint.registrationState.all",
            tokens: [],
          },
          {
            value: "unregistered",
            labelKey: "commandBuilder.ajsprint.registrationState.unregistered",
            tokens: ["-L"],
          },
          {
            value: "registered",
            labelKey: "commandBuilder.ajsprint.registrationState.registered",
            tokens: ["-E"],
          },
        ],
      },
      {
        id: "rootJobnet",
        kind: "checkbox",
        option: "-T",
        labelKey: "commandBuilder.common.rootJobnet.label",
        descriptionKey: "commandBuilder.common.rootJobnet.description",
        defaultValue: false,
      },
    ],
  },
];

export const buildAjsCommands = (unit: AjsUnit): UnitDefinitionCommandDto[] => [
  ...buildAjsCommandBuilders(unit).map((builder) => ({
    id: builder.id,
    label: builder.commandName,
    value: buildCommandLine(builder),
  })),
];
