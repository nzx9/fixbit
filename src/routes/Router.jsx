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
  getUId,
  setLastLogin,
  setCreatedAt,
  setUpdatedAt,
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
import { DEBUG_PRINT, convertToLocalTime } from "../components/debugTools";
import { useSnackbar } from "notistack";

import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  Button,
  IconButton,
  makeStyles,
} from "@material-ui/core";

import { Cancel, Visibility } from "@material-ui/icons";
import { newComment } from "../reducers/newCommentTracker";
import { snackPosition } from "../components/notify";

const useColors = makeStyles((theme) => ({
  green: {
    backgroundColor: "#4caf50",
  },
  red: {
    color: "#f44336",
  },
}));

export const MAIN_APP = () => {
  const classes = useColors();
  const uid = useSelector(getUId);
  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);
  const dispatch = useDispatch();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  React.useEffect(() => {
    let channel = window.Echo.channel("comment." + uid);
    channel.listen(".comment-created", function (data) {
      if (
        data?.assigneeId === uid &&
        data?.comment?.uId !== undefined &&
        Number(data?.comment?.uId) !== uid &&
        data?.comment?.time !== undefined
      ) {
        dispatch(newComment());
        const onClickDismiss = (key) => () => {
          closeSnackbar(key);
        };

        const action = (key) => (
          <>
            <Button
              size="small"
              className={classes.green}
              style={{ marginRight: 5 }}
              onClick={() => {
                goto(
                  routes.PROJECTS_VIEW_X +
                    data?.pid +
                    routes.ISSUE_VIEW_X +
                    data?.iid
                );
                closeSnackbar(key);
              }}
            >
              <Visibility fontSize="small" style={{ marginRight: 5 }} />
              View
            </Button>
            <IconButton onClick={onClickDismiss(key)} size="small">
              <Cancel className={classes.red} fontSize="small" />
            </IconButton>
          </>
        );
        enqueueSnackbar(
          "@" +
            data?.comment?.username +
            " commented on an issue #(" +
            convertToLocalTime(data?.comment?.time, false).substr(16, 8) +
            ")",
          {
            preventDuplicate: true,
            persist: true,
            anchorOrigin: snackPosition(),
            action,
          }
        );
      }
    });
  }, []);
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

  const goToLogin = useCallback(
    (path) =>
      history.push(`${routes.LOGIN}${path === null ? "" : "?to=" + path}`),
    [history]
  );
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
              dispatch(setLastLogin(r.data.last_login));
              dispatch(setCreatedAt(r.data.created_at));
              dispatch(setUpdatedAt(r.data.updated_at));
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
              if (
                window.location.pathname !== null &&
                window.location.pathname !== routes.LOGIN &&
                window.location.pathname !== routes.REGISTER &&
                window.location.pathname !== routes.HOME
              )
                sessionStorage.setItem("to", window.location.pathname);
              setIsLoaded(true);
              setIsError(true);
            }
          });
        })
        .catch((err) => {
          DEBUG_PRINT(err);
          if (
            window.location.pathname !== null &&
            window.location.pathname !== routes.LOGIN &&
            window.location.pathname !== routes.REGISTER &&
            window.location.pathname !== routes.HOME
          )
            sessionStorage.setItem("to", window.location.pathname);
          setIsLoaded(true);
          setIsError(true);
        });
    } else {
      if (
        window.location.pathname !== null &&
        window.location.pathname !== routes.LOGIN &&
        window.location.pathname !== routes.REGISTER &&
        window.location.pathname !== routes.HOME
      )
        sessionStorage.setItem("to", window.location.pathname);
      setIsLoaded(true);
      setIsError(true);
    }
  }, []);

  if (useSelector(getLoginStatus)) {
    return <MAIN_APP />;
  } else if (isError) {
    goToLogin(sessionStorage.getItem("to"));
    return <LOGIN_ACTIVITY />;
  } else if (!isLoaded) {
    return <ValidateUser />;
  } else {
    goToLogin(sessionStorage.getItem("to"));
    return <LOGIN_ACTIVITY />;
  }
}
