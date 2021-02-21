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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { Cancel } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { DEBUG_PRINT } from "../components/debugTools";
import { httpReq } from "../components/httpRequest";
import { useSelector } from "react-redux";
import { getToken } from "../reducers/tokenTracker";
import config from "../components/config.json";
import { NOTIFY, snackPosition } from "../components/notify";

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
  gridContainer: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(1),
    },
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

const TeamEdit = (props) => {
  const classes = useStyles();
  const token = useSelector(getToken);

  const [teamName, setTeamName] = React.useState(props.teamName);
  const [teamDescription, setTeamDescription] = React.useState(
    props.teamDescription
  );
  const [isActive, setIsActive] = React.useState(props.teamIsActive);
  const { enqueueSnackbar } = useSnackbar();

  const handleTeamName = (e) => setTeamName(e.target.value);

  const handleTeamDescription = (e) => setTeamDescription(e.target.value);
  const handleIsActive = (e) => setIsActive(e.target.value);

  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
      <DialogTitle
        disableTypography
        className={classes.root}
        onClose={props.handleClose}
      >
        Team Edit
      </DialogTitle>

      <form
        onSubmit={(e) => {
          props.setOpenBackdrop(true);
          let data = {};
          if (teamName !== props.teamName && teamName !== null)
            data["name"] = teamName;
          if (
            teamDescription !== props.teamDescription &&
            teamDescription !== null
          )
            data["description"] = teamDescription;
          if (isActive !== props.is_active && isActive !== null)
            data["is_active"] = isActive;

          httpReq(`${config.URL}/api/teams/${props.tid}`, "PUT", data, token)
            .then((res) => {
              DEBUG_PRINT(res);
              res.json().then((r) => {
                NOTIFY(r.msg, (msg) => {
                  if (msg === null || msg === undefined) msg = r.message;
                  enqueueSnackbar(msg, {
                    variant: r.type,
                    anchorOrigin: snackPosition(),
                  });
                  DEBUG_PRINT(r);
                  if (res.status === 200 && r.success === true) props.action();
                  else console.error(r.msg);
                  props.handleClose();
                  props.setOpenBackdrop(false);
                });
              });
            })
            .catch((err) => {
              console.error(err);
              props.handleClose();
              props.setOpenBackdrop(false);
            });
          e.preventDefault();
        }}
      >
        <DialogContent dividers>
          <Grid container spacing={1} className={classes.gridContainer}>
            <Grid item xs={12} md={9}>
              <TextField
                variant="outlined"
                label="Team Name"
                onChange={handleTeamName}
                value={teamName}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel id="isActive-select">Active</InputLabel>
                <Select
                  labelId="isActive-select"
                  id="isActive-select"
                  onChange={handleIsActive}
                  label="Active"
                  value={isActive}
                  required
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Not Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12}>
              <TextField
                id="description-input"
                label="Description"
                required
                value={teamDescription}
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
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TeamEdit;
