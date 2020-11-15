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
import { httpPOST } from "../components/httpRequest";
import { useDispatch } from "react-redux";
import { login } from "../reducers/loginTracker";
import {
  setUId,
  setFirstName,
  setLastName,
  setEmail,
} from "../reducers/userDataTracker";
import { DEBUG_PRINT } from "../components/debugTools";

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
  const [_email, _setEmail] = React.useState(null);
  const [_password, _setPassword] = React.useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

  const emailInputHandler = (e) => {
    _setEmail(e.target.value);
  };
  const passwordInputHandler = (e) => {
    _setPassword(e.target.value);
  };

  // const handleBackdrop = () => {
  //   _setOpenBackdrop(!_openBackdrop);
  // };
  const history = useHistory();
  const goToHome = useCallback(() => history.push(routes.HOME), [history]);

  return (
    <form
      className={classes.root}
      validate="true"
      autoComplete="on"
      onSubmit={(e) => {
        _setOpenBackdrop(true);
        httpPOST(
          `${window.location.protocol}//${window.location.hostname}/api/users/login.php`,
          {
            email: _email,
            password: _password,
          }
        )
          .then((res) => {
            DEBUG_PRINT(res);
            _setOpenBackdrop(false);
            if (res.success) {
              enqueueSnackbar("Success", {
                variant: "success",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              });
              dispatch(setUId(res.user_data.uid));
              dispatch(setFirstName(res.user_data.firstname));
              dispatch(setLastName(res.user_data.lastname));
              dispatch(setEmail(res.user_data.email));
              goToHome();
              dispatch(login());
            } else {
              _setOpenBackdrop(false);
              enqueueSnackbar(res.msg, {
                variant: "error",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              });
            }
          })
          .catch((err) => {
            _setOpenBackdrop(false);
            alert(err);
          });
        e.preventDefault();
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Backdrop className={classes.backdrop} open={_openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
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
