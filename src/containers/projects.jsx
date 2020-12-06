import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { DEBUG_PRINT } from "../components/debugTools";
import { httpPOST } from "../components/httpRequest";

import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";

import ProjectCard from "./project-card";

import router from "../routes/routes.json";

import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
}));

const Projects = () => {
  const classes = useStyles();
  const uId = useSelector(getUId);
  const token = useSelector(getToken);

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const fetchDataAndSet = (filter_value) => {
    httpPOST(
      `${window.location.protocol}//${window.location.hostname}/api/projects/getprojects.php`,
      {
        uid: uId,
        token: token,
        filter: filter_value,
      }
    )
      .then((result) => {
        setIsLoaded(true);
        if (result.success) {
          DEBUG_PRINT(result);
          if (result.data !== null) {
            setData(result.project_data);
          } else {
            setData([]);
          }
        } else {
          setError(result.msg);
        }
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  };

  // const setOpenBackdrop = (value) => {
  //   _setOpenBackdrop(value);
  // };

  useEffect(() => {
    fetchDataAndSet("ALL");
  });

  if (error) {
    return (
      <div style={{ margin: "0 auto", width: "300px" }}>
        <h1>Error: {error}</h1>
      </div>
    );
  } else if (!isLoaded)
    return (
      <div>
        <Backdrop className={classes.backdrop} open="true">
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  return (
    <div
      style={{
        display: "auto",
        marginLeft: "3%",
      }}
    >
      {data.map((value, index) => (
        <ProjectCard key={index} data={value} />
      ))}
    </div>
  );
};

export default Projects;
