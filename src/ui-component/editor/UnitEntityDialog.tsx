import React, { FC, memo, MouseEvent, useMemo, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { LocaleKeyType, localeMap } from "../../domain/services/i18n/nls";
import {
  buildCommandLine,
  CommandBuilderValues,
  UnitDefinitionCommandBuilderDto,
  UnitDefinitionCommandBuilderFieldDto,
} from "../../application/unit-definition/buildAjsCommands";
import {
  UnitDefinitionCommandDto,
  UnitDefinitionDialogDto,
} from "../../application/unit-definition/buildUnitDefinition";
import { useMyAppContext } from "./MyContexts";

type UnitEntityDialogProps = {
  dialogData: UnitDefinitionDialogDto | undefined;
  onClose: VoidFunction;
};

const useCopyHandler = () => {
  const [tooltipMsg, setTooltipMsg] = useState<string>("");

  const handleCopy = (event: MouseEvent<HTMLDivElement>) => {
    const text = event.currentTarget.textContent;
    if (text) {
      navigator.clipboard.writeText(text);
      setTooltipMsg("Copied");
    }
  };

  const handleMouseEnter = () => setTooltipMsg("Click to copy");

  return { tooltipMsg, handleCopy, handleMouseEnter };
};

type CopyableTextFieldProps = {
  id: string;
  label?: string;
  value: string;
};

const CopyableTextField: FC<CopyableTextFieldProps> = ({
  id,
  label,
  value,
}) => {
  const { tooltipMsg, handleCopy, handleMouseEnter } = useCopyHandler();

  return (
    <Tooltip placement="top" title={tooltipMsg}>
      <TextField
        id={id}
        label={label}
        multiline
        variant="outlined"
        fullWidth
        value={value}
        onClick={handleCopy}
        onMouseEnter={handleMouseEnter}
        sx={{ marginBottom: "1em" }}
      />
    </Tooltip>
  );
};

const UnitEntityDialog: FC<UnitEntityDialogProps> = ({
  dialogData,
  onClose,
}) => {
  if (!dialogData) return null;

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog scroll="paper" open={true} onClose={onClose} fullWidth>
      <DialogTitle sx={{ paddingBottom: "0em" }}>
        <Stack direction="row" justifyContent="space-between">
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Raw data" />
            <Tab label="Command" />
          </Tabs>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography variant="caption">{dialogData.absolutePath}</Typography>
      </DialogTitle>
      <TabPanel value={tabIndex} index={0}>
        <Tab1 dialogData={dialogData} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Tab2 dialogData={dialogData} />
      </TabPanel>
    </Dialog>
  );
};

type TabPanelProps = {
  value: number;
  index: number;
  children: React.ReactNode;
};

const TabPanel: FC<TabPanelProps> = ({ value, index, children }) => {
  return (
    <DialogContent
      sx={{ display: value === index ? "block" : "none" }}
      dividers
    >
      {children}
    </DialogContent>
  );
};

const Tab1: FC<{ dialogData: UnitDefinitionDialogDto }> = ({ dialogData }) => (
  <CopyableTextField id="rawdata" value={dialogData.rawData} />
);

const Tab2: FC<{ dialogData: UnitDefinitionDialogDto }> = ({ dialogData }) => (
  <>
    {dialogData.commandBuilders.length > 0 ? (
      <CommandBuilder builders={dialogData.commandBuilders} />
    ) : (
      <StaticCommands commands={dialogData.commands} />
    )}
  </>
);

const StaticCommands: FC<{ commands: UnitDefinitionCommandDto[] }> = ({
  commands,
}) => (
  <>
    {commands.map(({ id, label, value }) => (
      <CopyableTextField key={id} id={id} label={label} value={value} />
    ))}
  </>
);

const buildDefaultValues = (
  builder: UnitDefinitionCommandBuilderDto,
): CommandBuilderValues =>
  Object.fromEntries(
    builder.fields.map((field) => [field.id, field.defaultValue]),
  );

const CommandBuilder: FC<{
  builders: UnitDefinitionCommandBuilderDto[];
}> = ({ builders }) => {
  const { lang = "en" } = useMyAppContext();
  const [builderId, setBuilderId] = useState(builders[0]?.id ?? "");
  const [valuesByBuilder, setValuesByBuilder] = useState<
    Record<string, CommandBuilderValues>
  >(() =>
    Object.fromEntries(
      builders.map((builder) => [builder.id, buildDefaultValues(builder)]),
    ),
  );

  const builder = builders.find(({ id }) => id === builderId) ?? builders[0];
  const values = valuesByBuilder[builder.id] ?? buildDefaultValues(builder);
  const commandLine = useMemo(
    () => buildCommandLine(builder, values),
    [builder, values],
  );
  const manualUrl =
    builder.manualUrl.urlByLang[lang === "ja" ? "ja" : "en"] ??
    builder.manualUrl.urlByLang.en;
  const localize = (key: string): string =>
    localeMap(key as LocaleKeyType, lang);

  const updateValue = (fieldId: string, value: string | boolean) => {
    setValuesByBuilder((current) => ({
      ...current,
      [builder.id]: {
        ...values,
        [fieldId]: value,
      },
    }));
  };

  return (
    <Stack spacing={2}>
      <TextField
        select
        fullWidth
        size="small"
        label={localize("commandBuilder.common.command")}
        value={builder.id}
        onChange={(event) => setBuilderId(event.target.value)}
      >
        {builders.map((candidate) => (
          <MenuItem key={candidate.id} value={candidate.id}>
            {localize(candidate.labelKey)}
          </MenuItem>
        ))}
      </TextField>
      <Stack spacing={0.5}>
        <Typography variant="body2">
          {localize(builder.descriptionKey)}
        </Typography>
        <Link href={manualUrl} target="_blank" rel="noreferrer">
          {localize(builder.manualUrl.labelKey)}
        </Link>
      </Stack>
      <Stack spacing={1.5}>
        {builder.fields.map((field) => (
          <CommandBuilderField
            key={field.id}
            field={field}
            value={values[field.id] ?? field.defaultValue}
            onChange={(value) => updateValue(field.id, value)}
            localize={localize}
          />
        ))}
      </Stack>
      <CopyableTextField
        id={`${builder.id}-generated-command`}
        label={localize("commandBuilder.common.generatedCommand")}
        value={commandLine}
      />
    </Stack>
  );
};

const CommandBuilderField: FC<{
  field: UnitDefinitionCommandBuilderFieldDto;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  localize: (key: string) => string;
}> = ({ field, value, onChange, localize }) => {
  if (field.kind === "checkbox") {
    return (
      <Stack spacing={0}>
        <FormControlLabel
          control={
            <Checkbox
              checked={value === true}
              onChange={(event) => onChange(event.target.checked)}
            />
          }
          label={localize(field.labelKey)}
        />
        <Typography variant="caption" color="text.secondary">
          {localize(field.descriptionKey)}
        </Typography>
      </Stack>
    );
  }

  if (field.kind === "select") {
    return (
      <TextField
        select
        fullWidth
        size="small"
        label={localize(field.labelKey)}
        value={typeof value === "string" ? value : field.defaultValue}
        helperText={localize(field.descriptionKey)}
        onChange={(event) => onChange(event.target.value)}
      >
        {field.choices.map((choice) => (
          <MenuItem key={choice.value} value={choice.value}>
            {localize(choice.labelKey)}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <TextField
      fullWidth
      size="small"
      label={localize(field.labelKey)}
      value={typeof value === "string" ? value : field.defaultValue}
      placeholder={field.placeholder}
      helperText={localize(field.descriptionKey)}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default memo(UnitEntityDialog);
