import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Switch,
  Select,
  MenuItem,
  Hidden,
  Button,
  IconButton,
  Tooltip,
  makeStyles,
} from "@material-ui/core";

import {
  Brightness4,
  NotificationsActive,
  CallToAction,
  FormatListNumbered,
  Refresh,
  Info,
} from "@material-ui/icons/";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("sm")]: {
      paddingLeft: 20,
      paddingRight: 20,
    },
  },
}));

const Settings = () => {
  const classes = useStyles();
  const [darkTheme, setDarkTheme] = React.useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );
  const [notification, setNotification] = React.useState(
    localStorage.getItem("max_snacks") === null ||
      Number(localStorage.getItem("max_snacks")) > 0
      ? true
      : false
  );
  const [notificationCount, setNotificationCount] = React.useState(
    localStorage.getItem("max_snacks") === null
      ? 3
      : localStorage.getItem("max_snacks") > 5
      ? 5
      : localStorage.getItem("max_snacks") < 0
      ? 0
      : localStorage.getItem("max_snacks")
  );

  const [notificationPosition, setNotificationPosition] = React.useState(
    localStorage.getItem("snack_pos") === "TL"
      ? "TL"
      : localStorage.getItem("snack_pos") === "TR"
      ? "TR"
      : localStorage.getItem("snack_pos") === "BR"
      ? "BR"
      : "BL"
  );

  const handleToggleDarkTheme = () => {
    if (darkTheme) localStorage.setItem("theme", "light");
    else localStorage.setItem("theme", "dark");
    setDarkTheme(!darkTheme);
  };

  const handleToggleNotifications = () => {
    if (notification) {
      localStorage.setItem("max_snacks", 0);
      setNotificationCount(0);
    } else {
      localStorage.setItem("max_snacks", 3);
      setNotificationCount(3);
    }
    setNotification(!notification);
  };

  const handleNotificationCountChange = (e) => {
    localStorage.setItem("max_snacks", e.target.value);
    setNotificationCount(e.target.value);
  };

  const handleNotificationPositionChange = (e) => {
    localStorage.setItem("snack_pos", e.target.value);
    setNotificationPosition(e.target.value);
  };

  return (
    <>
      <List
        subheader={<ListSubheader>Theme Settings</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemIcon>
            <Brightness4 />
          </ListItemIcon>
          <ListItemText
            primary="Dark Theme"
            secondary="Turn on/off dark theme"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={handleToggleDarkTheme}
              checked={darkTheme}
              inputProps={{ "aria-labelledby": "switch-list-label-wifi" }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <List
        subheader={<ListSubheader>Notification Settings</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemIcon>
            <NotificationsActive />
          </ListItemIcon>
          <ListItemText
            primary="Notifications"
            secondary="Turn on/off snack notifications"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={handleToggleNotifications}
              checked={notification}
              inputProps={{ "aria-labelledby": "switch-list-label-bluetooth" }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FormatListNumbered />
          </ListItemIcon>
          <ListItemText
            primary="Max Snacks Count"
            secondary="maximum snacks at a time"
          />
          <ListItemSecondaryAction>
            <Select
              variant="outlined"
              disabled={!notification}
              value={notificationCount}
              onChange={handleNotificationCountChange}
            >
              {notification === false ? (
                <MenuItem value={0}>Zero</MenuItem>
              ) : null}
              <MenuItem value={1}>One</MenuItem>
              <MenuItem value={2}>Two</MenuItem>
              <MenuItem value={3}>Three</MenuItem>
              <MenuItem value={4}>Four</MenuItem>
              <MenuItem value={5}>Five</MenuItem>
            </Select>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem style={{ marginTop: 12 }}>
          <ListItemIcon>
            <CallToAction />
          </ListItemIcon>
          <ListItemText primary="Snacks Position" secondary="Place snacks in" />
          <ListItemSecondaryAction>
            <Select
              variant="outlined"
              disabled={!notification}
              onChange={handleNotificationPositionChange}
              value={notificationPosition}
            >
              <MenuItem value={"TL"}>Top Left</MenuItem>
              <MenuItem value={"TR"}>Top Right</MenuItem>
              <MenuItem value={"BL"}>Bottom Left</MenuItem>
              <MenuItem value={"BR"}>Bottom Right</MenuItem>
            </Select>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <List
        subheader={<ListSubheader>Reload to Take effect</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText
            primary="Reload Application"
            secondary="Some settings need to reload application to take effect"
          />
          <ListItemSecondaryAction>
            <Hidden smDown>
              <Tooltip title="click to reload" arrow>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => window.location.reload()}
                >
                  Reload
                  <Refresh />
                </Button>
              </Tooltip>
            </Hidden>
            <Hidden mdUp>
              <Tooltip title="click to reload" arrow>
                <IconButton
                  color="secondary"
                  onClick={() => window.location.reload()}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Hidden>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </>
  );
};

export default Settings;
