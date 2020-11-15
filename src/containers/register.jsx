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
import { httpPOST } from "../components/httpRequest";
import { Link, useHistory } from "react-router-dom";
import routes from "../routes/routes.json";
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

  const [_firstName, _setFirstName] = React.useState(null);
  const [_lastName, _setLastName] = React.useState(null);
  const [_email, _setEmail] = React.useState(null);
  const [_password, _setPassword] = React.useState(null);
  const [_confirmPassword, _setConfimPassword] = React.useState(null);
  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const firstNameInputHandler = (e) => {
    _setFirstName(e.target.value);
  };
  const lastNameInputHandler = (e) => {
    _setLastName(e.target.value);
  };
  const emailInputHandler = (e) => {
    _setEmail(e.target.value);
  };
  const passwordInputHandler = (e) => {
    _setPassword(e.target.value);
  };
  const confirmPasswordInputHandler = (e) => {
    _setConfimPassword(e.target.value);
  };

  const history = useHistory();
  const goToLogin = useCallback(() => history.push(routes.LOGIN), [history]);

  return (
    <form
      className={classes.root}
      validate
      autoComplete="on"
      onSubmit={(e) => {
        _setOpenBackdrop(true);
        if (_password === _confirmPassword) {
          httpPOST(
            `${window.location.protocol}//${window.location.hostname}/api/users/register.php`,
            {
              firstname: _firstName,
              lastname: _lastName,
              email: _email,
              password: _password,
              c_password: _confirmPassword,
            }
          )
            .then((res) => {
              DEBUG_PRINT(res);
              _setOpenBackdrop(false);
              if (res.success) {
                goToLogin();
                enqueueSnackbar("Registration Success! Please Login.", {
                  variant: "success",
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                  },
                });
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
        } else {
          _setOpenBackdrop(false);
          enqueueSnackbar("Password and Confirm Password not match", {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
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
        <Paper className={classes.paper}>
          <h1>Register</h1>
          <TextField
            required
            fullWidth
            type="text"
            variant="outlined"
            label="First Name"
            onChange={firstNameInputHandler}
          />
          <TextField
            required
            fullWidth
            type="text"
            variant="outlined"
            label="Last Name"
            onChange={lastNameInputHandler}
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
          <Link to={routes.LOGIN}>Login</Link>
        </Paper>
      </Container>
    </form>
  );
};

export default Register;
