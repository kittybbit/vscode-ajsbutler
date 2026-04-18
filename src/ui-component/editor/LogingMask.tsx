import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";

/**
 * LoadingMask
 */
export const LoadingMask = () => {
  console.log("render LoadingMask.");

  return (
    <>
      <Toolbar />
      <Container
        style={{
          position: "relative",
          height: "calc(100vh - 100px)",
          maxHeight: "calc(100vh - 100px)",
        }}
      >
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: "absolute",
          }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
};
