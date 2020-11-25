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

import {
  Close,
  FiberManualRecord,
  ArrowDownward,
  Settings,
} from "@material-ui/icons";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function EditProjectDialog({ project_description }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [access, setAccess] = React.useState(2);
  const [admin, setAdmin] = React.useState(null);
  const [team, setTeam] = React.useState(1);

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

  const handleAccessChange = (e) => {
    setAccess(e.target.value);
  };
  const handleAdminChange = (e) => {
    setAdmin(e.target.value);
  };

  const handleTeamChange = (e) => {
    setTeam(e.target.value);
  };

  return (
    <div>
      <ButtonGroup disableElevation variant="contained">
        <IconButton
          aria-label="description"
          className={classes.margin}
          size="small"
          onClick={handleDescriptionClick}
        >
          <ArrowDownward fontSize="inherit" />
        </IconButton>
        <IconButton
          aria-label="delete"
          className={classes.margin}
          size="small"
          onClick={handleClickOpen}
        >
          <Settings fontSize="inherit" />
        </IconButton>
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
          {project_description}
        </Typography>
      </Popover>
      <Dialog
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          disableTypography
          className={classes.root}
          onClose={handleClose}
        >
          Project Settings
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1} className={classes.gridContainer}>
            <Grid item xs={12} md={9}>
              <TextField
                variant="outlined"
                label="Project Name"
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
                  value={access}
                  onChange={handleAccessChange}
                  label="Access"
                  required
                >
                  <MenuItem value={2}>Public</MenuItem>
                  <MenuItem value={1}>Private</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12}>
              <TextField
                id="description-input"
                label="Description"
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
                  value={admin}
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
                  value={team}
                  onChange={handleTeamChange}
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
          <Button autoFocus onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditProjectDialog;
