import React, { useCallback, useEffect } from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { DEBUG_PRINT } from "../components/debugTools";
import { httpPOST } from "../components/httpRequest";

import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";

import ProjectCard from "./project-card";

import router from "../routes/routes.json";
const Projects = () => {
  // const classes = useStyles();
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
        if (result.success && result.data !== null) {
          DEBUG_PRINT(result);
          setData(result.project_data);
        } else {
          // setError("404");
          setData([]);
        }
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  };

  const setOpenBackdrop = (value) => {
    _setOpenBackdrop(value);
  };
  console.log(data);
  useEffect(() => {
    fetchDataAndSet("ALL");
  }, []);
  return (
    <div style={{ display: "auto" }}>
      {data.map((value, index) => (
        <ProjectCard key={index} data={value} />
      ))}
    </div>
  );
};

export default Projects;
