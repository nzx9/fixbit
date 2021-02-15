import React, { useCallback } from "react";
import { getToken } from "../reducers/tokenTracker";
import {
  Container,
  Paper,
  Grid,
  Chip,
  Tooltip,
  Backdrop,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import routes from "../routes/routes.json";
import { httpReq } from "../components/httpRequest";
import config from "../components/config.json";
import { DEBUG_PRINT } from "../components/debugTools";
import { NOTIFY } from "../components/notify";
import { Chart } from "react-google-charts";
import { randomColor } from "../components/random-color-generator";
import { Stars, ArrowRightAlt } from "@material-ui/icons";

const settings = require("../components/settings.json");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
  },
  grow: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(0),
    width: "100%",
    height: window.screen.availHeight / 2 - 110,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  countPaper: {
    padding: theme.spacing(0),
    width: "100%",
    height: window.screen.availHeight / 2 - 110,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    textAlign: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  bigNum: {
    background: theme.palette.primary.main,
    borderRadius: "0.8em",
    color: "#ffffff",
    display: "inline-block",
    fontWeight: "bold",
    lineHeight: "1.6em",
    textAlign: "center",
    padding: 10,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 200,
    color: theme.palette.primary.main,
  },
  tagCritical: {
    backgroundColor: theme.palette.error.dark,
  },
  tagHigh: {
    backgroundColor: theme.palette.error.main,
  },
  tagNormal: {
    backgroundColor: theme.palette.warning.main,
  },
  tagLow: {
    backgroundColor: theme.palette.success.main,
  },
  tagNo: {
    backgroundColor: theme.palette.text.primary,
  },
  textCol: {
    color: theme.palette.text.primary,
  },
}));

const Home = () => {
  const classes = useStyles();
  const token = useSelector(getToken);
  const { enqueueSnackbar } = useSnackbar();
  const [stats, setStats] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  React.useEffect(() => {
    httpReq(`${config.URL}/api/stats`, "GET", null, token)
      .then((res) => {
        DEBUG_PRINT(res);
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            if (msg === null || msg === undefined) msg = r.message;
            enqueueSnackbar(msg, {
              variant: r.type === "success" ? "info" : r.type,
              anchorOrigin: settings.snackbar.anchorOrigin,
            });
            if (res.status === 200 && r.success === true)
              r.data !== null
                ? setStats(r.data)
                : console.error("STAT DATA NULL");
            else setError(r.msg);
            DEBUG_PRINT(r.data);
            setIsLoaded(true);
          });
        });
      })
      .catch((err) => console.error(err));
  }, []);

  if (error) return <div>Error: {error}</div>;
  else if (!isLoaded)
    return (
      <div>
        <Backdrop className={classes.backdrop} open="true">
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  else
    return (
      <div>
        <Container component="main" maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={10} md={11}>
                    <h3 style={{ paddingLeft: 10 }}>Open Issues</h3>
                    <hr />
                  </Grid>
                  <Grid xs={2} md={1}>
                    <div style={{ paddingTop: 17, alignItems: "right" }}>
                      <Chip label={stats.open_issue_count} color="primary" />
                      <hr />
                    </div>
                  </Grid>
                </Grid>
                <ul>
                  {stats.open_issues.map((project, index) => (
                    <li key={"oi_" + index} style={{ listStyleType: "dot" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          overflowX: "auto",
                          overflowY: "auto",
                        }}
                      >
                        <Tooltip title={"Click to view this project"} arrow>
                          <Chip
                            style={{
                              margin: 2,
                              border: "none",
                            }}
                            variant="outlined"
                            size="small"
                            label={project.p_name}
                            clickable
                            onDelete={project.is_admin ? () => null : null}
                            deleteIcon={
                              project.is_admin ? (
                                <Stars style={{ color: "yellow" }} />
                              ) : null
                            }
                            onClick={() =>
                              goto(routes.PROJECTS_VIEW_X + project.pid)
                            }
                          />
                        </Tooltip>
                        <ArrowRightAlt />
                        {project.issues.map((issue, j) => (
                          <Tooltip title="click to view this issue" arrow>
                            <Chip
                              style={{
                                margin: 2,
                              }}
                              className={
                                issue.priority === 0
                                  ? classes.tagNo
                                  : issue.priority === 1
                                  ? classes.tagLow
                                  : issue.priority === 2
                                  ? classes.tagNormal
                                  : issue.priority === 3
                                  ? classes.tagHigh
                                  : classes.tagCritical
                              }
                              variant="default"
                              size="small"
                              label={`${issue.title}`}
                              clickable
                              onClick={() =>
                                goto(
                                  routes.PROJECTS_VIEW_X +
                                    project.pid +
                                    routes.ISSUE_VIEW_X +
                                    issue.iid
                                )
                              }
                            />
                          </Tooltip>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={10} md={11}>
                    <h3 style={{ paddingLeft: 10 }}>Projects Handling</h3>
                    <hr />
                  </Grid>
                  <Grid xs={2} md={1}>
                    <div style={{ paddingTop: 17 }}>
                      <Chip label={stats.projects_in_count} color="primary" />
                      <hr />
                    </div>
                  </Grid>
                </Grid>
                <ul
                  style={{
                    height: 240,
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    overflowX: "auto",
                  }}
                >
                  {stats.projects_in.map((project, index) => (
                    <li style={{ width: 120 }}>
                      <Tooltip
                        title={`You are ${
                          project.is_admin ? "" : "not"
                        } an admin of this project. Click to view`}
                        arrow
                      >
                        <Chip
                          style={{
                            margin: 2,
                            border: "none",
                          }}
                          variant="outlined"
                          size="small"
                          label={project.name}
                          clickable
                          onDelete={project.is_admin ? () => null : null}
                          deleteIcon={
                            project.is_admin ? (
                              <Stars style={{ color: "yellow" }} />
                            ) : null
                          }
                          onClick={() =>
                            goto(routes.PROJECTS_VIEW_X + project.id)
                          }
                        />
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={10} md={11}>
                    <h3 style={{ paddingLeft: 10 }}>Teams Participating</h3>
                    <hr />
                  </Grid>
                  <Grid xs={2} md={1}>
                    <div style={{ paddingTop: 17 }}>
                      <Chip label={stats.teams_in_count} color="primary" />
                      <hr />
                    </div>
                  </Grid>
                </Grid>
                <div style={{ padding: 10 }}>
                  {stats.teams_in.map((team, index) => (
                    <Chip
                      style={{
                        margin: 2,
                        borderColor: randomColor(),
                      }}
                      variant="outlined"
                      size="small"
                      label={team?.name}
                      clickable
                      onDelete={team.is_leader ? () => null : null}
                      deleteIcon={
                        team.is_leader ? (
                          <Stars fontSize="small" style={{ color: "yellow" }} />
                        ) : null
                      }
                    />
                  ))}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={4} md={1}>
              <Paper className={classes.paper}>
                <h3>
                  <span style={{ paddingLeft: 10 }}>Project</span>
                  <br />
                  <span style={{ paddingLeft: 10 }}>Admin</span>
                  <br />
                  <span style={{ paddingLeft: 10 }}>Count</span>
                  <hr />
                </h3>
                <div className={classes.countPaper}>
                  <h2 className={classes.bigNum}>
                    {stats.projects_admin_count}
                  </h2>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={4} md={1}>
              <Paper className={classes.paper}>
                <h3>
                  <span style={{ paddingLeft: 10 }}>Team</span>
                  <br />
                  <span style={{ paddingLeft: 10 }}>Leader</span>
                  <br />
                  <span style={{ paddingLeft: 10 }}>Count</span>
                  <hr />
                </h3>
                <div className={classes.countPaper}>
                  <h2 className={classes.bigNum}>{stats.teams_leader_count}</h2>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={4} md={1}>
              <Paper className={classes.paper}>
                <h3>
                  <span style={{ paddingLeft: 10 }}>Total</span>
                  <br />
                  <span style={{ paddingLeft: 10 }}>Issue</span>
                  <br />
                  <span style={{ paddingLeft: 10 }}>Count</span>
                  <hr />
                </h3>
                <div className={classes.countPaper}>
                  <h2 className={classes.bigNum}>{stats.total_issue_count}</h2>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper className={classes.paper}>
                <Chart
                  style={{ overflowY: "hidden", overflowX: "hidden" }}
                  width={"100%"}
                  height={"100%"}
                  chartType="PieChart"
                  loader={<div>Loading...</div>}
                  data={[
                    ["Type", "Count"],
                    ["Open", stats.open_issue_count],
                    [
                      "Closed",
                      stats.total_issue_count - stats.open_issue_count,
                    ],
                  ]}
                  options={{
                    title: "SUMMERY OF ASSIGNED ISSUES",
                    legendTextStyle: {
                      color: localStorage.theme === "dark" ? "white" : "black",
                    },
                    titleTextStyle: {
                      color: localStorage.theme === "dark" ? "white" : "black",
                    },
                    backgroundColor:
                      localStorage.theme === "dark" ? "#31373d" : "#fff",
                    is3D: false,
                    colors: ["#4caf50", "#f44336"],
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
};

export default Home;
