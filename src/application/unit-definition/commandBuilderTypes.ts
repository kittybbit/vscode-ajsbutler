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
