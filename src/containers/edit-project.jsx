import React, { useEffect } from "react";
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
  const [projectName, setProjectName] = React.useState(
    props.projectInfo.project.name
  );
  const [projectDescription, setProjectDescription] = React.useState(
    props.projectInfo.project.description
  );
  const [isPublic, setIsPublic] = React.useState(
    props.projectInfo.project.is_public
  );
  const [adminId, setAdminId] = React.useState(
    props.projectInfo.project.admin_id
  );
  const [team, setTeam] = React.useState(props.projectInfo.project.team_id);

  const { enqueueSnackbar } = useSnackbar();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState(null);
  const [alertTitle, setAlertTitle] = React.useState(null);
  const [alertMsg, setAlertMsg] = React.useState(null);

  // DEBUG_PRINT(props);
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
          {console.error(props)}
          <Description fontSize="inherit" />
        </Button>
        {props.projectInfo.project.admin_id === uId ? (
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
          {props.projectInfo.project.description}
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
            if (projectName !== props.projectInfo.project.name)
              data["name"] = projectName;
            if (projectDescription !== props.projectInfo.project.description)
              data["description"] = projectDescription;
            if (isPublic !== props.projectInfo.project.isPublic)
              data["is_public"] = isPublic;
            httpReq(
              `${config.URL}/api/projects/${props.projectInfo.project.id}`,
              "PUT",
              data,
              token
            )
              .then((res) => {
                res.json().then((r) => {
                  NOTIFY(r.msg, (msg) => {
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
                  disabled={
                    props.projectInfo.project.admin_id !== uId ? true : false
                  }
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
                    disabled={
                      props.projectInfo.project.admin_id !== uId ? true : false
                    }
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
                  disabled={
                    props.projectInfo.project.admin_id !== uId ? true : false
                  }
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
                    disabled={
                      props.projectInfo.project.admin_id !== uId ? true : false
                    }
                    required
                  >
                    {props.projectInfo.team.info !== null &&
                    props.projectInfo.team.members !== null ? (
                      props.projectInfo.team.members.map((value, index) => (
                        <MenuItem key={index} value={value.uid}>
                          {value.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value={props.projectInfo.admin.id}>
                        {props.projectInfo.admin.username}
                      </MenuItem>
                    )}
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
                    value={team}
                    onChange={handleTeamChange}
                    disabled={
                      props.projectInfo.project.admin_id !== uId ? true : false
                    }
                    label="Team"
                    required
                  >
                    {props.teamsInfo.map((value, index) => (
                      <MenuItem key={index} value={value.info.id}>
                        {value.info.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              type="submit"
              color="primary"
              disabled={
                props.projectInfo.project.admin_id !== uId ? true : false
              }
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default EditProjectDialog;
