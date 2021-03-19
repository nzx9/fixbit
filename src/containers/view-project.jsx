import React, { useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  makeStyles,
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Backdrop,
  CircularProgress,
  Fab,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import IssueCreateDialog from "./issue-create";
import EditProjectDialog from "./edit-project";
import { httpReq } from "../components/httpRequest";
import { DEBUG_PRINT } from "../components/debugTools";
import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import IssueTable from "./issue-table";
import ViewIssue from "./view-issue";
import routes from "../routes/routes.json";
import config from "../components/config.json";
import { NOTIFY, AlertDialog, snackPosition } from "../components/notify";
import { useSnackbar } from "notistack";
import NotFound from "./not-found";
import { Info, InfoSubtitle } from "@mui-treasury/components/info";
import { useApexInfoStyles } from "@mui-treasury/styles/info/apex";
import { useHistory } from "react-router-dom";
import { ArrowBackIos } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      marginTop: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  typography: {
    padding: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
  tag_critical: {
    color: theme.palette.error.dark,
    borderColor: theme.palette.error.dark,
  },
  tag_high: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
  tag_normal: {
    color: theme.palette.warning.main,
    borderColor: theme.palette.warning.main,
  },
  tag_low: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
  },
  tag_no: {
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.primary,
  },
  avatarGroup: {
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.1)",
    },
  },
  infoPrimary: {
    color: theme.palette.text.primary,
  },
  infoSecondary: {
    color: theme.palette.text.secondary,
  },
  fab: {
    display: "flex",
    position: "fixed",
    zIndex: 9999,
    bottom: theme.spacing(3),
    left: theme.spacing(2),
    transition: "0.2s",
    "&:before": {
      transition: "0.3s",
    },
  },
}));

const ViewProject = (props) => {
  const classes = useStyles();
  const uId = useSelector(getUId);
  const token = useSelector(getToken);

  const [projectDataAll, setProjectDataAll] = React.useState([]);
  const [projectData, setProjectData] = React.useState([]);
  const [teamsInfo, setTeamsInfo] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoadedII, setIsLoadedII] = React.useState(false);
  const [isLoadedPI, setIsLoadedPI] = React.useState(false);
  const [isLoadedTI, setIsLoadedTI] = React.useState(false);
  const [selectedTopAction, setSelectedTopAction] = React.useState(1);
  const [selectedPriority, setSelectedPriority] = React.useState(null);
  const [selectedBottomAction, setSelectedBottomAction] = React.useState(null);
  const [notFoundError, setNotFoundError] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState(null);
  const [alertTitle, setAlertTitle] = React.useState(null);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const [projectInfo, setProjectInfo] = React.useState({
    project: {
      name: "",
      description: "",
      created_at: null,
      updated_at: null,
    },
    team: {
      info: null,
      members: null,
    },
    admin: {
      id: null,
      username: null,
      fullname: null,
    },
  });
  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);
  const handleAlertClose = () => setAlertOpen(false);
  const { enqueueSnackbar } = useSnackbar();
  const [counts, setCounts] = React.useState({
    all: 0,
    critical: 0,
    high: 0,
    normal: 0,
    low: 0,
    none: 0,
    assignedToYou: 0,
    unassigned: 0,
    closed: 0,
  });
  const [isNewIssue, setIsNewIssue] = React.useState(false);

  const top_action_list = [
    {
      id: 1,
      name: "All",
      nos: counts.all,
    },
  ];

  const bottom_action_list = [
    {
      id: 1,
      name: "Assigned To You",
      nos: counts.assignedToYou,
    },
    {
      id: 2,
      name: "Unassigned",
      nos: counts.unassigned,
    },
    {
      id: 3,
      name: "Closed",
      nos: counts.closed,
    },
  ];

  const priority_list = [
    {
      id: 4,
      name: "Critical",
      tag: "critical",
      cls: classes.tag_critical,
      nos: counts.critical,
    },
    {
      id: 3,
      name: "High Priority",
      tag: "high",
      cls: classes.tag_high,
      nos: counts.high,
    },
    {
      id: 2,
      name: "Normal Priority",
      tag: "normal",
      cls: classes.tag_normal,
      nos: counts.normal,
    },
    {
      id: 1,
      name: "Low Priority",
      tag: "low",
      cls: classes.tag_low,
      nos: counts.low,
    },
    {
      id: 0,
      name: "No Priority",
      tag: "none",
      cls: classes.tag_no,
      nos: counts.none,
    },
  ];

  const fetchTeamsInfo = () => {
    httpReq(`${config.URL}/api/teams`, "GET", null, token)
      .then((res) => {
        DEBUG_PRINT(res);
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            if (msg === null || msg === undefined) {
              msg = r.message;
              r.type = "error";
            }
            if (
              r.type !== "info" ||
              localStorage.getItem("disp_info_snacks") === "true"
            )
              enqueueSnackbar(msg, {
                variant: r.type !== "error" ? "info" : "error",
                anchorOrigin: snackPosition(),
              });
            if (res.status === 200 && r.success === true)
              r.data !== null ? setTeamsInfo(r.data) : setTeamsInfo([]);
            else setError(r.msg);
            setIsLoadedTI(true);
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
        setIsLoadedTI(true);
      });
  };

  const fetchProjectInfo = () => {
    httpReq(
      `${config.URL}/api/projects/${props.match.params.pid}`,
      "GET",
      null,
      token
    )
      .then((res) => {
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            if (msg === null || msg === undefined) {
              msg = r.message;
              r.type = "error";
            }
            if (
              r.type !== "info" ||
              localStorage.getItem("disp_info_snacks") === "true"
            )
              enqueueSnackbar(msg, {
                variant: r.type,
                anchorOrigin: snackPosition(),
              });
            if (res.status === 200 && r.success === true)
              r.data !== null
                ? setProjectInfo(r.data)
                : setProjectInfo({
                    project: {
                      name: "",
                      team_id: null,
                      description: "",
                      created_at: null,
                      updated_at: null,
                    },
                    team: {
                      info: null,
                      members: null,
                    },
                    admin: {
                      id: null,
                      username: null,
                      fullname: null,
                    },
                  });
            else setError(r.msg);
            setIsLoadedPI(true);
          });
        });
        if (res.status === 404 || res.status === 401) {
          setNotFoundError(true);
        }
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
        setIsLoadedPI(true);
        setError(err.toString());
      });
  };

  const fetchDataAndSet = () => {
    httpReq(
      `${config.URL}/api/projects/${props.match.params.pid}/issues`,
      "GET",
      null,
      token
    )
      .then((res) => {
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            if (msg === null || msg === undefined) msg = r.message;
            _setOpenBackdrop(false);
            if (
              r.type !== "info" ||
              localStorage.getItem("disp_info_snacks") === "true"
            )
              enqueueSnackbar(msg, {
                variant: r.type,
                anchorOrigin: snackPosition(),
              });
            if (res.status === 200 && r.success === true) {
              setProjectDataAll(r.data);
              setProjectData(r.data);
              setSelectedPriority(null);
              setSelectedBottomAction(null);
              setSelectedTopAction(1);
              // if (selectedTopAction !== null) {
              //   if (selectedTopAction === 1) {
              //   }
              // } else if (selectedPriority !== null) {
              //   filterPriority(r.data, "priority", selectedPriority);
              // } else if (selectedBottomAction !== null) {
              //   filterBottomAction(r.data, selectedBottomAction);
              // } else {
              //   setProjectData(r.data);
              // }
              let tmpCounts = {
                all: r.data.length,
                critical: 0,
                high: 0,
                normal: 0,
                low: 0,
                none: 0,
                assignedToYou: 0,
                unassigned: 0,
                closed: 0,
              };
              r.data.forEach((element) => {
                if (Number(element.priority) === 0) tmpCounts.none++;
                else if (Number(element.priority) === 1) tmpCounts.low++;
                else if (Number(element.priority) === 2) tmpCounts.normal++;
                else if (Number(element.priority) === 3) tmpCounts.high++;
                else if (Number(element.priority) === 4) tmpCounts.critical++;

                if (Boolean(element.is_open) === false) tmpCounts.closed++;

                if (element.assign_to === null) tmpCounts.unassigned++;
                else if (Number(element.assign_to) === Number(uId))
                  tmpCounts.assignedToYou++;
              });
              setCounts(tmpCounts);
            } else {
              setProjectData([]);
            }
            setIsLoadedII(true);
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
        setIsLoadedII(true);
        setError(err);
      });
  };

  const setOpenBackdrop = (value) => {
    _setOpenBackdrop(value);
  };

  const filterPriority = (projectdata, id) => {
    let tmp_list = [];
    projectdata.forEach((element) => {
      if (Number(element.priority) === id) {
        tmp_list.push(element);
      }
    });
    setProjectData(tmp_list);
  };

  const filterBottomAction = (projectdata, id) => {
    let tmp_list = [];

    if (id === 1) {
      projectdata.forEach((element) => {
        if (Number(element.assign_to) === Number(uId)) {
          tmp_list.push(element);
        }
      });
    } else if (id === 2) {
      projectdata.forEach((element) => {
        if (element.assign_to === null) {
          tmp_list.push(element);
        }
      });
    } else if (id === 3) {
      projectdata.forEach((element) => {
        if (Boolean(element.is_open) === false) {
          tmp_list.push(element);
        }
      });
    }
    setProjectData(tmp_list);
  };

  const setNewIssue = () => setIsNewIssue(true);
  const setNewIssueNot = () => setIsNewIssue(false);

  useEffect(() => {
    fetchTeamsInfo();
    fetchProjectInfo();
    fetchDataAndSet();
  }, []);

  if (notFoundError) return <NotFound />;
  else if (error)
    return (
      <div style={{ margin: "0 auto", width: "300px" }}>
        <h1>{error}</h1>
      </div>
    );
  else if (!isLoadedPI || !isLoadedII || !isLoadedTI)
    return (
      <div>
        <Backdrop className={classes.backdrop} open="true">
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  else
    return (
      <Container component="main" maxWidth="xl">
        <Backdrop className={classes.backdrop} open={_openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Fab
          className={classes.fab}
          variant="extended"
          color="primary"
          onClick={() => goto(routes.PROJECTS)}
        >
          <ArrowBackIos />
          Back
        </Fab>
        <AlertDialog
          alertOpen={alertOpen}
          title={alertTitle}
          type={alertType}
          msg={alertMsg}
          handleAlertClose={() => handleAlertClose()}
        />
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs={12}>
                  <Grid container justify="space-between">
                    <Grid item xs={8}>
                      <Typography variant="h5" className={classes.infoPrimary}>
                        {projectInfo.project.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <EditProjectDialog
                        teamsInfo={teamsInfo}
                        projectInfo={projectInfo}
                        action={() => fetchProjectInfo()}
                      />
                    </Grid>
                  </Grid>
                  <List>
                    <Grid container justify="">
                      {projectInfo.team.info !== null &&
                      projectInfo.team.members !== null ? (
                        <AvatarGroup
                          className={classes.avatarGroup}
                          onClick={() => {
                            goto(
                              routes.TEAMS_VIEW_X + projectInfo.project.team_id
                            );
                          }}
                        >
                          {projectInfo.team.members.map((value, index) => {
                            return (
                              <Avatar
                                key={index}
                                alt={value.name}
                                src={`https://ui-avatars.com/api/?name=${value.name}&size=64&background=random&rounded=true`}
                              />
                            );
                          })}
                        </AvatarGroup>
                      ) : (
                        <Info useStyles={useApexInfoStyles}>
                          <InfoSubtitle className={classes.infoSecondary}>
                            No team assigned
                          </InfoSubtitle>
                        </Info>
                      )}
                    </Grid>
                    <br />
                    <IssueCreateDialog
                      pId={props.match.params.pid}
                      projectInfo={projectInfo}
                      token={token}
                      action={() => fetchDataAndSet()}
                      newIssue={() => setNewIssue()}
                      setOpenBackdrop={() => setOpenBackdrop()}
                    />
                  </List>
                  <Divider />
                  <List>
                    {top_action_list.map((value, index) => (
                      <ListItem
                        button
                        key={value.id}
                        onClick={() => {
                          setProjectData(projectDataAll);
                          setSelectedPriority(null);
                          setSelectedBottomAction(null);
                          setSelectedTopAction(1);
                        }}
                        selected={selectedTopAction === value.id ? true : false}
                      >
                        <ListItemText
                          style={{ width: "80%" }}
                          primary={value.name}
                        />
                        <ListItemText
                          style={{ maxWidth: "20%", textAlign: "right" }}
                          primary={value.nos}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <List>
                    {priority_list.map((value, index) => (
                      <ListItem
                        button
                        key={value.id}
                        onClick={() => {
                          filterPriority(projectDataAll, value.id);
                          setSelectedTopAction(null);
                          setSelectedBottomAction(null);
                          setSelectedPriority(value.id);
                        }}
                        selected={value.id === selectedPriority ? true : false}
                      >
                        <ListItemText
                          style={{ minWidth: "40%" }}
                          primary={value.name}
                        />
                        <Chip
                          size="small"
                          label={value.tag}
                          variant="outlined"
                          className={value.cls}
                        />

                        <ListItemText
                          style={{ maxWidth: "15%", textAlign: "right" }}
                          primary={value.nos}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <List>
                    {bottom_action_list.map((value, index) => (
                      <ListItem
                        button
                        key={value.name}
                        onClick={() => {
                          filterBottomAction(projectDataAll, value.id);
                          setSelectedTopAction(null);
                          setSelectedPriority(null);
                          setSelectedBottomAction(value.id);
                        }}
                        selected={
                          value.id === selectedBottomAction ? true : false
                        }
                      >
                        <ListItemText
                          style={{ width: "80%" }}
                          primary={value.name}
                        />
                        <ListItemText
                          style={{ maxWidth: "20%", textAlign: "right" }}
                          primary={value.nos}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            md={9}
            style={{ maxHeight: "100%", overflowY: "hidden" }}
          >
            <Paper className={classes.paper}>
              <Switch>
                <Route path={routes.ISSUE_VIEW} component={ViewIssue} />
                <Route
                  path={routes.PROJECTS_VIEW}
                  children={
                    <IssueTable
                      uId={uId}
                      token={token}
                      action={() => fetchDataAndSet()}
                      projectInfo={projectInfo}
                      rows={projectData}
                      pId={props.match.params.pid}
                      noNewIssue={() => setNewIssueNot()}
                      newIssue={isNewIssue}
                    />
                  }
                />
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
};

export default ViewProject;
