import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import Router from "./routes/Router";
import { SnackbarProvider } from "notistack";
import { configuredStore, history } from "./store";

const App = () => {
  const store = configuredStore();
  return (
    <SnackbarProvider maxSnack={3}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Router />
        </ConnectedRouter>
      </Provider>
    </SnackbarProvider>
  );
};

export default App;
