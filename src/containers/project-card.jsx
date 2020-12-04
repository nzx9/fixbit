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
import { useDispatch } from "react-redux";

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
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const ProjectCard = (props) => {
  const classes = useStyles();

  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const dispatch = useDispatch();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {props.data.date_created.substring(0, 16)}
        </Typography>
        <Typography variant="h5" component="h2">
          {props.data.name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          #{props.data.pid}
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
        <Grid container justify="flex-end">
          <Grid item></Grid>
          <Grid item>
            <Button
              size="small"
              color="secondary"
              variant="outlined"
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
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
