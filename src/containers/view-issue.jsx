import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Backdrop,
  CircularProgress,
  Container,
  Paper,
  Grid,
  Divider,
  Chip,
  TextField,
  Button,
  Link,
  Typography,
  Fab,
  makeStyles,
} from "@material-ui/core";
import { httpReq, getSync } from "../components/httpRequest";
import { getToken } from "../reducers/tokenTracker";
import { getUId, getUserName } from "../reducers/userDataTracker";
import {
  NOTIFY,
  snackPosition,
  AlertDialogConfirmation,
} from "../components/notify";
import config from "../components/config.json";
import { useSnackbar } from "notistack";
import { DEBUG_PRINT, convertToLocalTime } from "../components/debugTools";
import { Info, InfoTitle, InfoSubtitle } from "@mui-treasury/components/info";
import { useApexInfoStyles } from "@mui-treasury/styles/info/apex";
import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";
import hljs from "highlight.js";
import { Send, Add, Face, ArrowBackIos } from "@material-ui/icons";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@material-ui/lab";
import { newCommentStatus, noNewComment } from "../reducers/newCommentTracker";
import routes from "../routes/routes.json";
import IssueEditDialog from "./issue-edit";
import NotFound from "./not-found";

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
    minHeight: window.screen.availHeight - 370,
    maxHeight: window.screen.availHeight - 186,
    overflowY: "auto",
    color: theme.palette.text.secondary,
    ["& img"]: {
      maxWidth: "100%",
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
    [theme.breakpoints.down("sm")]: {
      maxHeight: "auto",
      minHeight: "auto",
    },
  },
  paperCommentWriter: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: "flex",
    width: "100%",
  },
  paperCommentReader: {
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
    display: "flex",
    width: "100%",
  },
  paperComment: {
    padding: "6px 16px",
    width: "100%",
    overflowX: "auto",
    color: theme.palette.text.secondary,
    ["& all"]: {
      maxWidth: "100%",
    },
    ["& img"]: {
      maxWidth: "100%",
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
  infoPrime: {
    color: theme.palette.text.primary,
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

const ViewIssue = (props) => {
  const classes = useStyles();
  const token = useSelector(getToken);
  const uid = useSelector(getUId);
  const username = useSelector(getUserName);
  const { enqueueSnackbar } = useSnackbar();
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [issueData, setIssueData] = React.useState([]);
  const [teamData, setTeamData] = React.useState([]);
  const [adminData, setAdminData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [notFoundError, setNotFoundError] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [creatorName, setCreatorName] = React.useState("...");
  const [assigneeName, setAssigneeName] = React.useState("...");
  const [comment, setComment] = React.useState("");
  const [alertOpen, setAlertOpen] = React.useState(false);
  const newCommentDetector = useSelector(newCommentStatus);
  const dispatch = useDispatch();

  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

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

  const getRawDescription = () => {
    return { __html: md.render(issueData.description) };
  };

  const getRawComment = (comment) => {
    return { __html: md.render(comment) };
  };

  const handleCommentChange = (e) => setComment(e.target.value);
  const handleAlertClose = () => setAlertOpen(false);

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
              anchorOrigin: snackPosition(),
            });
            if (200 === res.status && true === r.success) {
              DEBUG_PRINT(r.data);
              setIssueData(r.data.issue);
              setAdminData(r.data.admin);
              setTeamData(r.data.team);
            }
            if (
              res.status === 404 ||
              res.status === 401 ||
              res.status === 500
            ) {
              setNotFoundError(true);
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
    if (newCommentDetector) {
      fetchDataAndSet();
      dispatch(noNewComment());
    }
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
              (Number(issueData.creator_id) === uid ? " (Me)" : "")
          );

        if (
          issueData.assign_to === issueData.creator_id &&
          creator?.data !== undefined
        ) {
          setAssigneeName(
            creator?.data?.username +
              (Number(issueData.assign_to) === uid ? " (Me)" : "")
          );
        } else {
          if (issueData.assign_to !== null) {
            const assignee = await getSync(
              `${config.URL}/api/users/user/${issueData.assign_to}`,
              token
            );
            if (assignee?.data !== undefined)
              setAssigneeName(
                assignee?.data?.username +
                  (Number(issueData.assign_to) === uid ? " (Me)" : "")
              );
          } else {
            setAssigneeName("None");
          }
        }
      }
    })();
  }, [newCommentDetector, issueData]);
  if (notFoundError) return <NotFound />;
  else if (error) return <div>Error: {error}</div>;
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
          <Fab
            className={classes.fab}
            variant="extended"
            color="primary"
            onClick={() =>
              goto(routes.PROJECTS_VIEW_X + props.match.params.pid)
            }
          >
            <ArrowBackIos />
            Back
          </Fab>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={3}>
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
                    <Grid container style={{ paddingLeft: 5 }}>
                      <Grid item xs={3}>
                        <InfoSubtitle>CREATED</InfoSubtitle>
                      </Grid>
                      <Grid item xs={9}>
                        :&nbsp;
                        {creatorName}
                      </Grid>
                    </Grid>
                    <Grid container style={{ paddingLeft: 5 }}>
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
                        {convertToLocalTime(issueData.created_at).substr(0, 21)}
                      </Grid>
                    </Grid>
                    <Grid container style={{ paddingLeft: 5 }}>
                      <Grid item xs={3}>
                        <InfoSubtitle>UPDATED</InfoSubtitle>
                      </Grid>
                      <Grid item xs={9}>
                        :&nbsp;
                        {convertToLocalTime(issueData.updated_at).substr(0, 21)}
                      </Grid>
                    </Grid>
                  </Grid>
                </Info>
              </Paper>
              <Paper className={classes.paperCommentWriter}>
                {issueData.creator_id === uid || adminData?.id === uid ? (
                  <>
                    <Grid
                      container
                      spacing={1}
                      style={{ paddingTop: 10, paddingBottom: 10 }}
                    >
                      <Grid item xs={6}>
                        <IssueEditDialog
                          teamInfo={teamData}
                          adminInfo={adminData}
                          issueInfo={issueData}
                          pid={props.match.params.pid}
                          iid={props.match.params.iid}
                          setOpenBackdrop={setOpenBackdrop}
                          action={() => fetchDataAndSet()}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => {
                            setAlertOpen(true);
                          }}
                          className={classes.tag_high}
                        >
                          Delete Issue
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : null}
              </Paper>
            </Grid>
            <Grid item xs={12} md={12} lg={9}>
              <Paper className={classes.paperDesc}>
                <Grid container>
                  <div dangerouslySetInnerHTML={getRawDescription()}></div>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} justify="flex-start" style={{ width: "100%" }}>
              <div className={classes.paperCommentReader}>
                <Timeline
                  align="left"
                  style={{
                    paddingLeft: 0,
                  }}
                >
                  {issueData.comments === undefined ||
                  issueData?.comments === null
                    ? null
                    : issueData.comments.map((value, index) => (
                        <TimelineItem>
                          <TimelineOppositeContent
                            style={{
                              flex: 0.1,
                            }}
                          >
                            <Info useStyles={useApexInfoStyles}>
                              <InfoTitle className={classes.infoPrime}>
                                <b>
                                  {value.username}{" "}
                                  {value.uId === uid ? "(Me)" : ""}
                                </b>
                              </InfoTitle>
                              <InfoSubtitle className={classes.info}>
                                {convertToLocalTime(value.time, false).substr(
                                  4,
                                  17
                                )}
                              </InfoSubtitle>
                            </Info>
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot>
                              <Face />
                            </TimelineDot>
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent style={{ width: 1 }}>
                            <Paper className={classes.paperComment}>
                              <div
                                dangerouslySetInnerHTML={getRawComment(
                                  value.comment
                                )}
                              ></div>
                            </Paper>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                  <TimelineItem>
                    <TimelineOppositeContent
                      style={{
                        flex: issueData.comments === null ? 0.0 : 0.1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      ></Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      ></Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot>
                        <Add color="primary" />
                      </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paperComment}>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            setIsLoaded(false);
                            let _data = issueData;
                            if (_data.comments === null) {
                              _data.comments = [];
                            }
                            let newComment = {
                              uId: uid,
                              username: username,
                              time: Date.now(),
                              comment: comment,
                            };
                            _data.comments.push(newComment);
                            setIssueData(_data);
                            httpReq(
                              `${config.URL}/api/projects/${props.match.params.pid}/issues/${props.match.params.iid}`,
                              "PUT",
                              { comments: newComment },
                              token
                            )
                              .then((res) => {
                                DEBUG_PRINT(res);
                                res.json().then((r) => {
                                  NOTIFY(r.msg, (msg) => {
                                    if (msg === null || msg === undefined)
                                      msg = r.message;
                                    enqueueSnackbar(msg, {
                                      variant: r.type,
                                      anchorOrigin: snackPosition(),
                                    });
                                  });
                                });
                              })
                              .catch((err) => {
                                console.error(err);
                              });
                            setIsLoaded(true);
                            setComment("");
                          }}
                        >
                          <Grid container justify="space-between">
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                multiline
                                variant="outlined"
                                rows={2}
                                rowsMax={100}
                                placeholder="Type your comments here..."
                                value={comment}
                                onChange={handleCommentChange}
                                required
                              />
                            </Grid>
                            <Grid item xs={6} style={{ paddingTop: 5 }}>
                              <Info useStyles={useApexInfoStyles}>
                                <InfoSubtitle className={classes.info}>
                                  <Link
                                    href="https://guides.github.com/features/mastering-markdown/"
                                    target="_blank"
                                  >
                                    Markdown
                                  </Link>{" "}
                                  Supported
                                </InfoSubtitle>
                              </Info>
                            </Grid>
                            <Grid
                              item
                              style={{ paddingTop: 5, paddingBottom: 5 }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                type="submit"
                              >
                                Comment &nbsp;
                                <Send fontSize="small" />
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </div>
            </Grid>
          </Grid>
          <AlertDialogConfirmation
            alertOpen={alertOpen}
            title={`Delete Issue?`}
            type="error"
            msg={`You are going to delete (${issueData.title}). after deleting this issue, it can't be recovered.`}
            resolveCallback={() => {
              httpReq(
                `${config.URL}/api/projects/${props.match.params.pid}/issues/${props.match.params.iid}`,
                "DELETE",
                null,
                token
              )
                .then((res) => {
                  setOpenBackdrop(true);
                  res.json().then((r) => {
                    NOTIFY(r.msg, (msg) => {
                      if (msg === null || msg === undefined) msg = r.message;
                      enqueueSnackbar(msg, {
                        variant: r.type,
                        anchorOrigin: snackPosition(),
                      });
                      if (res.status === 200 && r.success === true)
                        goto(routes.PROJECTS_VIEW_X + props.match.params.pid);
                      setOpenBackdrop(false);
                    });
                  });
                })
                .catch((err) => {
                  console.error(err);
                });
              setOpenBackdrop(false);
              handleAlertClose();
            }}
            rejectCallback={() => {
              handleAlertClose();
              setOpenBackdrop(false);
            }}
          />
        </Container>
      </div>
    );
};

export default ViewIssue;
