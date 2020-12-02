import React, { useEffect } from "react";

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
} from "@material-ui/core";

import { AvatarGroup } from "@material-ui/lab";

import IssueCreateDialog from "./issue-create";
import EditProjectDialog from "./edit-project";
import IssueTable from "./issue-table";

import { httpPOST } from "../components/httpRequest";
import { DEBUG_PRINT } from "../components/debugTools";

import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";
import { getDataChangeStatus } from "../reducers/dataChangeTracker";

import { useSelector, useDispatch } from "react-redux";

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
}));

const project_name = "Apollo 11";
const project_description =
  "This project description is an used only for test porpose";
const team_members = ["navindu", "sandul", "jennive", "gowrisha"];

const ViewProject = () => {
  const classes = useStyles();
  const uId = useSelector(getUId);
  const token = useSelector(getToken);
  const pId = 21; // temp

  const [projectDataAll, setProjectDataAll] = React.useState([]);
  const [projectData, setProjectData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [selectedTopAction, setSelectedTopAction] = React.useState(1);
  const [selectedPriority, setSelectedPriority] = React.useState(null);
  const [selectedBottomAction, setSelectedBottomAction] = React.useState(null);
  const [isDataChanged, setIsDataChanged] = React.useState(
    useSelector(getDataChangeStatus)
  );
  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

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

  const dispatch = useDispatch();

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
      id: 5,
      name: "Critical",
      tag: "critical",
      cls: classes.tag_critical,
      nos: counts.critical,
    },
    {
      id: 4,
      name: "High Priority",
      tag: "high",
      cls: classes.tag_high,
      nos: counts.high,
    },
    {
      id: 3,
      name: "Normal Priority",
      tag: "normal",
      cls: classes.tag_normal,
      nos: counts.normal,
    },
    {
      id: 2,
      name: "Low Priority",
      tag: "low",
      cls: classes.tag_low,
      nos: counts.low,
    },
    {
      id: 1,
      name: "No Priority",
      tag: "none",
      cls: classes.tag_no,
      nos: counts.none,
    },
  ];

  const fetchDataAndSet = () => {
    httpPOST(
      `${window.location.protocol}//${window.location.hostname}/api/issues/allissues.php`,
      {
        uid: uId,
        pid: 21,
        token: token,
      }
    )
      .then((result) => {
        setIsLoaded(true);
        if (result.success) {
          setProjectDataAll(result.data);
          if (selectedTopAction !== null) {
            if (selectedTopAction === 1) {
              setProjectData(result.data);
            }
          } else if (selectedPriority !== null) {
            filterPriority(result.data, "priority", selectedPriority);
          } else if (selectedBottomAction !== null) {
            filterBottomAction(result.data, selectedBottomAction);
          } else {
            setProjectData(result.data);
          }
          let tmpCounts = {
            all: result.data.length,
            critical: 0,
            high: 0,
            normal: 0,
            low: 0,
            none: 0,
            assignedToYou: 0,
            unassigned: 0,
            closed: 0,
          };
          result.data.forEach((element) => {
            if (Number(element.priority) === 1) tmpCounts.none++;
            else if (Number(element.priority) === 2) tmpCounts.low++;
            else if (Number(element.priority) === 3) tmpCounts.normal++;
            else if (Number(element.priority) === 4) tmpCounts.high++;
            else if (Number(element.priority) === 5) tmpCounts.critical++;

            if (Number(element.isOpen) === 1) tmpCounts.closed++;

            if (element.assignedTo === null) tmpCounts.unassigned++;
            else if (Number(element.assignedTo) === Number(uId))
              tmpCounts.assignedToYou++;
          });
          setCounts(tmpCounts);
        }
        DEBUG_PRINT(result);
        DEBUG_PRINT(counts);
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
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
    DEBUG_PRINT("----------");
    DEBUG_PRINT(tmp_list);
    DEBUG_PRINT("----------");
    setProjectData(tmp_list);
  };

  const filterBottomAction = (projectdata, id) => {
    let tmp_list = [];

    if (id === 1) {
      projectdata.forEach((element) => {
        if (Number(element.assignedTo) === Number(uId)) {
          tmp_list.push(element);
        }
      });
    } else if (id === 2) {
      projectdata.forEach((element) => {
        if (element.assignedTo === null) {
          tmp_list.push(element);
        }
      });
    } else if (3) {
      projectdata.forEach((element) => {
        if (Number(element.isOpen) === 1) {
          tmp_list.push(element);
        }
      });
    }
    DEBUG_PRINT("----------");
    DEBUG_PRINT(tmp_list);
    DEBUG_PRINT("----------");
    setProjectData(tmp_list);
  };

  useEffect(() => {
    fetchDataAndSet();
  }, []);

  if (error) return <div>Error: {error}</div>;
  else if (!isLoaded)
    return (
      <div>
        {" "}
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
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={9}>
                      <Typography variant="h5">{project_name}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <EditProjectDialog
                        project_description={project_description}
                      />
                    </Grid>
                  </Grid>
                  <List>
                    <Grid container justify="">
                      <AvatarGroup>
                        {team_members.map((value, index) => {
                          return <Avatar key={index} alt={value} src="_" />;
                        })}
                      </AvatarGroup>
                    </Grid>
                    <br />
                    <IssueCreateDialog
                      uId={uId}
                      pId={pId}
                      token={token}
                      action={() => fetchDataAndSet()}
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
              <IssueTable rows={projectData} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
};

export default ViewProject;
