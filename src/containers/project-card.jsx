import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  makeStyles,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";

import routes from "../routes/routes.json";
import {
  setPId,
  setProjectName,
  setProjectDescription,
  setCreatorId,
  setAdminId,
  setDateCreated,
} from "../reducers/projectDataTracker";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  DeleteForever,
  Edit,
  ExpandLess,
  ExpandMore,
  Group,
} from "@material-ui/icons";
import { getUId } from "../reducers/userDataTracker";
import { DEBUG_PRINT } from "../components/debugTools";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    width: 275,
    [theme.breakpoints.down("sm")]: {
      width: "96%",
    },
    float: "left",
    margin: theme.spacing(1),
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  viewBtn: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.grey[200],
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
  deleteItem: {
    color: theme.palette.error.main,
  },
}));

const ProjectCard = (props) => {
  const classes = useStyles();

  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const uid = useSelector(getUId);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  DEBUG_PRINT(props.admin_id);
  const renderMenu = (
    <Menu
      getContentAnchorEl={null}
      anchorEl={anchorEl}
      id="profile-menu"
      keepMounted
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
        }}
      >
        <Group />
        &ensp;View Team
      </MenuItem>
      {Number(props.data.admin_id) === Number(uid) ? (
        <>
          <MenuItem
            onClick={() => {
              handleMenuClose();
            }}
          >
            <Edit /> &ensp; Edit Project
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className={classes.deleteItem}>
            <DeleteForever /> &ensp; Delete
          </MenuItem>
        </>
      ) : (
        <></>
      )}
    </Menu>
  );

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container>
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              ProjectID: #{props.data.pid}
            </Typography>
          </Grid>
          <div className={classes.grow} />
          <Grid item>
            <IconButton
              size="small"
              onClick={Boolean(anchorEl) ? handleMenuClose : handleMenuOpen}
            >
              {Boolean(anchorEl) ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </IconButton>
          </Grid>
        </Grid>
        {renderMenu}
        <Typography variant="h5" component="h2">
          {props.data.name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {Number(props.data.is_public) ? "Public" : "Private"}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          style={{ height: 50, overflowY: "auto", margin: 0 }}
        >
          {props.data.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container justify="flex-start">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              {props.data.date_created.substring(0, 16)}
            </Typography>
          </Grid>
          <div className={classes.grow} />
          <Grid item>
            <Button
              className={classes.viewBtn}
              size="small"
              variant="contained"
              onClick={() => {
                dispatch(setPId(props.data.pid));
                dispatch(setProjectName(props.data.name));
                dispatch(setProjectDescription(props.data.description));
                dispatch(setCreatorId(props.data.creator_id));
                dispatch(setAdminId(props.data.admin_id));
                dispatch(setDateCreated(props.data.date_created));
                goto(routes.PROJECTS_VIEW_X + props.data.pid);
              }}
            >
              View
              <ArrowRight fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
