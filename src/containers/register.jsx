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
import { httpReq } from "../components/httpRequest";
import { Link, useHistory } from "react-router-dom";
import routes from "../routes/routes.json";
import { DEBUG_PRINT } from "../components/debugTools";
import config from "../components/config.json";
import { NOTIFY, AlertDialog, snackPosition } from "../components/notify";

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
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
}));

const Register = () => {
  const classes = useStyles();

  const [_userName, _setUserName] = React.useState(null);
  const [_fullName, _setFullName] = React.useState(null);
  const [_email, _setEmail] = React.useState(null);
  const [_password, _setPassword] = React.useState(null);
  const [_confirmPassword, _setConfimPassword] = React.useState(null);
  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState(null);
  const [alertTitle, setAlertTitle] = React.useState(null);
  const [alertMsg, setAlertMsg] = React.useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const userNameInputHandler = (e) => _setUserName(e.target.value);
  const fullNameInputHandler = (e) => _setFullName(e.target.value);
  const emailInputHandler = (e) => _setEmail(e.target.value);
  const passwordInputHandler = (e) => _setPassword(e.target.value);
  const confirmPasswordInputHandler = (e) => _setConfimPassword(e.target.value);

  const handleAlertClose = () => setAlertOpen(false);

  const history = useHistory();
  const goToLogin = useCallback(
    (path) =>
      history.push(`${routes.LOGIN}${path === null ? "" : "?to=" + path}`),
    [history]
  );

  return (
    <form
      className={classes.root}
      validate
      autoComplete="on"
      onSubmit={(e) => {
        _setOpenBackdrop(true);
        if (_password === _confirmPassword) {
          httpReq(`${config.URL}/api/users/register`, "POST", {
            username: _userName,
            fullname: _fullName,
            email: _email,
            password: _password,
            c_password: _confirmPassword,
          })
            .then((res) => {
              DEBUG_PRINT(res);
              res.json().then((r) => {
                NOTIFY(r.msg, (msg) => {
                  _setOpenBackdrop(false);
                  enqueueSnackbar(msg, {
                    variant: r.type,
                    anchorOrigin: snackPosition(),
                  });
                  if (res.status === 201 && r.success === true) {
                    goToLogin(sessionStorage.getItem("to"));
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
        } else {
          _setOpenBackdrop(false);
          enqueueSnackbar("Password and Confirm Password not match", {
            variant: "error",
            anchorOrigin: snackPosition(),
          });
        }
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
          <h1>Register</h1>
          <TextField
            required
            fullWidth
            type="text"
            variant="outlined"
            label="User Name"
            onChange={userNameInputHandler}
          />
          <TextField
            required
            fullWidth
            type="text"
            variant="outlined"
            label="Full Name"
            onChange={fullNameInputHandler}
          />
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
          <TextField
            required
            fullWidth
            type="password"
            variant="outlined"
            label="Retype Password"
            onChange={confirmPasswordInputHandler}
          />
          <Grid container justify="flex-end" spacing={3}>
            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
            </Grid>
          </Grid>
          <Link
            to={
              sessionStorage.getItem("to") === null
                ? routes.LOGIN
                : routes.LOGIN + "?to=" + sessionStorage.getItem("to")
            }
          >
            Login
          </Link>
        </Paper>
      </Container>
    </form>
  );
};

export default Register;
