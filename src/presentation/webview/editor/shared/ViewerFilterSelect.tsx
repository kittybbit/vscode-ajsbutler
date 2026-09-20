import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader, {
  type ListSubheaderProps,
} from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import {
  semanticDiffExplorerFocusSx,
  semanticDiffExplorerTargetSizePx,
} from "../../shared/muiTheme";

export type ViewerFilterOption = Readonly<{
  value: string;
  label: React.ReactNode;
}>;

type ViewerFilterMenuHeadingProps = ListSubheaderProps;
type ViewerFilterMenuHeadingComponent =
  React.ComponentType<ViewerFilterMenuHeadingProps> & {
    muiSkipListHighlight?: boolean;
  };

const ViewerFilterMenuHeading: ViewerFilterMenuHeadingComponent = (props) => {
  const rest = {
    ...(props as unknown as Record<string, unknown>),
  };
  delete rest.role;
  delete rest["aria-selected"];
  delete rest["data-value"];
  return (
    <ListSubheader
      {...(rest as unknown as ViewerFilterMenuHeadingProps)}
      role="presentation"
    />
  );
};

ViewerFilterMenuHeading.muiSkipListHighlight = true;

export type ViewerFilterSelectProps = Readonly<{
  id: string;
  label: string;
  value: string;
  options: readonly ViewerFilterOption[];
  onChange: (value: string) => void;
  menuHeading?: string;
  triggerRef?: React.RefObject<HTMLDivElement | null>;
}>;

const viewerFilterDisplayProps = (
  id: string,
  label: string,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
): React.HTMLAttributes<HTMLDivElement> & {
  "data-viewer-filter-trigger": string;
} => ({
  "data-viewer-filter-trigger": id,
  "aria-label": label,
  "aria-labelledby": `${id}-label`,
  onMouseDown: (event) => openViewerFilterWithPointer(event, setOpen),
  onClick: () => setOpen(true),
  onKeyDown: (event) => openViewerFilterWithKeyboard(event, setOpen),
});

const openViewerFilterWithPointer = (
  event: React.MouseEvent<HTMLDivElement>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  if (event.button !== 0) return;
  event.preventDefault();
  event.currentTarget.focus();
  setOpen(true);
};

const openViewerFilterWithKeyboard = (
  event: React.KeyboardEvent<HTMLDivElement>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  if (![" ", "ArrowUp", "ArrowDown", "Enter"].includes(event.key)) return;
  event.preventDefault();
  setOpen(true);
};

const assignViewerFilterTrigger = (
  id: string,
  triggerRef: React.RefObject<HTMLDivElement | null> | undefined,
): void => {
  if (!triggerRef || typeof document === "undefined") return;
  triggerRef.current = document.getElementById(id) as HTMLDivElement | null;
};

const clearViewerFilterTrigger = (
  id: string,
  triggerRef: React.RefObject<HTMLDivElement | null> | undefined,
): void => {
  if (triggerRef?.current?.id === id) triggerRef.current = null;
};

const useViewerFilterTrigger = (
  id: string,
  triggerRef: React.RefObject<HTMLDivElement | null> | undefined,
): void => {
  useEffect(() => {
    assignViewerFilterTrigger(id, triggerRef);
    return () => clearViewerFilterTrigger(id, triggerRef);
  }, [id, triggerRef]);
};

const ViewerFilterSelectControl = ({
  id,
  label,
  value,
  options,
  onChange,
  menuHeading,
  open,
  setOpen,
}: Readonly<{
  id: string;
  label: string;
  value: string;
  options: readonly ViewerFilterOption[];
  onChange: (value: string) => void;
  menuHeading: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>): React.ReactElement => {
  const labelId = `${id}-label`;
  return (
    <FormControl sx={{ minWidth: 14 * 16, maxWidth: "100%" }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        value={value}
        label={label}
        autoWidth={false}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputProps={{
          "aria-label": label,
          "aria-labelledby": labelId,
        }}
        SelectDisplayProps={viewerFilterDisplayProps(id, label, setOpen)}
        onChange={(event: SelectChangeEvent<string>) =>
          onChange(event.target.value)
        }
        sx={{
          minWidth: 0,
          maxWidth: "100%",
          ...semanticDiffExplorerFocusSx,
          "& .MuiSelect-select": {
            minHeight: semanticDiffExplorerTargetSizePx,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
          },
        }}
        MenuProps={{
          transitionDuration: 0,
          PaperProps: {
            sx: {
              maxWidth: "calc(100vw - 1rem)",
              "& .MuiMenuItem-root": {
                whiteSpace: "normal",
                overflowWrap: "anywhere",
                minHeight: semanticDiffExplorerTargetSizePx,
              },
              "& .MuiListSubheader-root": {
                whiteSpace: "normal",
                overflowWrap: "anywhere",
              },
            },
          },
        }}
      >
        {viewerFilterMenuChildren(menuHeading, options)}
      </Select>
    </FormControl>
  );
};

const viewerFilterMenuChildren = (
  menuHeading: string,
  options: readonly ViewerFilterOption[],
): React.ReactNode[] => [
  <ViewerFilterMenuHeading
    key="viewer-filter-menu-heading"
    component="li"
    disableSticky
    role="presentation"
    aria-hidden="true"
  >
    {menuHeading}
  </ViewerFilterMenuHeading>,
  ...options.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  )),
];

/** Shared accessible MUI filter control used by the Explorer and Calendar. */
export const ViewerFilterSelect = ({
  id,
  label,
  value,
  options,
  onChange,
  menuHeading = label,
  triggerRef,
}: ViewerFilterSelectProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  useViewerFilterTrigger(id, triggerRef);
  return (
    <ViewerFilterSelectControl
      {...{ id, label, value, options, onChange, menuHeading, open, setOpen }}
    />
  );
};

export default ViewerFilterSelect;
