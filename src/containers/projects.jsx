import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { DEBUG_PRINT } from "../components/debugTools";
import { httpReq } from "../components/httpRequest";
import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";
import ProjectCard from "./project-card";
import noProjectsImage from "../images/no-projects.png";
import { Backdrop, CircularProgress, Fab, makeStyles } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import ProjectDialog from "./project-dialog";
import config from "../components/config.json";
import { NOTIFY, AlertDialog } from "../components/notify";
import { useSnackbar } from "notistack";
import settings from "../components/settings.json";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
  fabDesktop: {
    display: "flex",
    position: "fixed",
    zIndex: 1,
    bottom: theme.spacing(3),
    right: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  fabMobile: {
    display: "none",
    position: "fixed",
    zIndex: 1,
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fabText: {
    display: "flex",
  },
  noResultImage: {
    width: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const Projects = () => {
  const classes = useStyles();
  const uId = useSelector(getUId);
  const token = useSelector(getToken);

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [filterValue, setFilterValue] = React.useState("ALL");
  const [newProjectAdded, setNewProjectAdded] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState(null);
  const [alertTitle, setAlertTitle] = React.useState(null);
  const [alertMsg, setAlertMsg] = React.useState(null);

  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleNewProjectAdded = () => setNewProjectAdded(!newProjectAdded);
  const handleAlertClose = () => setAlertOpen(false);

  const handleOpenBackdrop = () => _setOpenBackdrop(true);
  const handleCloseBackdrop = () => _setOpenBackdrop(false);

  const { enqueueSnackbar } = useSnackbar();

  const fetchDataAndSet = () => {
    httpReq(`${config.URL}/api/projects`, "GET", null, token)
      .then((res) => {
        setIsLoaded(true);
        DEBUG_PRINT(res);
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            _setOpenBackdrop(false);
            enqueueSnackbar(msg, {
              variant: r.type,
              anchorOrigin: settings.snackbar.anchorOrigin,
            });
            DEBUG_PRINT(r);
            if (res.status === 200 && r.success === true)
              r.data !== null ? setData(r.data) : setData([]);
            else setError(r.msg);
          });
        });
      })
      .catch((err) => {
        setIsLoaded(true);
        setAlertType("error");
        const parsedError = err.toString().split(":");
        if (parsedError.length >= 1) {
          setAlertTitle(parsedError[0].trim());
        } else {
          setAlertTitle("Error");
        }
        if (parsedError.length >= 2) {
          setAlertMsg(parsedError[1].trim());
        } else {
          setAlertMsg("Unknown");
        }
        setAlertOpen(true);
        setError(err);
      });
  };

  useEffect(() => {
    fetchDataAndSet(filterValue);
  }, [filterValue, newProjectAdded]);

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
    <div>
      <Backdrop className={classes.backdrop} open={_openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AlertDialog
        alertOpen={alertOpen}
        title={alertTitle}
        type={alertType}
        msg={alertMsg}
        handleAlertClose={() => handleAlertClose()}
      />
      <Fab
        variant="extended"
        className={classes.fabDesktop}
        color="primary"
        onClick={handleOpen}
      >
        <Add className={classes.extendedIcon} />
        <div className={classes.fabText}>New Project</div>
      </Fab>
      <Fab className={classes.fabMobile} color="primary" onClick={null}>
        <Add />
      </Fab>
      <ProjectDialog
        open={open}
        handleClose={() => handleClose()}
        uId={uId}
        token={token}
        openBackdrop={() => handleOpenBackdrop()}
        closeBackdrop={() => handleCloseBackdrop()}
        newProjectAddedAction={() => fetchDataAndSet(filterValue)}
      />
      <div
        style={{
          display: "auto",
          marginLeft: "3%",
        }}
      >
        {data.length === 0 ? (
          <div style={{ textAlign: "center", maxWidth: "100%" }}>
            <img
              className={classes.noResultImage}
              src={noProjectsImage}
              alt="No Projects"
            />
          </div>
        ) : (
          data.map((value, index) => <ProjectCard key={index} data={value} />)
        )}
      </div>
    </div>
  );
};

export default Projects;
