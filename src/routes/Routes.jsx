import React, { useCallback } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLoginStatus } from "../reducers/loginTracker";
//Routes
import routes from "./routes.json";
// Containers
import Home from "../containers/home";
import Login from "../containers/login";
import Register from "../containers/register";

export const MAIN_APP = () => {
  return (
    <>
      <Switch>
        <Route path={routes.HOME} component={Home} />
      </Switch>
    </>
  );
};

export const LOGIN_ACTIVITY = () => {
  return (
    <>
      <Switch>
        <Route path={routes.LOGIN} component={Login} />
        <Route path={routes.REGISTER} component={Register} />
      </Switch>
    </>
  );
};

export default function Routes() {
  const history = useHistory();
  const goToLogin = useCallback(() => history.push(routes.LOGIN), [history]);
  if (useSelector(getLoginStatus)) {
    return <MAIN_APP />;
  }
  goToLogin();
  return <LOGIN_ACTIVITY />;
}
