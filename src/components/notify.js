import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  TextField,
  Box,
} from "@material-ui/core";
import { Cancel, CheckCircle, Help } from "@material-ui/icons";
import { httpReq } from "./httpRequest";
import config from "../components/config.json";

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

export function AlertDialog(props) {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={props.alertOpen}
        onClose={props.handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container>
            <Grid item style={{ marginRight: 5 }}>
              {props.type === "error" ? (
                <Cancel className={classes.error} fontSize="large" />
              ) : props.type === "success" ? (
                <CheckCircle className={classes.success} fontSize="large" />
              ) : (
                <Help className={classes.warning} fontSize="large" />
              )}
            </Grid>
            <Grid item>{props.title}</Grid>
          </Grid>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleAlertClose}
            className={
              props.type === "success"
                ? classes.success
                : props.type === "error"
                ? classes.error
                : classes.warning
            }
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export function AlertDialogConfirmation(props) {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={props.alertOpen}
        onClose={props.handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container>
            <Grid item style={{ marginRight: 5 }}>
              {props.type === "error" ? (
                <Cancel className={classes.error} fontSize="large" />
              ) : props.type === "success" ? (
                <CheckCircle className={classes.success} fontSize="large" />
              ) : (
                <Help className={classes.warning} fontSize="large" />
              )}
            </Grid>
            <Grid item>{props.title}</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.rejectCallback();
            }}
            className={
              props.type === "success"
                ? classes.success
                : props.type === "error"
                ? classes.error
                : classes.warning
            }
          >
            No
          </Button>
          <Button
            onClick={() => {
              props.resolveCallback();
            }}
            className={
              props.type === "success"
                ? classes.success
                : props.type === "error"
                ? classes.error
                : classes.warning
            }
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export function NewMemberAddAlert({
  alertOpen,
  handleAlertClose,
  type,
  title,
  msg,
  resolveCallback,
  rejectCallback,
  token,
}) {
  const classes = useStyles();
  const [userId, setUserId] = React.useState(0);
  const [userData, setUserData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const handleUserIdChange = (e) => {
    setUserId(parseInt(e.target.value));
  };

  useEffect(() => {
    setError(null);
    setIsLoaded(false);
    if (userId > 0) {
      httpReq(`${config.URL}/api/users/user/${userId}`, "GET", null, token)
        .then((res) => {
          res.json().then((r) => {
            setIsLoaded(true);
            if (res.status === 200 && r.success === true) {
              setUserData(r.data);
            } else {
              setError(r.msg);
              setUserData(null);
            }
          });
        })
        .catch((err) => {
          setIsLoaded(true);
          setError(err.message);
          setUserData(null);
        });
    } else {
      setError("Invalid user Id");
    }
  }, [userId]);
  return (
    <div>
      <Dialog
        open={alertOpen}
        onClose={handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container>
            <Grid item style={{ marginRight: 5 }}></Grid>
            <Grid item>
              <b>{title.toUpperCase()}</b>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msg}
          </DialogContentText>
          <TextField
            type="number"
            value={userId}
            variant="outlined"
            fullWidth
            onChange={handleUserIdChange}
          />
          <Box>
            <pre>
              {error ? (
                <p>
                  <b>error : </b>
                  <span className={classes.error}>{error}</span>
                </p>
              ) : !isLoaded ? (
                <p>
                  <b>Please wait...</b>
                </p>
              ) : (
                <div>
                  user id&nbsp;&nbsp;: {userData?.id}
                  <br />
                  username&nbsp;: {userData?.username}
                  <br />
                  fullname&nbsp;: {userData?.fullname}
                  <br />
                  email&nbsp;&nbsp;&nbsp;&nbsp;: {userData?.email}
                </div>
              )}
            </pre>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              rejectCallback();
            }}
            className={classes.error}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              resolveCallback(userData);
            }}
            className={classes.success}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export const NOTIFY = (msg, callback) => {
  if (typeof msg === "object") {
    Object.keys(msg).forEach((val) => callback(msg[val]));
  } else {
    callback(msg);
  }
};
