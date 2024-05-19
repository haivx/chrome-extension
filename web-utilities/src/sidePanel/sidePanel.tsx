import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto";
import { Box } from "@material-ui/core";

const SidePanel: React.FC<{}> = () => {
  return (
    <Box mx="8px" my="16px">
      THis is side panel testing
      <div>
        <button style={{ margin: "10px auto" }}>Click me</button>
      </div>
    </Box>
  );
};

const appContainer = document.createElement("div");
document.body.appendChild(appContainer);
const root = createRoot(appContainer);
root.render(<SidePanel />);
