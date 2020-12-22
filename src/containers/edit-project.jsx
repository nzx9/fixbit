import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  IconButton,
  ButtonGroup,
  Popover,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { useSelector } from "react-redux";
import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";
import { httpReq } from "../components/httpRequest";
import config from "../components/config.json";
import settings from "../components/settings.json";
import { NOTIFY } from "../components/notify";
import { useSnackbar } from "notistack";

import {
  Close,
  FiberManualRecord,
  Description,
  Settings,
  Cancel,
} from "@material-ui/icons";
import { DEBUG_PRINT } from "../components/debugTools";

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
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  typography: {
    padding: theme.spacing(2),
  },
  gridContainer: {
    marginBottom: theme.spacing(2),
  },
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
  settingsBtn: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.tonalOffset.light,
    padding: 0,
    margin: 0,
    width: 5,
  },
  descBtn: {
    backgroundColor: theme.palette.info.main,
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

function EditProjectDialog(props) {
  const classes = useStyles();

  const uId = useSelector(getUId);
  const token = useSelector(getToken);

  const [open, setOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState(props.projectInfo.name);
  const [projectDescription, setProjectDescription] = React.useState(
    props.projectInfo.description
  );
  const [isPublic, setIsPublic] = React.useState(props.projectInfo.is_public);
  const [adminId, setAdminId] = React.useState(props.projectInfo.admin_id);
  const [team, setTeam] = React.useState(1);
  const { enqueueSnackbar } = useSnackbar();

  DEBUG_PRINT(props);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDescriptionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDescriptionClose = () => {
    setAnchorEl(null);
  };

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleProjectDescriptionChange = (e) => {
    setProjectDescription(e.target.value);
  };

  const handleIsPublicChange = (e) => {
    setIsPublic(e.target.value);
  };
  const handleAdminChange = (e) => {
    setAdminId(e.target.value);
  };

  const handleTeamChange = (e) => {
    setTeam(e.target.value);
  };
  DEBUG_PRINT(projectName);
  return (
    <div>
      <ButtonGroup
        disableElevation
        variant="contained"
        style={{ marginRight: 0 }}
      >
        <Button
          aria-label="description"
          className={classes.descBtn}
          size="small"
          onClick={handleDescriptionClick}
        >
          <Description fontSize="inherit" />
        </Button>
        {props.admin_id !== uId ? (
          <Button
            aria-label="delete"
            className={classes.settingsBtn}
            size="small"
            onClick={handleClickOpen}
          >
            <Settings fontSize="inherit" />
          </Button>
        ) : null}
      </ButtonGroup>
      <Popover
        id={"description"}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleDescriptionClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography className={classes.typography}>
          {props.projectInfo.description}
        </Typography>
      </Popover>
      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogTitle
          disableTypography
          className={classes.root}
          onClose={handleClose}
        >
          Edit Project
        </DialogTitle>
        <form
          onSubmit={(e) => {
            let data = {};
            if (projectName !== props.projectInfo.name)
              data["name"] = projectName;
            if (projectDescription !== props.projectInfo.description)
              data["description"] = projectDescription;
            if (isPublic !== props.projectInfo.isPublic)
              data["is_public"] = isPublic;
            httpReq(
              `${config.URL}/api/projects/${props.projectInfo.id}`,
              "PUT",
              data,
              token
            )
              .then((res) => {
                DEBUG_PRINT(res);
                res.json().then((r) => {
                  NOTIFY(r.msg, (msg) => {
                    // _setOpenBackdrop(false);
                    enqueueSnackbar(msg, {
                      variant: r.type,
                      anchorOrigin: settings.snackbar.anchorOrigin,
                    });
                    if (res.status === 200 && r.success === true) {
                      props.action();
                    }
                  });
                });
              })
              .catch((err) => console.error(err));
            handleClose();
            e.preventDefault();
          }}
        >
          <DialogContent dividers>
            <Grid container spacing={1} className={classes.gridContainer}>
              <Grid item xs={12} md={9}>
                <TextField
                  id="name-input"
                  label="Name"
                  value={projectName}
                  onChange={handleProjectNameChange}
                  variant="outlined"
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
                    onChange={handleIsPublicChange}
                    label="Access"
                    required
                  >
                    <MenuItem value={true}>Public</MenuItem>
                    <MenuItem value={false}>Private</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container className={classes.gridContainer}>
              <Grid item xs={12}>
                <TextField
                  id="description-input"
                  label="Description"
                  onChange={handleProjectDescriptionChange}
                  value={projectDescription}
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
                    value={adminId}
                    onChange={handleAdminChange}
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
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default EditProjectDialog;
