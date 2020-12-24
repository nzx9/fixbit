import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  makeStyles,
  withStyles,
  Typography,
  IconButton,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import { FiberManualRecord, Cancel } from "@material-ui/icons";
import { useSnackbar } from "notistack";

import { DEBUG_PRINT } from "../components/debugTools";
import { httpReq } from "../components/httpRequest";
import settings from "../components/settings.json";
import { useSelector } from "react-redux";
import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";
import config from "../components/config.json";
import { NOTIFY } from "../components/notify";

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
  // delete when team add
  tag_critical: {
    color: theme.palette.error.dark,
    borderColor: theme.palette.error.dark,
    fontSize: 15,
  },
  tag_high: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    fontSize: 15,
  },
  tag_normal: {
    color: theme.palette.warning.main,
    borderColor: theme.palette.warning.main,
    fontSize: 15,
  },
  tag_low: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    fontSize: 15,
  },
  tag_no: {
    color: theme.palette.text.primary,
    fontSize: 15,
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

  const uId = useSelector(getUId);
  const token = useSelector(getToken);

  const [open, setOpen] = React.useState(false);
  const [teamName, setTeamName] = React.useState(null);
  const [teamDescription, setTeamDescription] = React.useState(null);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState(null);
  const [alertTitle, setAlertTitle] = React.useState(null);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const handleTeamName = (e) => setTeamName(e.target.value);

  const handleTeamDescription = (e) => setTeamDescription(e.target.value);

  return (
    <Dialog
      // onClose={props.handleClose}
      open={props.open}
      maxWidth="sm"
      fullWidth
    >
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
                    anchorOrigin: settings.snackbar.anchorOrigin,
                  });
                  DEBUG_PRINT(r);
                  if (res.status === 201 && r.success === true) props.action();
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
          <Button autoFocus type="submit" color="primary" autoFocus>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TeamDialog;
