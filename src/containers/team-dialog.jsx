import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  makeStyles,
  withStyles,
  Typography,
  IconButton,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { Cancel } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { DEBUG_PRINT } from "../components/debugTools";
import { httpReq } from "../components/httpRequest";
import { useSelector } from "react-redux";
import { getToken } from "../reducers/tokenTracker";
import config from "../components/config.json";
import { NOTIFY, AlertDialog, snackPosition } from "../components/notify";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.error.main,
  },
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  gridContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Cancel />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const TeamDialog = (props) => {
  const classes = useStyles();

  const token = useSelector(getToken);

  const [teamName, setTeamName] = React.useState(null);
  const [teamDescription, setTeamDescription] = React.useState(null);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState(null);
  const [alertTitle, setAlertTitle] = React.useState(null);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const handleTeamName = (e) => setTeamName(e.target.value);

  const handleTeamDescription = (e) => setTeamDescription(e.target.value);

  return (
    <div>
      <AlertDialog
        alertOpen={alertOpen}
        title={alertTitle}
        type={alertType}
        msg={alertMsg}
        handleAlertClose={() => setAlertOpen(false)}
      />
      <Dialog open={props.open} maxWidth="sm" fullWidth>
        <DialogTitle
          disableTypography
          className={classes.root}
          onClose={props.handleClose}
        >
          New Team
        </DialogTitle>
        <form
          onSubmit={(e) => {
            props.openBackdrop();
            httpReq(
              `${config.URL}/api/teams`,
              "POST",
              {
                name: teamName,
                description: teamDescription,
              },
              token
            )
              .then((res) => {
                setIsLoaded(true);
                DEBUG_PRINT(res);
                res.json().then((r) => {
                  NOTIFY(r.msg, (msg) => {
                    props.closeBackdrop();
                    if (msg === null || msg === undefined) msg = r.message;
                    enqueueSnackbar(msg, {
                      variant: r.type,
                      anchorOrigin: snackPosition(),
                    });
                    DEBUG_PRINT(r);
                    if (res.status === 201 && r.success === true)
                      props.action();
                    else setError(r.msg);
                  });
                });
              })
              .catch((err) => {
                setIsLoaded(true);
                setAlertType("error");
                props.handleCloseBackdrop();
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
                setError(err);
              });
            e.preventDefault();
          }}
        >
          <DialogContent dividers>
            <Grid container spacing={1} className={classes.gridContainer}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Team Name"
                  onChange={handleTeamName}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container className={classes.gridContainer}>
              <Grid item xs={12}>
                <TextField
                  id="description-input"
                  label="Description"
                  required
                  onChange={handleTeamDescription}
                  rows={4}
                  multiline
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button autoFocus type="submit" color="inherit" variant="outlined">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default TeamDialog;
