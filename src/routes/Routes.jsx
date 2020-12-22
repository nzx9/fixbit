import React, { useCallback } from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getLoginStatus, login } from "../reducers/loginTracker";
import {
  setUId,
  setUserName,
  setFullName,
  setEmail,
} from "../reducers/userDataTracker";
import { setToken } from "../reducers/tokenTracker";
//Routes
import routes from "./routes.json";
// Containers
import Home from "../containers/home";
import Login from "../containers/login";
import Register from "../containers/register";
import Profile from "../containers/profile";
import SideDrawer from "../containers/drawer";
import ViewIssue from "../containers/view-issue";
import Projects from "../containers/projects";
import ViewProject from "../containers/view-project";
import NotFound from "../containers/not-found";

import { httpReq } from "../components/httpRequest";
import config from "../components/config.json";
import { DEBUG_PRINT } from "../components/debugTools";

import {
  Backdrop,
  CircularProgress,
  Typography,
  makeStyles,
  Box,
} from "@material-ui/core";

export const MAIN_APP = () => {
  return (
    <>
      <SideDrawer>
        <Switch>
          <Route exact path={routes.ISSUE_VIEW} component={ViewIssue} />
          <Route exact path={routes.PROJECTS_VIEW} component={ViewProject} />
          <Route exact path={routes.PROJECTS} component={Projects} />
          <Route exact path={routes.PROFILE} component={Profile} />
          <Route exact path={routes.HOME} component={Home} />
          <Route path="/404" component={NotFound} />
          <Redirect to="/404" />
        </Switch>
      </SideDrawer>
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

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
}));
const ValidateUser = (props) => {
  const classes = useStyles();
  return (
    <div>
      <Backdrop className={classes.backdrop} open={true}>
        <Box position="relative" display="inline-flex">
          <CircularProgress size={130} />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6" component="label" color="textSecondary">
              Validating
            </Typography>
          </Box>
        </Box>
      </Backdrop>
    </div>
  );
};

export default function Routes() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const goToLogin = useCallback(() => history.push(routes.LOGIN), [history]);
  const goToHome = useCallback(() => history.push(routes.HOME), [history]);
  const token = localStorage.getItem("token");
  if (token !== null) {
    httpReq(`${config.URL}/api/users/user`, "GET", null, token)
      .then((res) => {
        DEBUG_PRINT(res);
        res.json().then((r) => {
          if (res.status === 200 && r.success === true) {
            dispatch(setUId(r.data.id));
            dispatch(setUserName(r.data.username));
            dispatch(setFullName(r.data.fullname));
            dispatch(setEmail(r.data.email));
            dispatch(setToken(token));
            dispatch(login());
            setIsLoaded(true);
          } else {
            localStorage.setItem("token", null);
            setIsLoaded(true);
          }
        });
      })
      .catch((err) => {
        DEBUG_PRINT(err);
        setIsLoaded(true);
      });
  }
  if (useSelector(getLoginStatus) && isLoaded) {
    return <MAIN_APP />;
  } else if (!isLoaded) {
    return <ValidateUser />;
  } else {
    goToLogin();
    return <LOGIN_ACTIVITY />;
  }
}
