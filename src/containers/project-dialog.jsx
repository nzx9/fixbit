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

import { Cancel } from "@material-ui/icons";
import { useSnackbar } from "notistack";

import { DEBUG_PRINT } from "../components/debugTools";
import { httpReq } from "../components/httpRequest";
import settings from "../components/settings.json";
import config from "../components/config.json";
import { NOTIFY, AlertDialog } from "../components/notify";

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

const ProjectDialog = (props) => {
  const classes = useStyles();

  const [projectName, setProjectName] = React.useState(null);
  const [projectDescription, setProjectDescription] = React.useState(null);
  const [isPublic, setIsPublic] = React.useState(1);
  const [teamId, setTeamId] = React.useState(-1);

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState(null);
  const [alertTitle, setAlertTitle] = React.useState(null);
  const [alertMsg, setAlertMsg] = React.useState(null);

  const handleAlertClose = () => setAlertOpen(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleProjectName = (e) => setProjectName(e.target.value);

  const handleProjectDescription = (e) => setProjectDescription(e.target.value);

  const handleIsPublic = (e) => setIsPublic(e.target.value);

  const handleTeamId = (e) => setTeamId(e.target.value);

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
        New Project
      </DialogTitle>
      <form
        onSubmit={(e) => {
          let data = {
            name: projectName,
            description: projectDescription,
            is_public: isPublic,
          };
          if (teamId !== -1) data["team_id"] = teamId;
          props.handleOpenBackdrop();
          httpReq(`${config.URL}/api/projects`, "POST", data, props.token)
            .then((res) => {
              res.json().then((r) => {
                NOTIFY(r.msg, (msg) => {
                  if (msg === null || msg === undefined) msg = r.message;
                  enqueueSnackbar(msg, {
                    variant: r.type,
                    anchorOrigin: settings.snackbar.anchorOrigin,
                  });
                  if (res.status === 201 && r.success === true) props.action();
                });
              });
              props.handleCloseBackdrop();
            })
            .catch((err) => {
              props.handleClose();
              props.handleCloseBackdrop();
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
          props.handleClose();
          e.preventDefault();
        }}
      >
        <DialogContent dividers>
          <AlertDialog
            alertOpen={alertOpen}
            title={alertTitle}
            type={alertType}
            msg={alertMsg}
            handleAlertClose={() => handleAlertClose()}
          />
          <Grid container spacing={1} className={classes.gridContainer}>
            <Grid item xs={12} md={9}>
              <TextField
                variant="outlined"
                label="Project Name"
                onChange={handleProjectName}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
                required
              >
                <InputLabel id="isOpen-select">Access</InputLabel>
                <Select
                  labelId="access-select"
                  id="access-select"
                  value={isPublic}
                  onChange={handleIsPublic}
                  label="Access"
                  required
                >
                  <MenuItem value={1}>Public</MenuItem>
                  <MenuItem value={0}>Private</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12}>
              <TextField
                id="description-input"
                label="Description"
                onChange={handleProjectDescription}
                multiline
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid container className={classes.gridContainer} spacing={1}>
            <Grid item md={6}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
                required
              >
                <InputLabel id="team-select">Team</InputLabel>
                <Select
                  labelId="team-select"
                  id="team-select"
                  onChange={handleTeamId}
                  value={teamId}
                  label="Team"
                  required
                >
                  {DEBUG_PRINT("team::", teamId)}
                  <MenuItem key={-1} value={-1}>
                    <b>Not Assign</b>
                  </MenuItem>
                  {props.teamsInfo.map((value, index) => (
                    <MenuItem key={index} value={value.info.id}>
                      {value.info.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6}></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus type="submit" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectDialog;
