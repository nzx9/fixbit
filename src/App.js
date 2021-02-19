import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import Router from "./routes/Router";
import { SnackbarProvider } from "notistack";
import { configuredStore, history } from "./store";
import {
  IconButton,
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

const useStyles = makeStyles((theme) => ({
  red: {
    color: "#f44336",
  },
}));
const App = () => {
  const classes = useStyles();
  window.Pusher = Pusher;

  window.Echo = new Echo({
    broadcaster: process.env.REACT_APP_PUSHER_BROADCASTER,
    key: process.env.REACT_APP_PUSHER_KEY,
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    forceTLS: process.env.REACT_APP_PUSHER_FORCETLS,
  });

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

  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={maxSnacks}
        dense
        preventDuplicate
        ref={notistackRef}
        action={(key) => (
          <IconButton onClick={onClickDismiss(key)} size="small">
            <Cancel className={classes.red} fontSize="small" />
          </IconButton>
        )}
      >
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
