import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  makeStyles,
  withStyles,
  Typography,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import { Cancel } from "@material-ui/icons";

import { convertToLocalTime } from "../components/debugTools";
import config from "../components/config.json";
import { getSync } from "../components/httpRequest";
// import {} from "";

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

const TeamDetails = (props) => {
  const classes = useStyles();
  const [leaderData, setLeaderData] = React.useState(null);

  useEffect(() => {
    (async function () {
      const leader = await getSync(
        `${config.URL}/api/users/user/${props?.teamData?.leader_id}`,
        props?.token
      );
      if (leader?.data !== undefined) {
        leader.data.username =
          Number(props?.teamData?.leader_id) === props?.uid
            ? leader?.data?.username + " (Me)"
            : leader?.data?.username;
        setLeaderData(leader?.data);
      }
    })();
  }, []);

  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
      <DialogTitle
        disableTypography
        className={classes.root}
        onClose={props.handleClose}
      >
        Team Details
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <List subheader={<ListSubheader></ListSubheader>}>
              <ListItem>
                <ListItemText
                  primary={"Team ID"}
                  // secondary="Unique identity number"
                />
                <ListItemSecondaryAction>
                  {"#" + props.teamData?.id}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary={"Name"} />
                <ListItemSecondaryAction>
                  {props.teamData?.name}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary={"Leader"} />
                <ListItemSecondaryAction>
                  {leaderData?.username}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={"Description"}
                  secondary={props.teamData?.description}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary={"Status"} />
                <ListItemSecondaryAction>
                  {Boolean(props.teamData?.is_active) === true
                    ? "Active"
                    : "Not Active"}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary={"Member Count"} />
                <ListItemSecondaryAction>
                  {props.memberCount}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={"Date Created"}
                  secondary={convertToLocalTime(
                    props.teamData?.created_at,
                    false
                  )}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={"Last Updated"}
                  secondary={convertToLocalTime(
                    props.teamData?.updated_at,
                    false
                  )}
                />
              </ListItem>
              <Divider />
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <div>&nbsp;</div>
    </Dialog>
  );
};

export default TeamDetails;
