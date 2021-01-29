import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Backdrop,
  CircularProgress,
  Container,
  Paper,
  Grid,
  Divider,
  Hidden,
  Chip,
  makeStyles,
} from "@material-ui/core";
import { httpReq, getSync } from "../components/httpRequest";
import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";
import { NOTIFY } from "../components/notify";
import config from "../components/config.json";
import settings from "../components/settings.json";
import { useSnackbar } from "notistack";
import { DEBUG_PRINT, convertToLocalTime } from "../components/debugTools";
import { Info, InfoTitle, InfoSubtitle } from "@mui-treasury/components/info";
import { useApexInfoStyles } from "@mui-treasury/styles/info/apex";
import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";
import hljs from "highlight.js";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
  root: {
    flexGrow: 1,
  },
  paperInfo: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "flex",
    width: "100%",
  },
  paperDesc: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "flex",
    width: "100%",
    color: theme.palette.text.secondary,
    ["& img"]: {
      maxWidth: "100%",
    },
    ["& table"]: {
      // border: `1px solid ${theme.palette.text.primary}`,
      // borderRadius: 2,
    },
    ["& th"]: {
      border: `1px solid ${theme.palette.text.primary}`,
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.background.default,
      padding: 4,
    },
    ["& td"]: {
      border: `1px solid ${theme.palette.text.primary}`,
      padding: 4,
    },
    ["& strong"]: {
      color: theme.palette.text.primary,
    },
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
  type: {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.default,
  },
  info: {
    color: theme.palette.text.secondary,
    ["& h3"]: {
      color: theme.palette.text.primary,
    },
    ["& p"]: { color: theme.palette.text.primary },
  },
}));

const ViewIssue = (props) => {
  const classes = useStyles();
  const token = useSelector(getToken);
  const uid = useSelector(getUId);
  const { enqueueSnackbar } = useSnackbar();
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [issueData, setIssueData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [creatorName, setCreatorName] = React.useState("...");
  const [assigneeName, setAssigneeName] = React.useState("...");
  
  var md = new Remarkable("full", {
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: "language-", // CSS language prefix for fenced blocks
    linkTarget: "__blank", // set target to open link in

    // Enable some language-neutral replacements + quotes beautification
    typographer: false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: "“”‘’",

    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (__) {}

      return ""; // use external default escaping
    },
  }).use(linkify);

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
            if (msg === null || msg === undefined) msg = r.message;
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
    if (issueData.length === 0) fetchDataAndSet();
    (async function () {
      if (issueData.creator_id !== undefined) {
        const creator = await getSync(
          `${config.URL}/api/users/user/${issueData.creator_id}`,
          token
        );
        if (creator?.data !== undefined)
          setCreatorName(
            creator?.data?.username +
              (issueData.creator_id === uid ? " (Me)" : "")
          );

        if (
          issueData.assign_to === issueData.creator_id &&
          creator?.data !== undefined
        ) {
          setAssigneeName(creator?.data?.username + " (Me)");
        } else {
          if (issueData.assign_to !== null) {
            const assignee = await getSync(
              `${config.URL}/api/users/user/${issueData.assign_to}`,
              token
            );
            if (assignee?.data !== undefined)
              setAssigneeName(
                assignee?.data?.username +
                  (issueData.assign_to === uid ? " (Me)" : "")
              );
          } else {
            setAssigneeName("None");
          }
        }
      }
    })();
  }, [issueData]);
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
                <Paper className={classes.paperInfo}>
                  <Info useStyles={useApexInfoStyles} className={classes.info}>
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
                      <Grid container style={{ paddingLeft: 5, marginTop: 5 }}>
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
                      <Grid container style={{ paddingLeft: 5, marginTop: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>PRIORITY</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;
                          {issueData.priority === 0 ? (
                            <Chip
                              size="small"
                              label="none"
                              variant="outlined"
                              className={classes.tag_none}
                            />
                          ) : issueData.priority === 1 ? (
                            <Chip
                              size="small"
                              label="low"
                              variant="outlined"
                              className={classes.tag_low}
                            />
                          ) : issueData.priority === 2 ? (
                            <Chip
                              size="small"
                              label="normal"
                              variant="outlined"
                              className={classes.tag_normal}
                            />
                          ) : issueData.priority === 3 ? (
                            <Chip
                              size="small"
                              label="high"
                              variant="outlined"
                              className={classes.tag_high}
                            />
                          ) : (
                            <Chip
                              size="small"
                              label="critical"
                              variant="outlined"
                              className={classes.tag_critical}
                            />
                          )}
                        </Grid>
                      </Grid>
                      <Grid container style={{ paddingLeft: 5, marginTop: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>TYPE</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;
                          {
                            <Chip
                              size="small"
                              label={
                                issueData.type === 0
                                  ? "NONE"
                                  : issueData.type === 1
                                  ? "BUG"
                                  : issueData.type === 2
                                  ? "SECURITY"
                                  : issueData.type === 3
                                  ? "TO TEST"
                                  : "OTHER"
                              }
                              variant="default"
                              className={classes.type}
                            />
                          }
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
                          {creatorName}
                        </Grid>
                      </Grid>
                      <Grid container container style={{ paddingLeft: 5 }}>
                        <Grid item xs={3}>
                          <InfoSubtitle>ASSIGNED</InfoSubtitle>
                        </Grid>
                        <Grid item xs={9}>
                          :&nbsp;
                          {assigneeName}
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
              <Paper className={classes.paperDesc}>
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
