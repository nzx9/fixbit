import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import Router from "./routes/Router";
import { SnackbarProvider } from "notistack";
import { configuredStore, history } from "./store";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const App = () => {
  const store = configuredStore();
  const selected_theme = localStorage.getItem("theme");
  const maxSnacks =
    localStorage.getItem("max_snacks") <= 5
      ? localStorage.getItem("max_snacks")
      : 3;

  const theme = createMuiTheme({
    palette: {
      type: selected_theme === "dark" ? "dark" : "light",
      background: {
        paper: selected_theme === "dark" ? "#31373d" : "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={maxSnacks}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Router />
          </ConnectedRouter>
        </Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
