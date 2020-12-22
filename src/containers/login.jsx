import React, { useCallback } from "react";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Container,
  CssBaseline,
  Backdrop,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { Link, useHistory } from "react-router-dom";
import routes from "../routes/routes.json";
import { httpReq } from "../components/httpRequest";
import { useDispatch } from "react-redux";
import { login } from "../reducers/loginTracker";
import {
  setUId,
  setUserName,
  setFullName,
  setEmail,
} from "../reducers/userDataTracker";
import { setToken } from "../reducers/tokenTracker";
import { DEBUG_PRINT } from "../components/debugTools";
import { NOTIFY, AlertDialog } from "../components/notify";
import settings from "../components/settings.json";
import config from "../components/config.json";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
}));

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [_email, _setEmail] = React.useState(null);
  const [_password, _setPassword] = React.useState(null);
  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState(null);
  const [alertTitle, setAlertTitle] = React.useState(null);
  const [alertMsg, setAlertMsg] = React.useState(null);

  const emailInputHandler = (e) => _setEmail(e.target.value);

  const passwordInputHandler = (e) => _setPassword(e.target.value);

  const handleAlertClose = () => setAlertOpen(false);

  const history = useHistory();
  const goToHome = useCallback(() => history.push(routes.HOME), [history]);

  return (
    <form
      className={classes.root}
      validate="true"
      autoComplete="on"
      onSubmit={(e) => {
        _setOpenBackdrop(true);
        httpReq(`${config.URL}/api/users/login`, "POST", {
          email: _email,
          password: _password,
        })
          .then((res) => {
            DEBUG_PRINT(res);
            res.json().then((r) => {
              NOTIFY(r.msg, (msg) => {
                _setOpenBackdrop(false);
                enqueueSnackbar(msg, {
                  variant: r.type,
                  anchorOrigin: settings.snackbar.anchorOrigin,
                });
                if (res.status === 200 && r.success === true) {
                  dispatch(setUId(r.data.id));
                  dispatch(setUserName(r.data.username));
                  dispatch(setFullName(r.data.fullname));
                  dispatch(setEmail(r.data.email));
                  dispatch(setToken(r.token));
                  localStorage.setItem("token", r.token);
                  goToHome();
                  dispatch(login());
                }
              });
            });
          })
          .catch((err) => {
            DEBUG_PRINT(err);
            _setOpenBackdrop(false);
            setAlertType("error");
            const parsedError = err.toString().split(":");
            if (parsedError.length >= 1) {
              setAlertTitle(parsedError[0].trim());
            } else {
              setAlertTitle("Error");
            }
            if (parsedError.length >= 2) {
              setAlertMsg(parsedError[1].trim());
            } else {
              setAlertMsg("Unknown");
            }
            setAlertOpen(true);
          });
        e.preventDefault();
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Backdrop className={classes.backdrop} open={_openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AlertDialog
          alertOpen={alertOpen}
          title={alertTitle}
          type={alertType}
          msg={alertMsg}
          handleAlertClose={() => handleAlertClose()}
        />
        <Paper className={classes.paper}>
          <h1>Login</h1>
          <TextField
            required
            fullWidth
            type="email"
            variant="outlined"
            label="Email"
            onChange={emailInputHandler}
          />
          <TextField
            required
            fullWidth
            type="password"
            variant="outlined"
            label="Password"
            onChange={passwordInputHandler}
          />
          <Grid container justify="flex-end" spacing={3}>
            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </Grid>
          </Grid>
          <Link to={routes.REGISTER}>Register</Link>
        </Paper>
      </Container>
    </form>
  );
};

export default Login;
