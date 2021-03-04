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
  InputBase,
  IconButton,
  Divider,
  Tooltip,
} from "@material-ui/core";
import { Add, Menu, Search, Directions } from "@material-ui/icons";
import ProjectDialog from "./project-dialog";
import config from "../components/config.json";
import {
  NOTIFY,
  AlertDialog,
  snackPosition,
  tipTitle,
} from "../components/notify";
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
  formControl: {
    marginRight: theme.spacing(1),
    minWidth: 100,
  },
  formControlNumber: {
    marginRight: theme.spacing(0),
    minWidth: 75,
  },
  searchPaper: {
    padding: "5px 4px",
    display: "flex",
    alignItems: "center",
    border: `1px solid ${theme.palette.text.secondary}`,
  },
  input: {
    marginLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      color: theme.palette.text.primary,
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

  const [filter, setFilter] = React.useState(
    query.get("filter") === null ? "all" : query.get("filter")
  );
  const [sort, setSort] = React.useState(
    query.get("sort") === null ? "latest" : query.get("sort")
  );
  const [search, setSearch] = React.useState(query.get("search"));
  const [paginationData, setPaginationData] = React.useState({});
  const [page, setPage] = React.useState(
    query.get("page") === null ? 1 : query.get("page")
  );
  const [perPage, setPerPage] = React.useState(
    query.get("per_page") === null ? 20 : query.get("per_page")
  );
  const [searchInput, setSearchInput] = React.useState("");

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
    perPage = 20,
    search = null
  ) => {
    _setOpenBackdrop(true);
    httpReq(
      `${
        config.URL
      }/api/projects?filter=${filter}&sort=${sort}&per_page=${perPage}&page=${page}&search=${
        search === null ? "" : search
      }`,
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
                setPage(r.data.pagination.page);
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
    fetchDataAndSet(filter, sort, page, perPage, search);
    fetchTeamsInfo();
  }, [filter, sort, page, perPage, search]);

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
          <Paper
            style={{
              marginTop: 5,
              marginBottom: 5,
              marginLeft: "1%",
              marginRight: "3.5%",
              padding: 5,
              zIndex: 2,
            }}
          >
            <Grid container justify="space-evenly">
              <Grid item xs={12} md={4}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="team-select">Filter by:</InputLabel>
                    <Select
                      value={filter}
                      variant="outlined"
                      label="Filter by: "
                      onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                      }}
                    >
                      {[
                        { name: "All Projects", value: "all" },
                        { name: "My Projects", value: "my" },
                        { name: "Public only", value: "public" },
                        { name: "Private Only", value: "private" },
                      ].map((item) => (
                        <MenuItem value={item.value}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="team-select">Sort by: </InputLabel>
                    <Select
                      value={sort}
                      variant="outlined"
                      label="Sort by: "
                      onChange={(e) => setSort(e.target.value)}
                    >
                      {[
                        { name: "PID Asc", value: "pid_asc" },
                        { name: "PID Desc", value: "pid_desc" },
                        { name: "Name Asc", value: "name_asc" },
                        { name: "Name Desc", value: "name_desc" },
                        { name: "Oldest", value: "oldest" },
                        { name: "Latest", value: "latest" },
                      ].map((item) => (
                        <MenuItem value={item.value}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={classes.formControlNumber}
                  >
                    <InputLabel id="team-select">Per Page: </InputLabel>
                    <Select
                      value={perPage}
                      variant="outlined"
                      label="Per Page: "
                      onChange={(e) => {
                        setPerPage(e.target.value);
                        setPage(1);
                      }}
                    >
                      {[
                        { name: "12", value: "12" },
                        { name: "20", value: "20" },
                        { name: "50", value: "50" },
                      ].map((item) => (
                        <MenuItem value={item.value}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} md={4} justify="center">
                <div
                  style={{
                    width: "100%",
                    marginTop: 12,
                    marginBottom: 12,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pagination
                    count={Number(
                      Math.ceil(
                        paginationData?.total / paginationData?.per_page
                      )
                    )}
                    page={page}
                    variant="outlined"
                    onChange={(_e, pgNum) => setPage(pgNum)}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Paper className={classes.searchPaper} elevation={0}>
                    <Tooltip
                      title={
                        "Filter by can affect your search result. If you can't find project then set filter by to all projects"
                      }
                      arrow
                    >
                      <InputBase
                        className={classes.input}
                        placeholder="Search project by name..."
                        onChange={(e) => {
                          if (e.target.value === "" || e.target.value === null)
                            setSearch("");
                          setSearchInput(e.target.value);
                        }}
                        value={searchInput}
                      />
                    </Tooltip>
                    <Tooltip title={tipTitle("Click to search")} arrow>
                      <IconButton
                        type="submit"
                        className={classes.iconButton}
                        aria-label="search"
                        onClick={() => setSearch(searchInput)}
                      >
                        <Search />
                      </IconButton>
                    </Tooltip>
                  </Paper>
                </div>
              </Grid>
            </Grid>
          </Paper>
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
