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
  ListItemText,
  ListSubheader,
  ListItemIcon,
  Divider,
  Hidden,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import {
  Cancel,
  Face,
  Email,
  Fingerprint,
  AccessTime,
  WatchLater,
  Stars,
  EmojiObjects,
  Lens,
  PanoramaFishEye,
  NotInterested,
} from "@material-ui/icons";

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

const MemberEdit = (props) => {
  const classes = useStyles();

  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
      <DialogTitle
        disableTypography
        className={classes.root}
        onClose={props.handleClose}
      >
        Member
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container>
          <Grid item xs={12} md={6}>
            <List
              subheader={
                <Hidden xsDown>
                  <ListSubheader>Personal Info</ListSubheader>
                </Hidden>
              }
            >
              <ListItem>
                <ListItemIcon>
                  <Fingerprint />
                </ListItemIcon>
                <ListItemText
                  primary="UserId"
                  secondary={"#" + props.memberData?.info?.id}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Face />
                </ListItemIcon>
                <ListItemText
                  primary="Username"
                  secondary={props.memberData?.info?.username}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Face />
                </ListItemIcon>
                <ListItemText
                  primary="Fullname"
                  secondary={props.memberData?.info?.fullname}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={props.memberData?.info?.email}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTime />
                </ListItemIcon>
                <ListItemText
                  primary="Registered to Fixbit"
                  secondary={convertToLocalTime(
                    props.memberData?.info?.created_at,
                    false
                  )}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List
              subheader={
                <ListSubheader>
                  {" "}
                  <Hidden xsDown>Member Info</Hidden>
                </ListSubheader>
              }
            >
              {props.leaderId === props.memberData?.info?.id ? (
                <ListItem>
                  <ListItemIcon>
                    <Stars />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Leader"}
                    secondary={
                      props.leaderId === props.uid
                        ? "You are the Leader of this team"
                        : props.memberData?.info?.username +
                          " is the Leader of this team"
                    }
                  />
                </ListItem>
              ) : null}
              <ListItem>
                <ListItemIcon>
                  <EmojiObjects />
                </ListItemIcon>
                <ListItemText
                  primary="Role"
                  secondary={
                    props.memberData?.member?.role === null
                      ? "Not Set"
                      : props.memberData?.member?.role
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {props.memberData?.member?.is_available === null ? (
                    <NotInterested />
                  ) : Boolean(props.memberData?.member?.is_available) ? (
                    <Lens />
                  ) : (
                    <PanoramaFishEye />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Available"
                  secondary={
                    props.memberData?.member?.is_available === null
                      ? "Not Set"
                      : Boolean(props.memberData?.member?.is_available)
                      ? "Yes"
                      : "No"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WatchLater />
                </ListItemIcon>
                <ListItemText
                  primary="Become a Member"
                  secondary={convertToLocalTime(
                    props.memberData?.member?.created_at
                  )}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <div>&nbsp;</div>
    </Dialog>
  );
};

export default MemberEdit;
