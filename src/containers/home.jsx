import React from "react";
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

const settings = require("../components/settings.json");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
  paper2: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.grey[100],
    backgroundColor: theme.palette.grey[900],
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  button: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.text.secondary,
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
  const dispath = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <div>
      <Container component="main" maxWidth="xl">
        <Paper className={classes.paper}>
          <h1>Welcome {username}!</h1>
          <Button
            className={classes.button}
            onClick={() => {
              enqueueSnackbar("Logout", {
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
