import React, { useCallback, useEffect } from "react";
import {
  Box,
  Card,
  Button,
  Avatar,
  CardActionArea,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { Column, Row, Item } from "@mui-treasury/components/flex";
import { Info, InfoSubtitle, InfoTitle } from "@mui-treasury/components/info";
import { useApexInfoStyles } from "@mui-treasury/styles/info/apex";
import { useHistory } from "react-router-dom";
import routes from "../routes/routes.json";
import { Delete } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";
import {
  AlertDialogConfirmation,
  NOTIFY,
  snackPosition,
} from "../components/notify";
import { httpReq, getSync } from "../components/httpRequest";
import config from "../components/config.json";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    float: "left",
    width: "275px",
    transition: "0.3s",
    margin: theme.spacing(1),
    position: "relative",
    "&:before": {
      transition: "0.2s",
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "block",
      borderRadius: "1rem",
      zIndex: 0,
      bottom: 0,
    },
    [theme.breakpoints.down("sm")]: {
      width: "93%",
    },
  },
  grow: {
    flexGrow: 1,
  },
  card: {
    zIndex: 1,
    position: "relative",
    borderRadius: "1rem",
    transition: "0.4s",
    height: "100%",
  },
  actionArea: {
    borderRadius: "1rem",
    transition: "0.2s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: "0.75rem",
  },
  avatar: {
    fontFamily: "Ubuntu",
    fontSize: "0.875rem",
    border: 0,
  },
  deleteBtn: {
    color: theme.palette.error.main,
  },
  info: {
    color: theme.palette.text.secondary,
    ["& h6"]: { color: theme.palette.text.primary },
    ["& p"]: { color: theme.palette.text.secondary },
  },
  box: {
    color: theme.palette.text.secondary,
  },
}));

const TeamCard = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const uId = useSelector(getUId);
  const token = useSelector(getToken);
  const { enqueueSnackbar } = useSnackbar();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleAlertClose = () => setAlertOpen(false);

  const goto = useCallback((path) => history.push(path), [history]);
  const [leaderName, setLeaderName] = React.useState("...");

  useEffect(() => {
    (async function () {
      if (props?.data?.info?.leader_id !== undefined) {
        const leader = await getSync(
          `${config.URL}/api/users/user/${props.data.info.leader_id}`,
          token
        );
        if (leader?.data !== undefined) setLeaderName(leader?.data?.username);
      }
    })();
  }, []);

  return (
    <div className={classes.root}>
      <AlertDialogConfirmation
        alertOpen={alertOpen}
        title={`Delete Team?`}
        type="error"
        msg={`You are going to delete (${props.data.info.name}). after deleting the team it can't be recovered.`}
        resolveCallback={() => {
          httpReq(
            `${config.URL}/api/teams/${props.data.info.id}`,
            "DELETE",
            null,
            token
          )
            .then((res) => {
              props.openBackdrop();
              res.json().then((r) => {
                NOTIFY(r.msg, (msg) => {
                  if (msg === null || msg === undefined) msg = r.message;
                  enqueueSnackbar(msg, {
                    variant: r.type,
                    anchorOrigin: snackPosition(),
                  });
                  if (res.status === 200 && r.success === true)
                    props.refetchData();
                  props.closeBackdrop();
                });
              });
            })
            .catch((err) => {
              console.error(err);
            });
          props.closeBackdrop();
          handleAlertClose();
        }}
        rejectCallback={() => {
          handleAlertClose();
          props.closeBackdrop();
        }}
      />
      <CardActionArea className={classes.actionArea}>
        <Card className={classes.card}>
          <Row p={2} gap={2}>
            <Avatar
              className={classes.logo}
              variant={"rounded"}
              src={props.data.thumbnail}
            />
            <Info
              position={"middle"}
              useStyles={useApexInfoStyles}
              className={classes.info}
            >
              <Row>
                <InfoTitle>{props.data.info.name}</InfoTitle>
              </Row>
              <InfoSubtitle>
                <b>Leader: </b> {leaderName}
              </InfoSubtitle>
            </Info>
            <div className={classes.grow} />
            <Column>
              {props.data.info.leader_id === uId ? (
                <IconButton
                  size="small"
                  className={classes.deleteBtn}
                  onClick={() => setAlertOpen(true)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              ) : null}
            </Column>
          </Row>
          <Box
            pb={0}
            px={2}
            fontSize={"0.875rem"}
            fontFamily={"Ubuntu"}
            style={{ height: 40, overflowY: "scroll" }}
            className={classes.box}
          >
            {props.data.info.description}
          </Box>
          <Row p={1} gap={2} position={"bottom"}>
            <Item>
              <AvatarGroup max={5} classes={{ avatar: classes.avatar }}>
                {props.data.members.map((value, index) => (
                  <Avatar
                    key={index}
                    alt={value.name}
                    src={`https://ui-avatars.com/api/?name=${value.name}&size=64&background=random&rounded=true`}
                  />
                ))}
              </AvatarGroup>
            </Item>
            <Item position={"middle-right"}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => goto(routes.TEAMS_VIEW_X + props.data.info.id)}
              >
                View
              </Button>
            </Item>
          </Row>
        </Card>
      </CardActionArea>
    </div>
  );
};

export default TeamCard;
