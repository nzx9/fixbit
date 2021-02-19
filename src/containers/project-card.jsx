import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  Button,
  Slider,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import { Column, Row, Item } from "@mui-treasury/components/flex";
import { Info, InfoSubtitle, InfoTitle } from "@mui-treasury/components/info";
import { useApexInfoStyles } from "@mui-treasury/styles/info/apex";
import {
  DeleteForever,
  ExpandLessRounded,
  ExpandMoreRounded,
  FiberManualRecord,
  Group,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import { getUId } from "../reducers/userDataTracker";
import routes from "../routes/routes.json";
import {
  NOTIFY,
  AlertDialogConfirmation,
  tipTitle,
  snackPosition,
} from "../components/notify";
import { httpReq } from "../components/httpRequest";
import config from "../components/config.json";
import { useSnackbar } from "notistack";
import { convertToLocalTime } from "../components/debugTools";

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
  avatar: {
    fontFamily: "Ubuntu",
    fontSize: "0.875rem",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: "0.75rem",
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
  info: {
    color: theme.palette.text.secondary,
    ["& h6"]: { color: theme.palette.text.primary },
    ["& p"]: { color: theme.palette.text.secondary },
  },
  box: {
    color: theme.palette.text.secondary,
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

const ProjectCard = (props) => {
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
        <Tooltip title={tipTitle("Team", 2)} placement="right" arrow>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              goto(routes.TEAMS_VIEW_X + props.data.project.team_id);
            }}
          >
            <Group />
          </MenuItem>
        </Tooltip>
      ) : (
        <></>
      )}
      {Number(props.data.project.admin_id) === Number(uid) ? (
        <Tooltip title={tipTitle("Delete", 2)} placement="right" arrow>
          <MenuItem
            className={classes.deleteItem}
            onClick={() => {
              setAlertOpen(true);
              handleMenuClose();
            }}
          >
            <DeleteForever />
          </MenuItem>
        </Tooltip>
      ) : (
        <></>
      )}
    </Menu>
  );

  return (
    <div className={classes.root}>
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
                    anchorOrigin: snackPosition(),
                  });
                  if (res.status === 200 && r.success === true)
                    props.refetchData();
                });
                handleAlertClose();
              });
            })
            .catch((err) => {
              console.error(err);
              handleAlertClose();
            });
        }}
        rejectCallback={() => {
          handleAlertClose();
        }}
      />
      <CardActionArea className={classes.actionArea}>
        <Card className={classes.card}>
          <Row px={1} gap={2}>
            <Column>
              <Info
                position={"middle"}
                useStyles={useApexInfoStyles}
                className={classes.info}
              >
                <InfoTitle>
                  {props.data.project.name}
                  <span>
                    <Tooltip
                      title={tipTitle(
                        props.data.project.is_public
                          ? "Public Project"
                          : "Private Project",
                        2
                      )}
                      placement="bottom-start"
                      arrow
                    >
                      <IconButton size="small" onClick={null}>
                        <FiberManualRecord
                          className={
                            props.data.project.is_public
                              ? classes.publicProject
                              : classes.privateProject
                          }
                          fontSize="small"
                        />
                      </IconButton>
                    </Tooltip>
                  </span>
                </InfoTitle>
                {props.data.project.updated_at !== null &&
                props.data.project.updated_at !== undefined ? (
                  <InfoSubtitle>
                    {convertToLocalTime(props.data.project.updated_at).substr(
                      4,
                      11
                    )}{" "}
                    {convertToLocalTime(props.data.project.updated_at).substr(
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
                <Tooltip title={tipTitle("Expand", 2)} arrow>
                  <IconButton
                    size="small"
                    onClick={
                      Boolean(anchorEl) ? handleMenuClose : handleMenuOpen
                    }
                  >
                    {Boolean(anchorEl) ? (
                      <ExpandLessRounded fontSize="small" />
                    ) : (
                      <ExpandMoreRounded fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
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
            fontSize={"0.875rem"}
            fontFamily={"Ubuntu"}
            style={{ height: 60, overflowY: "scroll" }}
            className={classes.box}
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
              <Info useStyles={useApexInfoStyles} className={classes.info}>
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
                  <Info useStyles={useApexInfoStyles} className={classes.info}>
                    <InfoSubtitle>No issues</InfoSubtitle>
                  </Info>
                )}
              </Info>
            </Column>
          </Row>
          <Row p={1} gap={2} position={"bottom"}>
            {props.data.team.info !== null ? (
              <Info useStyles={useApexInfoStyles} className={classes.info}>
                <InfoSubtitle>
                  <b>{props.data.team.info.name}</b>
                </InfoSubtitle>
                <InfoSubtitle>
                  {props.data.team.members.length}
                  {props.data.team.members.length === 1
                    ? " member"
                    : " members"}
                </InfoSubtitle>
              </Info>
            ) : (
              <Info useStyles={useApexInfoStyles} className={classes.info}>
                <InfoSubtitle>No team assigned</InfoSubtitle>
              </Info>
            )}
            <Item position={"middle-right"}>
              <Tooltip title={tipTitle("View Project", 2)} arrow>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    goto(routes.PROJECTS_VIEW_X + props.data.project.id)
                  }
                >
                  View
                </Button>
              </Tooltip>
            </Item>
          </Row>
        </Card>
      </CardActionArea>
    </div>
  );
};

export default ProjectCard;
