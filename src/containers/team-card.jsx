import React, { useCallback } from "react";
import {
  Box,
  Card,
  Button,
  Avatar,
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
import { AlertDialogConfirmation, NOTIFY } from "../components/notify";
import { httpReq } from "../components/httpRequest";
import config from "../components/config.json";
import settings from "../components/settings.json";
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
      content: '""',
      display: "block",
      backgroundColor: "#d9daf1",
      borderRadius: "1rem",
      zIndex: 0,
      bottom: 0,
    },
    "&:hover": {
      "&:before": {
        bottom: -6,
      },
      "& $card": {
        boxShadow: "-12px 12px 64px 0 #bcc3d6",
      },
    },
  },
  grow: {
    flexGrow: 1,
  },
  card: {
    zIndex: 1,
    position: "relative",
    borderRadius: "1rem",
    boxShadow: "0 6px 20px 0 #dbdbe8",
    backgroundColor: "#fff",
    transition: "0.4s",
    height: "100%",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: "0.75rem",
  },
  avatar: {
    fontFamily: "Ubuntu",
    fontSize: "0.875rem",
    backgroundColor: "#6d7efc",
  },
  join: {
    background: "linear-gradient(to top, #638ef0, #82e7fe)",
    "& > *": {
      textTransform: "none !important",
    },
  },
  deleteBtn: {
    color: theme.palette.error.dark,
  },
}));

const TeamCard = (props, joined = false) => {
  const classes = useStyles();
  const history = useHistory();
  const uId = useSelector(getUId);
  const token = useSelector(getToken);
  const { enqueueSnackbar } = useSnackbar();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleAlertClose = () => setAlertOpen(false);

  const goto = useCallback((path) => history.push(path), [history]);
  let leader = props.data.info.leader_id;
  props.data.members.forEach((value) => {
    if (value.is_leader === 1) {
      leader = value.name;
    }
  });
  return (
    <Card className={classes.root}>
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
            props.token
          )
            .then((res) => {
              props.openBackdrop();
              res.json().then((r) => {
                NOTIFY(r.msg, (msg) => {
                  if (msg === null || msg === undefined) msg = r.message;
                  enqueueSnackbar(msg, {
                    variant: r.type,
                    anchorOrigin: settings.snackbar.anchorOrigin,
                  });
                  if (res.status === 200 && r.success === true)
                    props.refetchData();
                });
              });
            })
            .catch((err) => {
              console.log(err);
            });
          handleAlertClose();
          props.closeBackdrop();
        }}
        rejectCallback={() => {
          handleAlertClose();
          props.closeBackdrop();
        }}
      />
      <Column className={classes.card}>
        <Row p={2} gap={2}>
          <Avatar
            className={classes.logo}
            variant={"rounded"}
            src={props.data.thumbnail}
          />
          <Info position={"middle"} useStyles={useApexInfoStyles}>
            <Row>
              <InfoTitle>{props.data.info.name}</InfoTitle>
            </Row>
            <InfoSubtitle>Leader: {leader}</InfoSubtitle>
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
          color={"grey.600"}
          fontSize={"0.875rem"}
          fontFamily={"Ubuntu"}
          style={{ height: 35, overflowY: "scroll" }}
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
                  src={
                    value.profile_pic === null ||
                    value.profile_pic === undefined
                      ? "broken-url.jpg"
                      : value.profile_pic
                  }
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
      </Column>
    </Card>
  );
};

export default TeamCard;
