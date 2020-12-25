import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { DEBUG_PRINT } from "../components/debugTools";
import { httpReq } from "../components/httpRequest";
import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";
import TeamCard from "./team-card";
import noTeamsImage from "../images/no-teams.png";
import { Backdrop, CircularProgress, Fab, makeStyles } from "@material-ui/core";
import { Add, GroupWorkRounded } from "@material-ui/icons";
import TeamDialog from "./team-dialog";
import config from "../components/config.json";
import { NOTIFY, AlertDialog } from "../components/notify";
import { useSnackbar } from "notistack";
import settings from "../components/settings.json";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 200,
    color: theme.palette.primary.main,
  },
  fab: {
    display: "flex",
    position: "fixed",
    zIndex: 9999,
    bottom: theme.spacing(3),
    right: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fabText: {
    display: "flex",
  },
  fabTextHidden: {
    display: "none",
  },
  noTeamsImage: {
    width: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  mainViewNoData: {
    display: "auto",
    marginLeft: "3%",
  },
  mainViewWithData: {
    display: "auto",
    marginLeft: "3%",
    float: "left",
  },
}));

const Teams = () => {
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
  const [fabType, setFabType] = React.useState("round");

  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAlertClose = () => setAlertOpen(false);

  const handleOpenBackdrop = () => _setOpenBackdrop(true);
  const handleCloseBackdrop = () => _setOpenBackdrop(false);

  const extendFAB = () => setFabType("extended");
  const roundFAB = () => setFabType("round");

  const { enqueueSnackbar } = useSnackbar();

  const fetchDataAndSet = () => {
    httpReq(`${config.URL}/api/teams`, "GET", null, token)
      .then((res) => {
        setIsLoaded(true);
        DEBUG_PRINT(res);
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            _setOpenBackdrop(false);
            if (msg === null || msg === undefined) msg = r.message;
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
    handleClose();
  };

  useEffect(() => {
    fetchDataAndSet();
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
        variant={fabType}
        className={classes.fab}
        color="primary"
        onClick={handleOpen}
        onMouseEnter={extendFAB}
        onMouseLeave={roundFAB}
      >
        <GroupWorkRounded
          className={fabType === "extended" ? classes.extendedIcon : null}
        />
        <div
          className={
            fabType === "extended" ? classes.fabText : classes.fabTextHidden
          }
        >
          New Team
        </div>
      </Fab>
      <TeamDialog
        open={open}
        handleClose={() => handleClose()}
        openBackdrop={() => handleOpenBackdrop()}
        closeBackdrop={() => handleCloseBackdrop()}
        action={() => fetchDataAndSet()}
      />
      <div
        className={
          data.length === 0 ? classes.mainViewNoData : classes.mainViewWithData
        }
      >
        {data.length === 0 ? (
          <div style={{ textAlign: "center", maxWidth: "100%" }}>
            <img
              className={classes.noTeamsImage}
              src={noTeamsImage}
              alt="No Teams"
            />
          </div>
        ) : (
          data.map((value, index) => (
            <TeamCard
              key={index}
              data={value}
              openBackdrop={() => handleOpenBackdrop()}
              closeBackdrop={() => handleCloseBackdrop()}
              refetchData={() => fetchDataAndSet()}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Teams;
