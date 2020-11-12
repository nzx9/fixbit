import React, { useCallback } from "react";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Container,
  CssBaseline,
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
}));

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [_email, _setEmail] = React.useState(null);
  const [_password, _setPassword] = React.useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const emailInputHandler = (e) => {
    _setEmail(e.target.value);
  };
  const passwordInputHandler = (e) => {
    _setPassword(e.target.value);
  };
  const history = useHistory();
  const goToHome = useCallback(() => history.push(routes.HOME), [history]);

  return (
    <form
      className={classes.root}
      validate="true"
      autoComplete="on"
      onSubmit={(e) => {
        httpPOST("http://localhost/api/users/login.php", {
          email: _email,
          password: _password,
        })
          .then((res) => {
            console.log(res);
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
            alert(err);
          });
        e.preventDefault();
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
