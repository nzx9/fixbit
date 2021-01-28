import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Backdrop,
  CircularProgress,
  Container,
  Paper,
  Badge,
  Grid,
  TextField,
  Divider,
  Hidden,
  Chip,
  makeStyles,
} from "@material-ui/core";
import { httpReq } from "../components/httpRequest";
import { getToken } from "../reducers/tokenTracker";
import { NOTIFY } from "../components/notify";
import config from "../components/config.json";
import settings from "../components/settings.json";
import { useSnackbar } from "notistack";
import { DEBUG_PRINT, convertToLocalTime } from "../components/debugTools";
import { Info, InfoTitle, InfoSubtitle } from "@mui-treasury/components/info";
import { FiberManualRecord } from "@material-ui/icons";
import ChatMsg from "@mui-treasury/components/chatMsg/ChatMsg";
import { useApexInfoStyles } from "@mui-treasury/styles/info/apex";
import hljs from "highlight.js";
import { Remarkable } from "remarkable";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: "100%",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    display: "flex",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  open: {
    color: theme.palette.grey[200],
    backgroundColor: theme.palette.success.main,
  },
  closed: {
    color: theme.palette.grey[200],
    backgroundColor: theme.palette.error.main,
  },
}));

const ViewIssue = (props) => {
  const classes = useStyles();
  const token = useSelector(getToken);
  const { enqueueSnackbar } = useSnackbar();
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [issueData, setIssueData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  var md = new Remarkable({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {}
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {}

      return ""; // use external default escaping
    },
  });

  const bullet = <span className={classes.bullet}>•</span>;

  const getRawDescription = () => {
    return { __html: md.render(issueData.description) };
  };

  const fetchDataAndSet = () => {
    setOpenBackdrop(true);
    httpReq(
      `${config.URL}/api/projects/${props.match.params.pid}/issues/${props.match.params.iid}`,
      "GET",
      null,
      token
    )
      .then((res) => {
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            DEBUG_PRINT(r);
            setOpenBackdrop(false);
            enqueueSnackbar(msg, {
              variant: r.type,
              anchorOrigin: settings.snackbar.anchorOrigin,
            });
            if (201 === res.status && true === r.success) {
              setIssueData(r.data);
            }
          });
          setIsLoaded(true);
        });
      })
      .catch((err) => {
        setOpenBackdrop(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchDataAndSet();
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
      <div className={classes.root}>
        <Container component="main" maxWidth="xl">
          <Grid container spacing={1}>
            <Grid item xs={0} md={0} lg={3}>
              <Hidden mdDown>
                <Paper className={classes.paper}>
                  <Info useStyles={useApexInfoStyles}>
                    <Grid container style={{ paddingLeft: 5 }}>
                      <InfoTitle style={{ width: "100%" }}>
                        <h3 style={{ width: "98%" }}>
                          INFO
                          <Divider variant="fullWidth" />
                        </h3>
                      </InfoTitle>
                      <Grid container style={{ paddingLeft: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>ISSUE ID</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;#{issueData.id}
                        </Grid>
                      </Grid>
                      <Grid container style={{ paddingLeft: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>TITLE</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;
                          {issueData.title}
                        </Grid>
                      </Grid>
                      <Grid container style={{ paddingLeft: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>STATUS</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;
                          {issueData.is_open ? (
                            <Chip
                              size="small"
                              label="OPEN"
                              variant="default"
                              className={classes.open}
                            />
                          ) : (
                            <Chip
                              size="small"
                              label="CLOSED"
                              variant="default"
                              className={classes.closed}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container style={{ paddingLeft: 5 }}>
                      <InfoTitle style={{ width: "100%" }}>
                        <h3 style={{ width: "98%" }}>
                          PEOPLE
                          <Divider variant="fullWidth" />
                        </h3>
                      </InfoTitle>
                      <Grid container container style={{ paddingLeft: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>CREATED</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;
                          {issueData.creator_id}
                        </Grid>
                      </Grid>
                      <Grid container container style={{ paddingLeft: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>ASSIGNED</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;
                          {issueData.assign_to === null
                            ? "None"
                            : issueData.assign_to}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container style={{ paddingLeft: 5 }}>
                      <InfoTitle style={{ width: "100%" }}>
                        <h3 style={{ width: "98%" }}>
                          DATES
                          <Divider variant="fullWidth" />
                        </h3>
                      </InfoTitle>
                      <Grid container style={{ paddingLeft: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>CREATED</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;
                          {convertToLocalTime(issueData.created_at).substr(
                            0,
                            21
                          )}
                        </Grid>
                      </Grid>
                      <Grid container style={{ paddingLeft: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>UPDATED</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;
                          {convertToLocalTime(issueData.updated_at).substr(
                            0,
                            21
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Info>
                </Paper>
              </Hidden>
            </Grid>
            <Grid item xs={12} md={12} lg={9}>
              <Paper className={classes.paper}>
                <Grid container>
                  <div dangerouslySetInnerHTML={getRawDescription()}></div>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
};

export default ViewIssue;
