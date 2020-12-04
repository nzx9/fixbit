import React, { useCallback } from "react";
import {
  getUId,
  getUserName,
  getFullName,
  getEmail,
} from "../reducers/userDataTracker";
import { Button, Container, Paper, makeStyles, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducers/loginTracker";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import routes from "../routes/routes.json";

const settings = require("../components/settings.json");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(0),
    width: "100%",
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper2: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.grey[100],
    backgroundColor: theme.palette.grey[900],
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  button: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  },
}));

const Home = () => {
  const uid = useSelector(getUId);
  const username = useSelector(getUserName);
  const fullname = useSelector(getFullName);
  const email = useSelector(getEmail);

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const dispath = useDispatch();
  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  return (
    <div>
      <Container component="main" maxWidth="xl">
        <Paper className={classes.paper}>
          <h1>Welcome {username}!</h1>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginBottom: 10 }}
            onClick={() => goto(routes.PROFILE)}
          >
            Profile
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginBottom: 10 }}
            onClick={() => goto(routes.PROJECTS)}
          >
            Projects
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              enqueueSnackbar("Logged out", {
                variant: "warning",
                anchorOrigin: settings.snackbar.anchorOrigin,
              });
              dispath(logout());
            }}
            variant="contained"
          >
            logout
          </Button>
          <Paper className={classes.paper2}>
            <Grid container>User Id: {uid}</Grid>
            <Grid container>User Name: {username}</Grid>
            <Grid container>Full Name: {fullname}</Grid>
            <Grid container>Email : {email}</Grid>
          </Paper>
          <Grid container justify="flex-end">
            <code>{process.env.NODE_ENV} build</code>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default Home;
