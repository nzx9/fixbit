import React, { useEffect } from "react";
import { IconButton, Link } from "@material-ui/core";
import { httpReq } from "../components/httpRequest";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { getUId } from "../reducers/userDataTracker";
import { getToken } from "../reducers/tokenTracker";
import {
  Grid,
  Box,
  CardActionArea,
  Card,
  CardContent,
  CardMedia,
  Backdrop,
  CircularProgress,
  makeStyles,
} from "@material-ui/core/";
import { useFourThreeCardMediaStyles } from "@mui-treasury/styles/cardMedia/fourThree";
import { Info, InfoSubtitle, InfoTitle } from "@mui-treasury/components/info";
import { useApexInfoStyles } from "@mui-treasury/styles/info/apex";
import {
  GitHub,
  Twitter,
  LinkedIn,
  AddCircle,
  Cancel,
} from "@material-ui/icons";
import { NOTIFY, AlertDialog, NewMemberAddAlert } from "../components/notify";
import { DEBUG_PRINT } from "../components/debugTools";
import { randomColor } from "../components/random-color-generator";
import config from "../components/config.json";
import settings from "../components/settings.json";

const useStyles = makeStyles((theme) => ({
  root: {
    float: "left",
    display: "block",
    width: 175,
    height: 250,
    margin: 10,
    [theme.breakpoints.down("sm")]: {
      width: "92%",
      height: "auto",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 200,
    color: theme.palette.primary.main,
  },
  actionArea: {
    borderRadius: 16,
    transition: "0.2s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  card: {
    borderRadius: 16,
    height: 250,
    [theme.breakpoints.down("sm")]: {
      height: "auto",
    },
    "&:hover": {
      boxShadow: `0 6px 12px 0 #dbdb68
        .rotate(-12)
        .darken(0.2)
        .fade(0.5)}`,
    },
  },
  content: ({ color }) => {
    return {
      backgroundColor: color,
      padding: "1rem 1.5rem 1.5rem",
    };
  },
  addNewContent: ({ color }) => {
    return {
      height: 250,
      backgroundColor: color,
      padding: "1rem 1.5rem 1.5rem",
    };
  },
  addNewBtn: () => {
    return {
      color: randomColor(),
      "&:hover": {
        transform: "scale(1.4)",
      },
    };
  },
  closeBtn: {
    color: theme.palette.error.main,
  },
  twitter: {
    color: "#1DA1F2",
    "&:hover": {
      transform: "scale(1.4)",
    },
  },
  linkedIn: {
    color: "#0077B5",
    "&:hover": {
      transform: "scale(1.4)",
    },
  },
  github: {
    color: "#181717",
    "&:hover": {
      transform: "scale(1.4)",
    },
  },
}));

const UserCard = ({
  classes,
  image,
  username,
  fullname,
  tid,
  uid,
  twitter = null,
  linkedIn = null,
  github = null,
  showDelete = false,
  openBackdrop,
  closeBackdrop,
  action,
}) => {
  const mediaStyles = useFourThreeCardMediaStyles();
  const { enqueueSnackbar } = useSnackbar();
  const token = useSelector(getToken);
  return (
    <div className={classes.root}>
      <CardActionArea className={classes.actionArea}>
        <Info useStyles={useApexInfoStyles}>
          <Card className={classes.card}>
            <CardMedia classes={mediaStyles} image={image}>
              {showDelete ? (
                <div style={{ position: "absolute", top: 2, right: 2 }}>
                  <IconButton
                    onClick={() => {
                      openBackdrop();
                      httpReq(
                        `${config.URL}/api/teams/${tid}/members/${uid}`,
                        "DELETE",
                        null,
                        token
                      )
                        .then((res) => {
                          res.json().then((r) => {
                            NOTIFY(r.msg, (msg) => {
                              closeBackdrop();
                              if (msg === null || msg === undefined)
                                msg = r.message;
                              enqueueSnackbar(msg, {
                                variant: r.type,
                                anchorOrigin: settings.snackbar.anchorOrigin,
                              });
                              DEBUG_PRINT(r);
                              if (res.status === 200 && r.success === true)
                                action();
                            });
                          });
                        })
                        .catch((err) => {
                          closeBackdrop();
                          enqueueSnackbar(err?.message, {
                            variant: "error",
                            anchorOrigin: settings.snackbar.anchorOrigin,
                          });
                        });
                    }}
                  >
                    <Cancel
                      fontSize="small"
                      className={classes.closeBtn}
                      style={{ color: "red" }}
                    />
                  </IconButton>
                </div>
              ) : null}
            </CardMedia>
            <CardContent className={classes.content}>
              <InfoTitle className={classes.title}>{username}</InfoTitle>
              <InfoSubtitle className={classes.subtitle}>
                {fullname}
              </InfoSubtitle>
              <Grid container justify="space-between" style={{ marginTop: 30 }}>
                <Grid item>
                  <Link
                    href={`https://twitter.com/${twitter}`}
                    target="_blank"
                    hidden={twitter === null ? true : false}
                  >
                    <Twitter className={classes.twitter} />
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href={`https://linkedin.com/in/${linkedIn}`}
                    target="_blank"
                    hidden={linkedIn === null ? true : false}
                  >
                    <LinkedIn className={classes.linkedIn} />
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href={`https://github.com/${github}`}
                    target="_blank"
                    hidden={github === null ? true : false}
                  >
                    <GitHub className={classes.github} />
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Info>
      </CardActionArea>
    </div>
  );
};

const AddNewCard = ({ classes, handleOpenAddMemberAlert }) => {
  return (
    <div className={classes.root}>
      <CardActionArea className={classes.actionArea}>
        <Card className={classes.card}>
          <CardContent className={classes.addNewContent}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <IconButton
                className={classes.addNewBtn}
                title="Add New Member"
                size="medium"
                onClick={handleOpenAddMemberAlert}
              >
                <AddCircle fontSize="large" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </CardActionArea>
    </div>
  );
};

const ViewTeam = (props) => {
  const classes = useStyles({ color: "#fff" });
  const token = useSelector(getToken);
  const uId = useSelector(getUId);
  const [error, setError] = React.useState(false);
  const [isMDLoaded, setIsMDLoaded] = React.useState(false);
  const [isTDLoaded, setIsTDLoaded] = React.useState(false);
  const [mData, setMData] = React.useState([]);
  const [tData, setTData] = React.useState([]);
  const [alertType, setAlertType] = React.useState();
  const [alertTitle, setAlertTitle] = React.useState();
  const [alertMsg, setAlertMsg] = React.useState();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [addMemberAlert, setAddMemberAlert] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

  const fetchMemberDataAndSet = () => {
    _setOpenBackdrop(true);
    httpReq(
      `${config.URL}/api/teams/${props.match.params.tid}/members`,
      "GET",
      null,
      token
    )
      .then((res) => {
        setIsMDLoaded(true);
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
              r.data !== null ? setMData(r.data) : setMData([]);
            else setError(r.msg);
          });
        });
      })
      .catch((err) => {
        _setOpenBackdrop(false);
        setIsMDLoaded(true);
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
        setError(err.message);
      });
  };

  const fetchTeamDataAndSet = () => {
    _setOpenBackdrop(true);
    httpReq(
      `${config.URL}/api/teams/${props.match.params.tid}`,
      "GET",
      null,
      token
    )
      .then((res) => {
        setIsTDLoaded(true);
        DEBUG_PRINT(res);
        res.json().then((r) => {
          NOTIFY(r.msg, (msg) => {
            _setOpenBackdrop(false);
            if (msg === null || msg === undefined) msg = r.message;
            enqueueSnackbar(msg, {
              variant: r.type === "success" ? "info" : "error",
              anchorOrigin: settings.snackbar.anchorOrigin,
            });
            DEBUG_PRINT(r);
            if (res.status === 200 && r.success === true)
              r.data !== null ? setTData(r.data) : setTData({});
            else setError(r.msg);
          });
        });
      })
      .catch((err) => {
        setIsTDLoaded(true);
        _setOpenBackdrop(false);
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
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchMemberDataAndSet();
    fetchTeamDataAndSet();
  }, []);

  if (error) return <p>Error: {error}</p>;
  else if (!isMDLoaded || !isTDLoaded)
    return (
      <Backdrop className={classes.backdrop} open="true">
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  else
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
          handleAlertClose={() => setAlertOpen(false)}
        />
        <div style={{ marginLeft: "3%" }}>
          {mData.map((value, index) => (
            <UserCard
              key={index}
              classes={classes}
              username={value.info.username}
              fullname={value.info.fullname}
              uid={value.info.id}
              tid={props.match.params.tid}
              twitter={value.info.twitter}
              linkedIn={value.info.linkedIn}
              github={value.info.github}
              openBackdrop={() => _setOpenBackdrop(true)}
              closeBackdrop={() => _setOpenBackdrop(false)}
              action={() => fetchMemberDataAndSet()}
              showDelete={
                uId === tData?.leader_id && value.info.id !== uId ? true : false
              }
              image={`https://ui-avatars.com/api/?name=${value.info.username}&size=256&background=random`}
            />
          ))}
          {uId === tData.leader_id ? (
            <AddNewCard
              key={mData.length + 1}
              classes={classes}
              handleOpenAddMemberAlert={() => setAddMemberAlert(true)}
            />
          ) : null}
        </div>
        <NewMemberAddAlert
          alertOpen={addMemberAlert}
          title="Add Member"
          msg="Enter User ID of the member to add:"
          token={token}
          rejectCallback={() => setAddMemberAlert(false)}
          resolveCallback={(data) => {
            _setOpenBackdrop(true);
            if (data && data.id !== null && data.id !== undefined) {
              httpReq(
                `${config.URL}/api/teams/${props.match.params.tid}/members`,
                "POST",
                { uid: data.id },
                token
              )
                .then((res) => {
                  res.json().then((r) => {
                    NOTIFY(r.msg, (msg) => {
                      _setOpenBackdrop(false);
                      if (msg === null || msg === undefined) msg = r.message;
                      enqueueSnackbar(msg, {
                        variant: r.type,
                        anchorOrigin: settings.snackbar.anchorOrigin,
                      });
                      DEBUG_PRINT(r);
                      if (res.status === 201 && r.success === true)
                        fetchMemberDataAndSet();
                      setAddMemberAlert(false);
                    });
                  });
                })
                .catch((err) => {
                  _setOpenBackdrop(false);
                  enqueueSnackbar(err?.message, {
                    variant: "error",
                    anchorOrigin: settings.snackbar.anchorOrigin,
                  });
                });
              setAddMemberAlert(false);
            }
          }}
        />
      </div>
    );
};

export default ViewTeam;
