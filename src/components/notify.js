import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { Cancel, CheckCircle, Help } from "@material-ui/icons";

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

export const NOTIFY = (msg, callback) => {
  if (typeof msg === "object") {
    Object.keys(msg).forEach((val) => callback(msg[val]));
  } else {
    callback(msg);
  }
};
