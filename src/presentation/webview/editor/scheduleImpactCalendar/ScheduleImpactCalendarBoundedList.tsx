import React from "react";
import {
  BoundedListContent,
  useBoundedListFocus,
} from "./scheduleImpactCalendarBoundedListHelpers";

export const ScheduleImpactCalendarBoundedList = ({
  items,
  ariaLabel,
}: Readonly<{
  items: readonly React.ReactElement[];
  ariaLabel: string;
}>): React.ReactElement => {
  const focusModel = useBoundedListFocus(items);
  return (
    <BoundedListContent
      ariaLabel={ariaLabel}
      items={items}
      focusModel={focusModel}
    />
  );
};
