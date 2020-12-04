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
  Badge,
  Menu,
  MenuItem,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import {
  ChevronLeft,
  ChevronRight,
  MenuTwoTone,
  Dashboard,
  Apps,
  Notifications,
  AccountCircle,
  ExitToApp,
  MoreVert,
} from "@material-ui/icons";

import { useHistory } from "react-router-dom";
import routes from "../routes/routes.json";
import { logout } from "../reducers/loginTracker";
import { useDispatch } from "react-redux";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
  },
  grow: {
    flexGrow: 1,
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
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
    },
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
    width: theme.spacing(0),
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
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  sectionWideScreen: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  sectionSmallScreen: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
}));

export default function SideDrawer(props) {
  const { children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [topListSelected, setTopListSelected] = React.useState(1);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const dispatch = useDispatch();

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

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id="profile-menu"
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          goto(routes.PROFILE);
          handleMenuClose();
        }}
      >
        Profile <AccountCircle />
      </MenuItem>
      <MenuItem onClick={() => dispatch(logout())}>
        Logout
        <ExitToApp />
      </MenuItem>
    </Menu>
  );

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
            <MenuTwoTone />
          </IconButton>
          <Typography variant="h6" noWrap>
            Bug Tracker
          </Typography>
          <div className={classes.grow} />
          <IconButton aria-label="show 17 new notifications" color="inherit">
            <Badge badgeContent={17} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
          <div className={classes.sectionSmallScreen}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <MoreVert />
            </IconButton>
          </div>
          <div className={classes.sectionWideScreen}>
            <IconButton
              edge="end"
              title="user profile"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={() => goto(routes.PROFILE)}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              edge="end"
              title="logout"
              aria-label="logout"
              aria-haspopup="true"
              onClick={() => dispatch(logout())}
              color="inherit"
            >
              <ExitToApp />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
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
              selected={topListSelected === value.id ? true : false}
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
