import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

ReactDOM.render(
  <StrictMode>
    <ColorModeScript />

    <ChakraProvider theme={theme}>
      <ColorModeSwitcher />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById("root")
);
