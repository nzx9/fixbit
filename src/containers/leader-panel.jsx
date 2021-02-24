import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  withStyles,
  Typography,
  IconButton,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { Cancel } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { DEBUG_PRINT } from "../components/debugTools";
import { httpReq } from "../components/httpRequest";
import { useSelector } from "react-redux";
import { getToken } from "../reducers/tokenTracker";
import config from "../components/config.json";
import {
  NOTIFY,
  AlertDialogConfirmation,
  snackPosition,
} from "../components/notify";

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

const LeaderPanel = (props) => {
  const classes = useStyles();
  const token = useSelector(getToken);

  const [leader, setLeader] = React.useState(props.leaderId);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleLeader = (e) => setLeader(e.target.value);

  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
      <DialogTitle
        disableTypography
        className={classes.root}
        onClose={() => {
          props.handleClose();
          setLeader(props.leaderId);
        }}
      >
        Leader Panel
      </DialogTitle>

      <form
        onSubmit={(e) => {
          if (leader !== props.leaderId && leader !== null) {
            setAlertOpen(true);
          } else {
            props.handleClose();
          }
          e.preventDefault();
        }}
      >
        <DialogContent dividers>
          <List>
            <ListItem>
              <ListItemText
                primary="Transfer Leadership"
                secondary="Assign someone else as the team leader"
              />
              <ListItemSecondaryAction>
                <Select
                  labelId="leader-select"
                  id="leader-select"
                  onChange={handleLeader}
                  value={leader}
                  variant="outlined"
                  required
                >
                  {props.memberData.map((member) => (
                    <MenuItem value={member.info.id}>
                      {member.info.username}
                    </MenuItem>
                  ))}
                </Select>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button autoFocus type="submit" color="inherit" variant="outlined">
            Save
          </Button>
        </DialogActions>
      </form>
      <AlertDialogConfirmation
        alertOpen={alertOpen}
        title={`Transfer Leadership?`}
        type="error"
        msg={`You are about to transfer leadership. 
                After transfering leadership, you lost all of your leader privilagers of this team.`}
        resolveCallback={() => {
          props.setOpenBackdrop(true);
          setAlertOpen(false);
          if (leader !== props.leaderId && leader !== null) {
            httpReq(
              `${config.URL}/api/teams/${props.tid}`,
              "PUT",
              { leader_id: leader },
              token
            )
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
                    if (res.status === 200 && r.success === true)
                      props.action();
                    else console.error(r.msg);
                    props.setOpenBackdrop(false);
                    props.handleClose();
                  });
                });
              })
              .catch((err) => {
                console.error(err);
                props.handleClose();
                props.setOpenBackdrop(false);
              });
          }
        }}
        rejectCallback={() => {
          props.setOpenBackdrop(false);
          setAlertOpen(false);
        }}
      />
    </Dialog>
  );
};

export default LeaderPanel;
