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

const ProjectDialog = (props) => {
  const classes = useStyles();

  const uId = useSelector(getUId);
  const token = useSelector(getToken);

  const [open, setOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState(null);
  const [projectDescription, setProjectDescription] = React.useState(null);
  const [isPublic, setIsPublic] = React.useState(1);

  const { enqueueSnackbar } = useSnackbar();

  const handleProjectName = (e) => setProjectName(e.target.value);

  const handleProjectDescription = (e) => setProjectDescription(e.target.value);

  const handleIsPublic = (e) => setIsPublic(e.target.value);

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
          props.openBackdrop(true);
          httpReq(
            `${window.location.protocol}//${window.location.hostname}/api/projects/create.php`,
            {
              uid: props.uId,
              token: props.token,
              name: projectName,
              description: projectDescription,
              isPublic: isPublic,
            }
          )
            .then((result) => {
              props.closeBackdrop();
              if (result.success) {
                props.newProjectAddedAction();
                enqueueSnackbar(result.msg, {
                  variant: "success",
                  anchorOrigin: settings.snackbar.anchorOrigin,
                });
              } else {
                enqueueSnackbar(result.msg, {
                  variant: "error",
                  anchorOrigin: settings.snackbar.anchorOrigin,
                });
              }
            })
            .catch((err) => {
              enqueueSnackbar(err, {
                variant: "error",
                anchorOrigin: settings.snackbar.anchorOrigin,
              });
              props.closeBackdrop();
            });
          props.handleClose();
          e.preventDefault();
        }}
      >
        <DialogContent dividers>
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
                <InputLabel id="admin-select">Admin</InputLabel>
                <Select
                  labelId="admin-select"
                  id="admin-select"
                  value={props.admin}
                  onChange={props.handleAdminChange}
                  label="Admin"
                  required
                >
                  <MenuItem value="null">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={2}>Navindu</MenuItem>
                  <MenuItem value={1}>Sandul</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
                  value={props.team}
                  onChange={props.handleTeamChange}
                  label="Team"
                  required
                >
                  <MenuItem value="1">
                    <Grid container>
                      <Grid item xs={9}>
                        None
                      </Grid>
                      <Grid item xs={3}>
                        <FiberManualRecord className={classes.tag_no} />
                      </Grid>
                    </Grid>
                  </MenuItem>
                  <MenuItem value={2}>
                    <Grid container>
                      <Grid item xs={9}>
                        Low
                      </Grid>
                      <Grid item xs={3}>
                        <FiberManualRecord className={classes.tag_low} />
                      </Grid>
                    </Grid>
                  </MenuItem>
                  <MenuItem value={3}>
                    <Grid container>
                      <Grid item xs={9}>
                        Normal
                      </Grid>
                      <Grid item xs={3}>
                        <FiberManualRecord className={classes.tag_normal} />
                      </Grid>
                    </Grid>
                  </MenuItem>
                  <MenuItem value={4}>
                    <Grid container>
                      <Grid item xs={9}>
                        High
                      </Grid>
                      <Grid item xs={3}>
                        <FiberManualRecord className={classes.tag_high} />
                      </Grid>
                    </Grid>
                  </MenuItem>
                  <MenuItem value={5}>
                    <Grid container>
                      <Grid item xs={9}>
                        Critical
                      </Grid>
                      <Grid item xs={3}>
                        <FiberManualRecord className={classes.tag_critical} />
                      </Grid>
                    </Grid>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
