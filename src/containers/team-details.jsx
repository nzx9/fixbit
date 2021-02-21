import React from "react";
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
                  primary={"TeamId"}
                  secondary="Unique identity number"
                />
                <ListItemSecondaryAction>
                  {"#" + props.teamData?.id}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={"Name"}
                  secondary={props.teamData?.name}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={"Description"}
                  secondary={props.teamData?.description}
                />
                <ListItemSecondaryAction></ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary={"Status"} secondary="Active status" />
                <ListItemSecondaryAction>
                  {Boolean(props.teamData?.is_active) === true
                    ? "Active"
                    : "Not Active"}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary={"Count"} secondary="Number of members" />
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
