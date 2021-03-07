import React, { Fragment } from "react";
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
  Button,
  IconButton,
  Fab,
  makeStyles,
} from "@material-ui/core";

import {
  Brightness4,
  NotificationsActive,
  CallToAction,
  FormatListNumbered,
  Refresh,
  Info,
  Cancel,
  Dehaze,
} from "@material-ui/icons/";
import { useSnackbar } from "notistack";
import { snackPosition } from "../components/notify";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("sm")]: {
      paddingLeft: 20,
      paddingRight: 20,
    },
  },
  red: {
    color: "#f44336",
  },
  fab: {
    display: "flex",
    position: "fixed",
    zIndex: theme.zIndex.drawer - 1,
    bottom: theme.spacing(3),
    right: theme.spacing(2),
    transition: "0.2s",
    "&:before": {
      transition: "0.3s",
    },
  },
}));

const Settings = () => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const onClickDismiss = (key) => () => {
    closeSnackbar(key);
  };
  const action = (key) => (
    <Fragment>
      <Button
        size="small"
        className={classes.green}
        variant="outlined"
        color="secondary"
        style={{ marginRight: 5 }}
        onClick={() => {
          closeSnackbar(key);
          window.location.reload();
        }}
      >
        <Refresh fontSize="small" style={{ marginRight: 5 }} />
        Reload
      </Button>
      <IconButton onClick={onClickDismiss(key)} size="small">
        <Cancel className={classes.red} fontSize="small" />
      </IconButton>
    </Fragment>
  );

  const [darkTheme, setDarkTheme] = React.useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );
  const [notification, setNotification] = React.useState(
    localStorage.getItem("max_snacks") === null ||
      Number(localStorage.getItem("max_snacks")) > 0
      ? true
      : false
  );
  const [dense, setDense] = React.useState(
    localStorage.getItem("snack_dense") === "true" ? true : false
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
      : localStorage.getItem("snack_pos") === "BL"
      ? "BL"
      : localStorage.getItem("snack_pos") === "BC"
      ? "BC"
      : "TC"
  );

  const handleToggleDarkTheme = () => {
    if (darkTheme) localStorage.setItem("theme", "light");
    else localStorage.setItem("theme", "dark");
    setDarkTheme(!darkTheme);
    enqueueSnackbar("Reload Application to Take Effect", {
      preventDuplicate: true,
      persist: true,
      anchorOrigin: snackPosition(),
      action,
    });
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
    enqueueSnackbar("Reload Application to Take Effect", {
      preventDuplicate: true,
      anchorOrigin: snackPosition(),
      persist: true,
      action,
    });
  };

  const handleToggleDense = () => {
    localStorage.setItem("snack_dense", !dense);
    setDense(!dense);

    enqueueSnackbar("Reload Application to Take Effect", {
      preventDuplicate: true,
      anchorOrigin: snackPosition(),
      persist: true,
      action,
    });
  };

  const handleNotificationCountChange = (e) => {
    localStorage.setItem("max_snacks", e.target.value);
    setNotificationCount(e.target.value);

    enqueueSnackbar("Reload Application to Take Effect", {
      preventDuplicate: true,
      persist: true,
      anchorOrigin: snackPosition(),
      action,
    });
  };

  const handleNotificationPositionChange = (e) => {
    localStorage.setItem("snack_pos", e.target.value);
    setNotificationPosition(e.target.value);
  };

  return (
    <>
      <Fab
        className={classes.fab}
        variant="round"
        color="secondary"
        onClick={() => window.location.reload()}
      >
        <Refresh />
      </Fab>
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
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Dehaze />
          </ListItemIcon>
          <ListItemText
            primary="Dense Margins"
            secondary="Less margin between snacks"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={handleToggleDense}
              disabled={!notification}
              checked={dense}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FormatListNumbered />
          </ListItemIcon>
          <ListItemText
            primary="Max Snacks Count"
            secondary="Maximum snacks at a time"
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
              <MenuItem value={"TC"}>Top Center</MenuItem>
              <MenuItem value={"TL"}>Top Left</MenuItem>
              <MenuItem value={"TR"}>Top Right</MenuItem>
              <MenuItem value={"BC"}>Bottom Center</MenuItem>
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
        </ListItem>
      </List>
    </>
  );
};

export default Settings;
