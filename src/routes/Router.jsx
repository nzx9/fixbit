import React, { useCallback, useEffect } from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getLoginStatus, login } from "../reducers/loginTracker";
import {
  setUId,
  setUserName,
  setFullName,
  setEmail,
  setSocial,
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
import Teams from "../containers/teams";
import ViewTeam from "../containers/view-team";
import Settings from "../containers/settings";

import { httpReq } from "../components/httpRequest";
import config from "../components/config.json";
import { DEBUG_PRINT } from "../components/debugTools";
import { useSnackbar } from "notistack";
import settings from "../components/settings.json";

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
          <Route exact path={routes.TEAMS_VIEW} component={ViewTeam} />
          <Route exact path={routes.TEAMS} component={Teams} />
          <Route exact path={routes.SETTINGS} component={Settings} />
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
        <Route exact path={routes.LOGIN} component={Login} />
        <Route exact path={routes.REGISTER} component={Register} />
        <Route path="/404" component={NotFound} />
        <Redirect to={routes.LOGIN} />
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

export default function Router() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const goToLogin = useCallback(() => history.push(routes.LOGIN), [history]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token !== null) {
      httpReq(`${config.URL}/api/users/user`, "GET", null, token)
        .then((res) => {
          DEBUG_PRINT(res);
          res.json().then((r) => {
            DEBUG_PRINT(token);
            DEBUG_PRINT(r);
            if (res.status === 200 && r.success === true) {
              dispatch(setToken(token));
              dispatch(setUId(r.data.id));
              dispatch(setUserName(r.data.username));
              dispatch(setFullName(r.data.fullname));
              dispatch(setEmail(r.data.email));
              dispatch(
                setSocial({
                  twitter: r.data.twitter,
                  linkedIn: r.data.linkedIn,
                  github: r.data.github,
                })
              );
              dispatch(login());
              setIsLoaded(true);
            } else {
              localStorage.setItem("token", null);
              setIsLoaded(true);
              setIsError(true);
            }
          });
        })
        .catch((err) => {
          DEBUG_PRINT(err);
          setIsLoaded(true);
          setIsError(true);
          enqueueSnackbar(err.message(), {
            variant: "error",
            anchorOrigin: settings.snackbar.anchorOrigin,
          });
        });
    } else {
      setIsLoaded(true);
      setIsError(true);
    }
  }, []);

  if (useSelector(getLoginStatus)) {
    return <MAIN_APP />;
  } else if (isError) {
    goToLogin();
    return <LOGIN_ACTIVITY />;
  } else if (!isLoaded) {
    return <ValidateUser />;
  } else {
    goToLogin();
    return <LOGIN_ACTIVITY />;
  }
}
