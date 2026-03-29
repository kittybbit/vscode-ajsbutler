import React, { FC, memo, MouseEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UnitDefinitionDialogDto } from "../../application/unit-definition/buildUnitDefinition";

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
    {dialogData.commands.map(({ id, label, value }) => (
      <CopyableTextField key={id} id={id} label={label} value={value} />
    ))}
  </>
);

export default memo(UnitEntityDialog);
