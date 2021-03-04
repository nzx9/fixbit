import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DEBUG_PRINT } from "../components/debugTools";
import { httpReq } from "../components/httpRequest";
import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";
import ProjectCard from "./project-card";
import noProjectsImage from "../images/no-projects.png";
import {
  Backdrop,
  CircularProgress,
  Fab,
  Grid,
  Button,
  Paper,
  Select,
  makeStyles,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Hidden,
} from "@material-ui/core";
import { Add, Search } from "@material-ui/icons";
import ProjectDialog from "./project-dialog";
import config from "../components/config.json";
import { NOTIFY, AlertDialog, snackPosition } from "../components/notify";
import { useSnackbar } from "notistack";
import { Pagination } from "@material-ui/lab";
import { useLocation } from "react-router-dom";

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
    transition: "0.2s",
    "&:before": {
      transition: "0.3s",
    },
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

  const [isLoadedP, setIsLoadedP] = React.useState(false);
  const [isLoadedT, setIsLoadedT] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [teamsInfo, setTeamsInfo] = React.useState([]);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState(null);
  const [alertTitle, setAlertTitle] = React.useState(null);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [fabType, setFabType] = React.useState("round");

  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleAlertClose = () => setAlertOpen(false);

  const handleOpenBackdrop = () => _setOpenBackdrop(true);
  const handleCloseBackdrop = () => _setOpenBackdrop(false);

  const extendFAB = () => setFabType("extended");
  const roundFAB = () => setFabType("round");

  const { enqueueSnackbar } = useSnackbar();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();

  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("pid");
  const [searchInput, setSearchInput] = React.useState(null);
  const [paginationData, setPaginationData] = React.useState({});
  const [page, setPage] = React.useState(query.get("page"));
  const [perPage, setPerPage] = React.useState(query.get("per_page"));

  const fetchTeamsInfo = () => {
    httpReq(`${config.URL}/api/teams`, "GET", null, token)
      .then((res) => {
        DEBUG_PRINT(res);
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            if (msg === null || msg === undefined) msg = r.message;
            enqueueSnackbar(msg, {
              variant: r.type === "success" ? "info" : r.type,
              anchorOrigin: snackPosition(),
            });
            if (res.status === 200 && r.success === true)
              r.data !== null ? setTeamsInfo(r.data) : setTeamsInfo([]);
            else setError(r.msg);
            setIsLoadedT(true);
          });
        });
      })
      .catch((err) => {
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
        setError(err.toString());
        setIsLoadedT(true);
      });
  };

  const fetchDataAndSet = (
    filter = "all",
    sort = "pid_asc",
    page = 1,
    perPage = 20
  ) => {
    _setOpenBackdrop(true);
    httpReq(
      `${config.URL}/api/projects?filter=${filter}&sort=${sort}&per_page=${perPage}&page=${page}`,
      "GET",
      null,
      token
    )
      .then((res) => {
        setIsLoadedP(true);
        DEBUG_PRINT(res);
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            enqueueSnackbar(msg, {
              variant: r.type,
              anchorOrigin: snackPosition(),
            });
            DEBUG_PRINT(r);
            if (res.status === 200 && r.success === true) {
              if (r.data !== null) {
                setData(r.data.data);
                setPaginationData(r.data.pagination);
              }
            } else setError(r.msg);
            _setOpenBackdrop(false);
          });
        });
      })
      .catch((err) => {
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
        setError(err.toString());
        setIsLoadedP(true);
        _setOpenBackdrop(false);
      });
  };

  useEffect(() => {
    fetchDataAndSet(filter, sort, page, perPage);
    fetchTeamsInfo();
  }, [filter, sort, page, perPage]);

  if (error) {
    return (
      <div style={{ margin: "0 auto", width: "300px" }}>
        <h1>{error}</h1>
      </div>
    );
  } else if (!isLoadedP || !isLoadedT)
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
        <Add className={fabType === "extended" ? classes.extendedIcon : null} />
        <div
          className={
            fabType === "extended" ? classes.fabText : classes.fabTextHidden
          }
        >
          New Project
        </div>
      </Fab>
      <ProjectDialog
        open={open}
        handleClose={() => handleClose()}
        uId={uId}
        teamsInfo={teamsInfo}
        token={token}
        handleOpenBackdrop={() => handleOpenBackdrop()}
        handleCloseBackdrop={() => handleCloseBackdrop()}
        action={() => fetchDataAndSet()}
      />
      <div>
        <div
          style={{
            display: "auto",
            marginLeft: "3%",
          }}
        >
          <div>
            {data.length === 0 ? (
              <div style={{ textAlign: "center", maxWidth: "100%" }}>
                <img
                  className={classes.noResultImage}
                  src={noProjectsImage}
                  alt="No Projects"
                />
              </div>
            ) : (
              data.map((value, index) => (
                <ProjectCard
                  key={index}
                  data={value}
                  token={token}
                  refetchData={() => fetchDataAndSet()}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
