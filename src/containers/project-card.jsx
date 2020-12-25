import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Card,
  Button,
  Avatar,
  Slider,
  Menu,
  MenuItem,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { Column, Row, Item } from "@mui-treasury/components/flex";
import { Info, InfoSubtitle, InfoTitle } from "@mui-treasury/components/info";
import { useApexInfoStyles } from "@mui-treasury/styles/info/apex";
import {
  DeleteForever,
  Edit,
  ExpandLessRounded,
  ExpandMoreRounded,
  FiberManualRecord,
  Group,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import { getUId } from "../reducers/userDataTracker";
import routes from "../routes/routes.json";
import { NOTIFY, AlertDialogConfirmation } from "../components/notify";
import { httpReq } from "../components/httpRequest";
import config from "../components/config.json";
import settings from "../components/settings.json";
import { useSnackbar } from "notistack";
import { randomColor } from "../components/random-color-generator";
import { convetToLocalTime } from "../components/debugTools";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "250",
    float: "left",
    width: "275px",
    transition: "0.3s",
    margin: theme.spacing(1),
    position: "relative",
    "&:before": {
      transition: "0.2s",
      position: "absolute",
      width: "100%",
      height: "250",
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
    boxShadow: "0 6px 20px 0 #dbdbe8",
    backgroundColor: "#fff",
    transition: "0.4s",
    height: "100%",
  },
  avatar: {
    fontFamily: "Ubuntu",
    fontSize: "0.875rem",
    backgroundColor: "#6d7efc",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: "0.75rem",
  },
  join: {
    background: "linear-gradient(to top, #638ef0, #82e7fe)",
    "& > *": {
      textTransform: "none !important",
    },
  },
  deleteItem: {
    color: theme.palette.error.dark,
  },
  publicProject: {
    color: theme.palette.success.main,
  },
  privateProject: {
    color: theme.palette.error.main,
  },
}));

const useSliderStyles = makeStyles(() => ({
  root: {
    height: 4,
  },
  rail: {
    borderRadius: 10,
    height: 4,
    backgroundColor: "rgb(202,211,216)",
  },
  track: {
    borderRadius: 10,
    height: 4,
    backgroundColor: "rgb(117,156,250)",
  },
  thumb: {
    display: "none",
  },
}));

const ProjectCard = (props, joined = false) => {
  const classes = useStyles();
  const sliderStyles = useSliderStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const uid = useSelector(getUId);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleAlertClose = () => setAlertOpen(false);

  const renderMenu = (
    <Menu
      getContentAnchorEl={null}
      anchorEl={anchorEl}
      id="profile-menu"
      keepMounted
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {props.data.project.team_id !== null ? (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            goto(routes.TEAMS_VIEW_X + props.data.project.team_id);
          }}
        >
          <Group />
          &ensp;View Team
        </MenuItem>
      ) : (
        <></>
      )}
      {Number(props.data.project.admin_id) === Number(uid) ? (
        <>
          <MenuItem
            onClick={() => {
              handleMenuClose();
            }}
          >
            <Edit /> &ensp; Edit Project
          </MenuItem>
          <MenuItem
            className={classes.deleteItem}
            onClick={() => {
              setAlertOpen(true);
              handleMenuClose();
            }}
          >
            <DeleteForever /> &ensp; Delete
          </MenuItem>
        </>
      ) : (
        <></>
      )}
    </Menu>
  );

  return (
    <Card className={classes.root}>
      <AlertDialogConfirmation
        alertOpen={alertOpen}
        title="Delete Project?"
        type="error"
        msg={`You are going to delete (${props.data.project.name}) project. after deleting the project it can't be recovered.`}
        resolveCallback={() => {
          httpReq(
            `${config.URL}/api/projects/${props.data.project.id}`,
            "DELETE",
            null,
            props.token
          )
            .then((res) => {
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
                handleAlertClose();
              });
            })
            .catch((err) => {
              console.log(err);
              handleAlertClose();
            });
        }}
        rejectCallback={() => {
          handleAlertClose();
        }}
      />
      <Column className={classes.card}>
        <Row px={1} gap={2}>
          <Column>
            <Info position={"middle"} useStyles={useApexInfoStyles}>
              <InfoTitle>
                {props.data.project.name}
                <span>
                  <IconButton
                    size="small"
                    onClick={null}
                    title={
                      props.data.project.is_public
                        ? "Public Project"
                        : "Private Project"
                    }
                  >
                    <FiberManualRecord
                      className={
                        props.data.project.is_public
                          ? classes.publicProject
                          : classes.privateProject
                      }
                      fontSize="small"
                    />
                  </IconButton>
                </span>
              </InfoTitle>
              {props.data.project.updated_at !== null &&
              props.data.project.updated_at !== undefined ? (
                <InfoSubtitle>
                  {convetToLocalTime(props.data.project.updated_at).substr(
                    4,
                    11
                  )}{" "}
                  {convetToLocalTime(props.data.project.updated_at).substr(
                    16,
                    5
                  )}
                  <span> | admin: {props.data.admin.username}</span>
                </InfoSubtitle>
              ) : (
                <InfoSubtitle>
                  admin: {props.data.project.admin.username}
                </InfoSubtitle>
              )}
            </Info>
          </Column>
          <div className={classes.grow} />
          <Column>
            {props.data.project.team_id !== null ||
            props.data.project.admin_id === Number(uid) ? (
              <IconButton
                size="small"
                onClick={Boolean(anchorEl) ? handleMenuClose : handleMenuOpen}
              >
                {Boolean(anchorEl) ? (
                  <ExpandLessRounded fontSize="small" />
                ) : (
                  <ExpandMoreRounded fontSize="small" />
                )}
              </IconButton>
            ) : null}
          </Column>
          {props.data.project.team_id !== null ||
          props.data.project.admin_id === Number(uid)
            ? renderMenu
            : null}
        </Row>
        <Box
          pb={1}
          px={2}
          color={"grey.600"}
          fontSize={"0.875rem"}
          fontFamily={"Ubuntu"}
          style={{ height: 60, overflowY: "scroll" }}
        >
          {props.data.project.description}
        </Box>
        <Row px={2} gap={0}>
          <Column style={{ width: "70%" }}>
            <Slider
              classes={sliderStyles}
              value={
                ((props.data.issue.total - props.data.issue.open) /
                  props.data.issue.total) *
                100
              }
            />
          </Column>
          <div className={classes.grow} />
          <Column>
            <Info useStyles={useApexInfoStyles}>
              {props.data.issue.total > 0 ? (
                <InfoSubtitle>
                  {Math.floor(
                    ((props.data.issue.total - props.data.issue.open) /
                      props.data.issue.total) *
                      100
                  )}
                  % Closed
                </InfoSubtitle>
              ) : (
                <Info useStyles={useApexInfoStyles}>
                  <InfoSubtitle>No issues</InfoSubtitle>
                </Info>
              )}
            </Info>
          </Column>
        </Row>
        <Row p={1} gap={2} position={"bottom"}>
          {props.data.team.info !== null ? (
            <AvatarGroup max={4} style={{ avatar: classes.avatar }}>
              {props.data.team.members.map((value, index) => (
                <Avatar
                  style={{ backgroundColor: randomColor() }}
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
          ) : (
            <Info useStyles={useApexInfoStyles}>
              <InfoSubtitle>No team assigned</InfoSubtitle>
            </Info>
          )}
          <Item position={"middle-right"}>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                goto(routes.PROJECTS_VIEW_X + props.data.project.id)
              }
            >
              View
            </Button>
          </Item>
        </Row>
      </Column>
    </Card>
  );
};

export default ProjectCard;
