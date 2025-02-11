import React from "react";
import { Backdrop, CircularProgress, Container, Toolbar } from "@mui/material";

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
