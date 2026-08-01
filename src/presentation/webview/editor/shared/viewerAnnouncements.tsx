import React, {
  FC,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import Box from "@mui/material/Box";

export type ViewerAnnouncementPoliteness = "polite" | "assertive";

export type ViewerAnnouncement = {
  eventKey: string;
  message: string;
  politeness: ViewerAnnouncementPoliteness;
  revision: number;
};

export type ViewerAnnouncementRequest = {
  eventKey: string;
  message: string;
  politeness?: ViewerAnnouncementPoliteness;
};

export const applyViewerAnnouncement = (
  previous: ViewerAnnouncement | undefined,
  request: ViewerAnnouncementRequest,
): ViewerAnnouncement | undefined => {
  if (!request.message || previous?.eventKey === request.eventKey) {
    return previous;
  }
  return {
    eventKey: request.eventKey,
    message: request.message,
    politeness: request.politeness ?? "polite",
    revision: (previous?.revision ?? 0) + 1,
  };
};

export const useViewerAnnouncements = () => {
  const [announcement, setAnnouncement] = useState<
    ViewerAnnouncement | undefined
  >();
  const announce = useCallback((request: ViewerAnnouncementRequest) => {
    setAnnouncement((previous) => applyViewerAnnouncement(previous, request));
  }, []);

  return { announcement, announce };
};

const visuallyHiddenSx = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export const ViewerAnnouncementRegion: FC<{
  announcement?: ViewerAnnouncement;
}> = ({ announcement }) => {
  if (!announcement) return null;
  return (
    <Box
      component="div"
      role={announcement.politeness === "assertive" ? "alert" : "status"}
      aria-live={announcement.politeness}
      aria-atomic="true"
      sx={visuallyHiddenSx}
    >
      {announcement.message}
    </Box>
  );
};

export type ViewerAnnouncementHandle = ReturnType<
  typeof useViewerAnnouncements
>;

export type ViewerAnnouncementHostHandle = {
  announce: (request: ViewerAnnouncementRequest) => void;
};

export const ViewerAnnouncementHost = forwardRef<ViewerAnnouncementHostHandle>(
  function ViewerAnnouncementHost(_props, ref) {
    const { announcement, announce } = useViewerAnnouncements();
    useImperativeHandle(ref, () => ({ announce }), [announce]);
    return <ViewerAnnouncementRegion announcement={announcement} />;
  },
);
