import React, { useCallback } from "react";
import clsx from "clsx";

import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Dashboard,
  Apps,
} from "@material-ui/icons";

import { useHistory } from "react-router-dom";
import routes from "../routes/routes.json";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 30,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    marginTop: theme.spacing(1),
  },
}));

export default function SideDrawer(props) {
  const { children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [topListSelected, setTopListSelected] = React.useState(1);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const topList = [
    { id: 1, title: "Dashboard", url: routes.HOME, icon: <Dashboard /> },
    { id: 2, title: "Projects", url: routes.PROJECTS, icon: <Apps /> },
  ];
  const bottomList = [];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            Bug Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {topList.map((value, index) => (
            <ListItem
              button
              key={value.id}
              onClick={() => {
                setTopListSelected(value.id);
                goto(value.url);
              }}
              selected={history.location.pathname === value.url ? true : false}
            >
              <ListItemIcon>{value.icon}</ListItemIcon>
              <ListItemText primary={value.title} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {bottomList.map((value, index) => (
            <ListItem
              button
              key={value.id}
              onClick={() => {
                setTopListSelected(value.id);
                goto(value.url);
              }}
              selected={history.location.pathname === value.url ? true : false}
            >
              <ListItemIcon>{value.icon}</ListItemIcon>
              <ListItemText primary={value.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}
