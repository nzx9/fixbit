import React, { useCallback } from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import router from "../routes/routes.json";
import { DEBUG_PRINT } from "../components/debugTools";

import { httpPOST } from "../components/httpRequest";

const Projects = () => {
  const classes = useStyles();
  const uId = useSelector(getUId);
  const token = useSelector(getToken);

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState([]);

  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const fetchDataAndSet = () => {
    httpPOST(
      `${window.location.protocol}//${window.location.hostname}/api/projects/allissues.php`,
      {
        uid: uId,
        token: token,
      }
    )
      .then((result) => {
        setIsLoaded(true);
        if (result.success && result.data !== null) {
          DEBUG_PRINT(result);
        } else {
          setError("404");
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

  useEffect(() => {}, []);
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          goto(router.PROJECTS_VIEW_X + "20");
        }}
      >
        Project 21
      </Button>
    </div>
  );
};

export default Projects;
