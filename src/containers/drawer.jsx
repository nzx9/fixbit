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
  // Badge,
  Menu,
  MenuItem,
  Tooltip,
  SwipeableDrawer,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import {
  ChevronLeft,
  ChevronRight,
  MenuTwoTone,
  Dashboard,
  Apps,
  ExitToApp,
  MoreVert,
  BubbleChart,
  Group,
  Settings,
  Face,
} from "@material-ui/icons";

import { Link, useHistory } from "react-router-dom";
import routes from "../routes/routes.json";
import { logout } from "../reducers/loginTracker";
import { useDispatch } from "react-redux";
import { tipTitle, snackPosition } from "../components/notify";
import { useSnackbar } from "notistack";
import { drawerOpen, drawerClose } from "../reducers/drawerOpenTracker";
import favicon from "../images/favicon-32x32.png";
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
    marginRight: 0,
    [theme.breakpoints.up("sm")]: {
      display: "none",
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
  sectionDesktop: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  sectionMobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  title: {
    textDecoration: "none",
    color: theme.palette.grey[100],
    outline: "none",
  },
  selected: { color: theme.palette.primary.main },
  unselected: { color: "auto" },
  logo: {
    width: "200px",
    position: "relative",
    left: -10,
    [theme.breakpoints.down("sm")]: {
      left: 0,
    },
  },
}));

export default function SideDrawer(props) {
  const { children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    dispatch(drawerOpen());
    setOpen(true);
  };
  const handleDrawerClose = () => {
    dispatch(drawerClose());
    setOpen(false);
  };

  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);
  const [currentRoute, setCurrentRoute] = React.useState(
    window.location.hash.split("#")[1]
  );

  const topList = [
    { id: 1, title: "Dashboard", url: routes.HOME, icon: <Dashboard /> },
    { id: 2, title: "Projects", url: routes.PROJECTS, icon: <Apps /> },
    { id: 3, title: "Teams", url: routes.TEAMS, icon: <Group /> },
  ];
  const bottomList = [
    {
      id: topList.length + 1,
      title: "Settings",
      url: routes.SETTINGS,
      icon: <Settings />,
    },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      getContentAnchorEl={null}
      id="profile-menu"
      keepMounted
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <Tooltip title={tipTitle("Profile")} placement="left" arrow>
        <MenuItem
          onClick={() => {
            goto(routes.PROFILE);
            handleMenuClose();
          }}
        >
          Profile <Face />
        </MenuItem>
      </Tooltip>
      <Tooltip title={tipTitle("Logout")} placement="left" arrow>
        <MenuItem
          onClick={() => {
            localStorage.setItem("token", null);
            enqueueSnackbar("Logged out", {
              variant: "warning",
              anchorOrigin: snackPosition(),
            });
            dispatch(logout());
          }}
        >
          Logout
          <ExitToApp />
        </MenuItem>
      </Tooltip>
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
          <Tooltip title={tipTitle("Expand")} placement="bottom" arrow>
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
          </Tooltip>
          <div className={classes.logo}>
            <Link to={routes.HOME} className={classes.title}>
              <img
                src={favicon}
                style={{
                  float: "left",
                  paddingRight: 10,
                }}
              />
              <Typography variant="h6" noWrap style={{ fontWeight: 700 }}>
                Fixbit
                <BubbleChart />
              </Typography>
            </Link>
          </div>
          <div className={classes.grow} />
          {/* <IconButton title="notifications" color="inherit">
            <Badge badgeContent={0} color="secondary">
              <Notifications />
            </Badge>
          </IconButton> */}
          <div className={classes.sectionMobile}>
            <Tooltip title={tipTitle("More")} placement="bottom" arrow>
              <IconButton
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.sectionDesktop}>
            <Tooltip title={tipTitle("Profile")} placement="bottom" arrow>
              <IconButton
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={() => goto(routes.PROFILE)}
                color="inherit"
              >
                <Face />
              </IconButton>
            </Tooltip>
            <Tooltip title={tipTitle("Logout")} placement="bottom" arrow>
              <IconButton
                edge="end"
                aria-label="logout"
                aria-haspopup="true"
                onClick={() => {
                  localStorage.setItem("token", null);
                  enqueueSnackbar("Logged out", {
                    variant: "warning",
                    anchorOrigin: snackPosition(),
                  });
                  dispatch(logout());
                }}
                color="inherit"
              >
                <ExitToApp />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
        {renderMenu}
      </AppBar>
      <Drawer
        variant="permanent"
        anchor={"left"}
        open={open}
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
        <div className={classes.toolbar} role="presentation">
          <Tooltip title={tipTitle("Close")} placement="left" arrow>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Tooltip>
        </div>
        <Divider />
        <List>
          {topList.map((value, index) => (
            <Tooltip title={tipTitle(value.title)} placement="right" arrow>
              <ListItem
                button
                key={value.id}
                onClick={() => {
                  goto(value.url);
                  setCurrentRoute(window.location.hash.split("#")[1]);
                  handleDrawerClose();
                }}
                selected={currentRoute === value.url ? true : false}
              >
                <ListItemIcon
                  className={
                    currentRoute === value.url
                      ? classes.selected
                      : classes.unselected
                  }
                >
                  {value.icon}
                </ListItemIcon>
                <ListItemText primary={value.title} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
        <Divider />
        <List>
          {bottomList.map((value, index) => (
            <Tooltip title={tipTitle(value.title)} placement="right" arrow>
              <ListItem
                button
                key={value.id}
                onClick={() => {
                  goto(value.url);
                  setCurrentRoute(window.location.hash.split("#")[1]);
                  handleDrawerClose();
                }}
                selected={currentRoute === value.url ? true : false}
              >
                <ListItemIcon
                  className={
                    currentRoute === value.url
                      ? classes.selected
                      : classes.unselected
                  }
                >
                  {value.icon}
                </ListItemIcon>
                <ListItemText primary={value.title} />
              </ListItem>
            </Tooltip>
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
