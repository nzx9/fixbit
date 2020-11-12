import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import Routes from "./routes/Routes";
import { SnackbarProvider } from "notistack";
import { configuredStore, history } from "./store";

const App = () => {
  const store = configuredStore();
  return (
    <SnackbarProvider maxSnack={3}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    </SnackbarProvider>
  );
};

export default App;
