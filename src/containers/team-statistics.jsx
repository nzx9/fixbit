import React from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  makeStyles,
  withStyles,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import { Cancel, Info } from "@material-ui/icons";

import { DEBUG_PRINT } from "../components/debugTools";
import { httpReq } from "../components/httpRequest";
import config from "../components/config.json";
import { useSelector } from "react-redux";
import { getToken } from "../reducers/tokenTracker";
import { useSnackbar } from "notistack";
import { NOTIFY, snackPosition } from "../components/notify";
import { Chart } from "react-google-charts";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.error.main,
  },
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  gridContainer: {
    marginBottom: theme.spacing(2),
  },
  infoIcon: {
    color: theme.palette.info.main,
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Cancel />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const TeamStatistics = (props) => {
  const classes = useStyles();
  const token = useSelector(getToken);
  const [stats, setStats] = React.useState([]);
  const [timeline, setTimeLine] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    httpReq(`${config.URL}/api/stats/teams/${props.tid}`, "GET", null, token)
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
              if (r.data !== null) {
                if (r.data.data.length > 0) {
                  let tmp = [["Project", "Open", "Closed"]];
                  r.data.data.forEach((value) => {
                    tmp.push([
                      value?.info?.name,
                      value?.open_issue_count,
                      value?.closed_issue_count,
                    ]);
                  });
                  setStats(tmp);
                }
                const keys = Object.keys(r.data.timeline);
                if (keys !== null && keys.length > 0) {
                  let timeline = [["Year-Month", "Open", "Closed"]];
                  keys.forEach((key) => {
                    timeline.push([
                      key,
                      r.data.timeline[key]["open"],
                      r.data.timeline[key]["closed"],
                    ]);
                  });
                  setTimeLine(timeline);
                }
              } else console.error("STAT DATA NULL");
            else setError(r.msg);
            DEBUG_PRINT(r.data);
            setIsLoaded(true);
          });
        });
      })
      .catch((err) => {
        setError(err.toString());
        console.error(err);
      });
  }, []);

  if (error) return <div>Error: {error}</div>;
  else if (!isLoaded)
    return (
      <Dialog open={props.open} maxWidth="sm" fullWidth>
        <DialogTitle
          disableTypography
          className={classes.root}
          onClose={props.handleClose}
        >
          Team Statistics
        </DialogTitle>

        <DialogContent dividers>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress color="inherit" />
          </div>
        </DialogContent>
      </Dialog>
    );
  else
    return (
      <Dialog open={props.open} maxWidth="sm" fullWidth>
        <DialogTitle
          disableTypography
          className={classes.root}
          onClose={props.handleClose}
        >
          Team Statistics
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              {Array.isArray(stats) && stats.length !== 0 ? (
                <Chart
                  width={"100%"}
                  height={"auto"}
                  chartType="BarChart"
                  loader={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress color="inherit" />
                    </div>
                  }
                  data={stats}
                  options={{
                    title: "ISSUES COMPARISON",
                    chartArea: { width: "70%" },
                    hAxis: {
                      minValue: 0,
                      title: "Total Issues",
                      baselineColor:
                        localStorage.theme === "dark" ? "white" : "black",
                      titleTextStyle: {
                        color:
                          localStorage.theme === "dark" ? "white" : "black",
                      },
                      textStyle: {
                        color:
                          localStorage.theme === "dark" ? "white" : "black",
                      },
                    },
                    vAxis: {
                      title: "Project",
                      titleTextStyle: {
                        color:
                          localStorage.theme === "dark" ? "white" : "black",
                      },
                      textStyle: {
                        color:
                          localStorage.theme === "dark" ? "white" : "black",
                      },
                    },
                    legendTextStyle: {
                      color: localStorage.theme === "dark" ? "white" : "black",
                    },
                    titleTextStyle: {
                      color: localStorage.theme === "dark" ? "white" : "black",
                    },
                    backgroundColor:
                      localStorage.theme === "dark" ? "#31373d" : "#fff",
                    colors: ["#4caf50", "#f44336"],
                    annotations: {
                      textStyle: {
                        color: "red",
                      },
                    },
                  }}
                />
              ) : (
                <div
                  style={{
                    marginLeft: 0,
                    marginRight: 0,
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: 40,
                    marginBottom: 80,
                  }}
                >
                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <Info className={classes.infoIcon} />
                    </Grid>
                    <Grid item xs={12}>
                      No data to show
                      <br />
                      Assign team to some projects
                    </Grid>
                  </Grid>
                </div>
              )}
              <br />
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <br />

              {Array.isArray(timeline) && timeline.length !== 0 ? (
                <Chart
                  width={"100%"}
                  height={"auto"}
                  chartType="AreaChart"
                  loader={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress color="inherit" />
                    </div>
                  }
                  data={timeline}
                  options={{
                    title: "ISSUE TIMELINE",
                    hAxis: {
                      title: "Month",
                      titleColor:
                        localStorage.theme === "dark" ? "white" : "black",
                      textStyle: {
                        color:
                          localStorage.theme === "dark" ? "white" : "black",
                      },
                      titleTextStyle: {
                        color:
                          localStorage.theme === "dark" ? "white" : "black",
                      },
                    },
                    vAxis: {
                      minValue: 0,
                      title: "Number of Issues",
                      titleColor:
                        localStorage.theme === "dark" ? "white" : "black",
                      textStyle: {
                        color:
                          localStorage.theme === "dark" ? "white" : "black",
                      },
                    },
                    chartArea: { width: "70%", height: "70%" },
                    legendTextStyle: {
                      color: localStorage.theme === "dark" ? "white" : "black",
                    },
                    titleTextStyle: {
                      color: localStorage.theme === "dark" ? "white" : "black",
                    },
                    backgroundColor:
                      localStorage.theme === "dark" ? "#31373d" : "#fff",
                    colors: ["#4caf50", "#f44336"],
                  }}
                />
              ) : (
                <div
                  style={{
                    marginLeft: 0,
                    marginRight: 0,
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: 40,
                    marginBottom: 80,
                  }}
                >
                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <Info className={classes.infoIcon} />
                    </Grid>
                    <Grid item xs={12}>
                      No issues yet
                      <br />
                      Create some issues
                    </Grid>
                  </Grid>
                </div>
              )}
              <br />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
};

export default TeamStatistics;
