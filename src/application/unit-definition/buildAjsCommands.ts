import { AjsUnit } from "../../domain/models/ajs/AjsDocument";

export type LocalizedTextDto = {
  label: string;
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
  description: string;
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
  description: string;
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
    label: "Command reference",
    labelKey: "commandBuilder.common.commandReference",
    urlByLang: {
      en: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0131.HTM",
      ja: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920/AJSO0131.HTM",
    },
  },
  ajsprint: {
    label: "Command reference",
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
    label: "ajsshow",
    labelKey: "commandBuilder.ajsshow.label",
    description:
      "Show execution status, results, schedules, and related information for the selected unit.",
    descriptionKey: "commandBuilder.ajsshow.description",
    manualUrl: manualUrls.ajsshow,
    target: {
      label: "Target unit",
      labelKey: "commandBuilder.common.target",
      value: unit.absolutePath,
    },
    fields: [
      {
        id: "serviceName",
        kind: "text",
        option: "-F",
        usage: "independent",
        label: "Scheduler service",
        labelKey: "commandBuilder.common.serviceName.label",
        description:
          "Optional scheduler service name. The manual allows 1 to 30 bytes.",
        descriptionKey: "commandBuilder.common.serviceName.description",
        placeholder: "AJSROOT1",
        defaultValue: "",
      },
      {
        id: "outputMode",
        kind: "select",
        label: "Output mode",
        labelKey: "commandBuilder.ajsshow.outputMode.label",
        description:
          "Choose the primary output mode. Leave as standard when you only need the default information.",
        descriptionKey: "commandBuilder.ajsshow.outputMode.description",
        defaultValue: "standard",
        choices: [
          {
            value: "standard",
            label: "Standard output",
            labelKey: "commandBuilder.ajsshow.outputMode.standard",
            tokens: [],
          },
          {
            value: "nextCycleRegistration",
            label: "Next cycle registration (-s)",
            labelKey: "commandBuilder.ajsshow.outputMode.nextCycleRegistration",
            tokens: ["-s"],
          },
          {
            value: "nextSchedule",
            label: "Next execution schedule (-p)",
            labelKey: "commandBuilder.ajsshow.outputMode.nextSchedule",
            tokens: ["-p"],
          },
          {
            value: "resultList",
            label: "Execution results (-l)",
            labelKey: "commandBuilder.ajsshow.outputMode.resultList",
            tokens: ["-l"],
          },
          {
            value: "waitConditions",
            label: "Wait conditions (-xw)",
            labelKey: "commandBuilder.ajsshow.outputMode.waitConditions",
            tokens: ["-xw"],
          },
          {
            value: "stderrFile",
            label: "Standard error output file (-r)",
            labelKey: "commandBuilder.ajsshow.outputMode.stderrFile",
            tokens: ["-r"],
          },
          {
            value: "format",
            label: "Format indicator (-f)",
            labelKey: "commandBuilder.ajsshow.outputMode.format",
            tokens: ["-f"],
            argumentFieldId: "formatIndicator",
          },
          {
            value: "twoByteFormat",
            label: "Two-byte format indicator (-i)",
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
        label: "Format indicator",
        labelKey: "commandBuilder.ajsshow.formatIndicator.label",
        description: "Argument for -f, such as %J or another manual indicator.",
        descriptionKey: "commandBuilder.ajsshow.formatIndicator.description",
        placeholder: "%J",
        defaultValue: "",
      },
      {
        id: "twoByteFormatIndicator",
        kind: "text",
        usage: "argument",
        label: "Two-byte format indicator",
        labelKey: "commandBuilder.ajsshow.twoByteFormatIndicator.label",
        description: "Argument for -i when using two-byte format indicators.",
        descriptionKey:
          "commandBuilder.ajsshow.twoByteFormatIndicator.description",
        placeholder: "%ab",
        defaultValue: "",
      },
      {
        id: "recursive",
        kind: "checkbox",
        option: "-R",
        label: "Include subordinate units",
        labelKey: "commandBuilder.common.recursive.label",
        description:
          "Output information for jobnets or jobs contained in the selected unit.",
        descriptionKey: "commandBuilder.common.recursive.description",
        defaultValue: true,
      },
      {
        id: "registeredOnly",
        kind: "checkbox",
        option: "-E",
        label: "Registered jobnets only",
        labelKey: "commandBuilder.ajsshow.registeredOnly.label",
        description:
          "Limit output to jobnets already registered for execution.",
        descriptionKey: "commandBuilder.ajsshow.registeredOnly.description",
        defaultValue: false,
      },
      {
        id: "rootJobnet",
        kind: "checkbox",
        option: "-T",
        label: "Root jobnet only",
        labelKey: "commandBuilder.common.rootJobnet.label",
        description: "Limit output to the root jobnet.",
        descriptionKey: "commandBuilder.common.rootJobnet.description",
        defaultValue: false,
      },
      {
        id: "unitType",
        kind: "select",
        label: "Unit type filter",
        labelKey: "commandBuilder.ajsshow.unitType.label",
        description: "Optionally limit output to jobnets or jobs.",
        descriptionKey: "commandBuilder.ajsshow.unitType.description",
        defaultValue: "all",
        choices: [
          {
            value: "all",
            label: "All supported unit types",
            labelKey: "commandBuilder.common.unitType.all",
            tokens: [],
          },
          {
            value: "jobnet",
            label: "Jobnets (-N)",
            labelKey: "commandBuilder.common.unitType.jobnet",
            tokens: ["-N"],
          },
          {
            value: "job",
            label: "Jobs (-J)",
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
        label: "Generations",
        labelKey: "commandBuilder.ajsshow.generations.label",
        description:
          "Optional number of generations, or a for all generations.",
        descriptionKey: "commandBuilder.ajsshow.generations.description",
        placeholder: "1",
        defaultValue: "",
      },
      {
        id: "userName",
        kind: "text",
        option: "-u",
        usage: "independent",
        label: "Registered user",
        labelKey: "commandBuilder.ajsshow.userName.label",
        description: "Optional JP1 user name filter.",
        descriptionKey: "commandBuilder.ajsshow.userName.description",
        placeholder: "jp1admin",
        defaultValue: "",
      },
    ],
  },
  {
    id: "ajsprint",
    commandName: "ajsprint",
    label: "ajsprint",
    labelKey: "commandBuilder.ajsprint.label",
    description:
      "Output unit definitions for the selected unit, optionally including subordinate units.",
    descriptionKey: "commandBuilder.ajsprint.description",
    manualUrl: manualUrls.ajsprint,
    target: {
      label: "Target unit",
      labelKey: "commandBuilder.common.target",
      value: unit.absolutePath,
    },
    fields: [
      {
        id: "serviceName",
        kind: "text",
        option: "-F",
        usage: "independent",
        label: "Scheduler service",
        labelKey: "commandBuilder.common.serviceName.label",
        description:
          "Optional scheduler service name. The manual allows 1 to 30 bytes.",
        descriptionKey: "commandBuilder.common.serviceName.description",
        placeholder: "AJSROOT1",
        defaultValue: "",
      },
      {
        id: "outputMode",
        kind: "select",
        label: "Output mode",
        labelKey: "commandBuilder.ajsprint.outputMode.label",
        description:
          "Choose one required output mode from the command reference.",
        descriptionKey: "commandBuilder.ajsprint.outputMode.description",
        defaultValue: "definition",
        choices: [
          {
            value: "definition",
            label: "Definition for ajsdefine (-a)",
            labelKey: "commandBuilder.ajsprint.outputMode.definition",
            tokens: ["-a"],
          },
          {
            value: "calendar",
            label: "Calendar information (-c)",
            labelKey: "commandBuilder.ajsprint.outputMode.calendar",
            tokens: ["-c"],
            argumentFieldId: "calendarDate",
          },
          {
            value: "calendarParameters",
            label: "Calendar parameters (-d)",
            labelKey: "commandBuilder.ajsprint.outputMode.calendarParameters",
            tokens: ["-d"],
          },
          {
            value: "format",
            label: "Format indicator (-f)",
            labelKey: "commandBuilder.ajsprint.outputMode.format",
            tokens: ["-f"],
            argumentFieldId: "formatIndicator",
          },
          {
            value: "macroVariables",
            label: "Macro variable search (-v)",
            labelKey: "commandBuilder.ajsprint.outputMode.macroVariables",
            tokens: ["-v"],
          },
        ],
      },
      {
        id: "calendarDate",
        kind: "text",
        usage: "argument",
        label: "Calendar date",
        labelKey: "commandBuilder.ajsprint.calendarDate.label",
        description:
          "Argument for -c. Use year, year/month, or year/month/day.",
        descriptionKey: "commandBuilder.ajsprint.calendarDate.description",
        placeholder: "2026/04/23",
        defaultValue: "",
      },
      {
        id: "formatIndicator",
        kind: "text",
        usage: "argument",
        label: "Format indicator",
        labelKey: "commandBuilder.ajsprint.formatIndicator.label",
        description: "Argument for -f, such as %J or another manual indicator.",
        descriptionKey: "commandBuilder.ajsprint.formatIndicator.description",
        placeholder: "%J",
        defaultValue: "",
      },
      {
        id: "sortRelations",
        kind: "select",
        label: "Relation line order",
        labelKey: "commandBuilder.ajsprint.sortRelations.label",
        description: "Optionally fix relation line order when using -a or -f.",
        descriptionKey: "commandBuilder.ajsprint.sortRelations.description",
        defaultValue: "default",
        choices: [
          {
            value: "default",
            label: "Environment default",
            labelKey: "commandBuilder.ajsprint.sortRelations.default",
            tokens: [],
          },
          {
            value: "yes",
            label: "Sort relation lines (-s yes)",
            labelKey: "commandBuilder.ajsprint.sortRelations.yes",
            tokens: ["-s", "yes"],
          },
          {
            value: "no",
            label: "Do not sort relation lines (-s no)",
            labelKey: "commandBuilder.ajsprint.sortRelations.no",
            tokens: ["-s", "no"],
          },
        ],
      },
      {
        id: "unitType",
        kind: "select",
        label: "Unit type filter",
        labelKey: "commandBuilder.ajsprint.unitType.label",
        description: "Optionally limit definitions by unit type.",
        descriptionKey: "commandBuilder.ajsprint.unitType.description",
        defaultValue: "all",
        choices: [
          {
            value: "all",
            label: "All supported unit types",
            labelKey: "commandBuilder.common.unitType.all",
            tokens: [],
          },
          {
            value: "job",
            label: "Job definitions (-J)",
            labelKey: "commandBuilder.common.unitType.job",
            tokens: ["-J"],
          },
          {
            value: "jobnet",
            label: "Jobnet definitions (-N)",
            labelKey: "commandBuilder.common.unitType.jobnet",
            tokens: ["-N"],
          },
          {
            value: "jobGroup",
            label: "Job group definitions (-G)",
            labelKey: "commandBuilder.ajsprint.unitType.jobGroup",
            tokens: ["-G"],
          },
        ],
      },
      {
        id: "recursive",
        kind: "checkbox",
        option: "-R",
        label: "Include subordinate units",
        labelKey: "commandBuilder.common.recursive.label",
        description:
          "Output definitions for units contained in the selected unit. The manual recommends avoiding this option with -a when the result will be reused by ajsdefine.",
        descriptionKey: "commandBuilder.common.recursive.description",
        defaultValue: true,
      },
      {
        id: "registrationState",
        kind: "select",
        label: "Registration state",
        labelKey: "commandBuilder.ajsprint.registrationState.label",
        description:
          "Optionally limit definitions to registered or unregistered jobnets.",
        descriptionKey: "commandBuilder.ajsprint.registrationState.description",
        defaultValue: "all",
        choices: [
          {
            value: "all",
            label: "All registration states",
            labelKey: "commandBuilder.ajsprint.registrationState.all",
            tokens: [],
          },
          {
            value: "unregistered",
            label: "Not registered (-L)",
            labelKey: "commandBuilder.ajsprint.registrationState.unregistered",
            tokens: ["-L"],
          },
          {
            value: "registered",
            label: "Registered (-E)",
            labelKey: "commandBuilder.ajsprint.registrationState.registered",
            tokens: ["-E"],
          },
        ],
      },
      {
        id: "rootJobnet",
        kind: "checkbox",
        option: "-T",
        label: "Root jobnet only",
        labelKey: "commandBuilder.common.rootJobnet.label",
        description: "Limit output to the root jobnet.",
        descriptionKey: "commandBuilder.common.rootJobnet.description",
        defaultValue: false,
      },
    ],
  },
];

export const buildAjsCommands = (unit: AjsUnit): UnitDefinitionCommandDto[] => [
  ...buildAjsCommandBuilders(unit).map((builder) => ({
    id: builder.id,
    label: builder.label,
    value: buildCommandLine(builder),
  })),
];
