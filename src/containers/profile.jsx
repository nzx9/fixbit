import React from "react";
import {
  Container,
  Paper,
  makeStyles,
  TextField,
  Grid,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  InputAdornment,
  FormControl,
  OutlinedInput,
  FormHelperText,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@material-ui/core";
import {
  getUserName,
  getFullName,
  getEmail,
  getSocial,
  setUserName,
  setFullName,
  getLastLogin,
  setEmail,
  setSocial,
  getCreatedAt,
  getUpdatedAt,
  getUId,
} from "../reducers/userDataTracker";
import { getToken } from "../reducers/tokenTracker";
import { useSelector, useDispatch } from "react-redux";
import { httpReq } from "../components/httpRequest";
import { useSnackbar } from "notistack";
import { Twitter, LinkedIn, GitHub } from "@material-ui/icons";
import config from "../components/config.json";
import { NOTIFY, snackPosition } from "../components/notify";
import { convertToLocalTime } from "../components/debugTools";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      marginTop: theme.spacing(1),
    },
  },
  grow: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paperForm: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paperMore: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    color: theme.palette.text.secondary,
  },
  paperMoreTitle: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    color: theme.palette.text.secondary,
  },
  paperMoreDivider: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  updateBtnDisbled: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.grey[100],
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  updateBtnActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.grey[100],
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
  logout: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
  const token = useSelector(getToken);
  const username = useSelector(getUserName);
  const fullname = useSelector(getFullName);
  const email = useSelector(getEmail);
  const social = useSelector(getSocial);

  const [isUserInputDisabled, setIsUserInputDisabled] = React.useState(true);
  const [isPasswordInputDisabled, setIsPasswordInputDisabled] = React.useState(
    true
  );
  const [isSocialInputDisabled, setIsSocialInputDisabled] = React.useState(
    true
  );

  const [_userName, _setUserName] = React.useState(username);
  const [_fullName, _setFullName] = React.useState(fullname);
  const [_email, _setEmail] = React.useState(email);
  const [_twitter, _setTwitter] = React.useState(social.twitter);
  const [_linkedIn, _setLinkedIn] = React.useState(social.linkedIn);
  const [_github, _setGithub] = React.useState(social.github);

  const [_currentPassword, _setCurrentPassword] = React.useState("");
  const [_newPassword, _setNewPassword] = React.useState("");
  const [_retypeNewPassowrd, _setRetypeNewPassword] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

  const userNameInputHandler = (e) => _setUserName(e.target.value);
  const fullNameInputHandler = (e) => _setFullName(e.target.value);
  const emailInputHandler = (e) => _setEmail(e.target.value);

  const currentPasswordInputHandler = (e) =>
    _setCurrentPassword(e.target.value);

  const newPasswordInputHandler = (e) => _setNewPassword(e.target.value);

  const retypeNewPasswordInputHandler = (e) =>
    _setRetypeNewPassword(e.target.value);

  const twitterInputHandler = (e) => _setTwitter(e.target.value);
  const linkedInInputHandler = (e) => _setLinkedIn(e.target.value);
  const githubInputHandler = (e) => _setGithub(e.target.value);

  const dispatch = useDispatch();

  return (
    <Container component="main" maxWidth="xl">
      <Backdrop className={classes.backdrop} open={_openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Paper className={classes.paper}>
            <form
              className={classes.root}
              validate="true"
              autoComplete="on"
              onSubmit={(e) => {
                if (!isUserInputDisabled) {
                  _setOpenBackdrop(true);
                  let data = {};
                  if (null !== _userName && username !== _userName)
                    data["username"] = _userName;
                  if (null !== _fullName && fullname !== _fullName)
                    data["fullname"] = _fullName;
                  if (null !== _email && email !== _email)
                    data["email"] = _email;
                  httpReq(`${config.URL}/api/users/user`, "PUT", data, token)
                    .then((res) => {
                      res.json().then((r) => {
                        NOTIFY(r.msg, (msg) => {
                          if (msg === null || msg === undefined)
                            msg = r.message;
                          enqueueSnackbar(msg, {
                            variant: r.type,
                            anchorOrigin: snackPosition(),
                          });
                          if (200 === res.status && true === r.success) {
                            dispatch(setUserName(r.data.username));
                            dispatch(setFullName(r.data.fullname));
                            dispatch(setEmail(r.data.email));
                          } else {
                            _setUserName(username);
                            _setFullName(fullname);
                            _setEmail(email);
                          }
                        });
                        _setOpenBackdrop(false);
                      });
                    })
                    .catch((err) => {
                      _setOpenBackdrop(false);
                      alert(err);
                    });
                }
                setIsUserInputDisabled(!isUserInputDisabled);
                e.preventDefault();
              }}
            >
              <Grid container>
                <Grid item>
                  <Typography key="profile-header" variant="h6">
                    Profile
                  </Typography>
                </Grid>
                <div className={classes.grow} />
                <Button
                  className={
                    isUserInputDisabled
                      ? classes.updateBtnActive
                      : classes.updateBtnDisbled
                  }
                  variant="contained"
                  type="submit"
                >
                  {isUserInputDisabled ? "Edit" : "Update"}
                </Button>
              </Grid>
              <hr />
              <TextField
                label="Username"
                variant="outlined"
                type="text"
                fullWidth
                required
                disabled={isUserInputDisabled}
                value={_userName}
                onChange={userNameInputHandler}
              />
              <TextField
                variant="outlined"
                fullWidth
                required
                disabled={isUserInputDisabled}
                type="text"
                label="Full Name"
                value={_fullName}
                onChange={fullNameInputHandler}
              />
              <TextField
                variant="outlined"
                fullWidth
                required
                disabled={isUserInputDisabled}
                type="email"
                label="Email"
                value={_email}
                onChange={emailInputHandler}
              />
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper className={classes.paper}>
            <form
              className={classes.root}
              validate="true"
              autoComplete="on"
              onSubmit={(e) => {
                if (!isPasswordInputDisabled) {
                  if (
                    _currentPassword !== null &&
                    _newPassword !== null &&
                    _retypeNewPassowrd !== null
                  ) {
                    _setOpenBackdrop(true);
                    let data = {
                      old_password: _currentPassword,
                      password: _newPassword,
                      c_password: _retypeNewPassowrd,
                    };
                    httpReq(`${config.URL}/api/users/user`, "PUT", data, token)
                      .then((res) => {
                        res.json().then((r) => {
                          NOTIFY(r.msg, (msg) => {
                            if (msg === null || msg === undefined)
                              msg = r.message;
                            enqueueSnackbar(msg, {
                              variant: r.type,
                              anchorOrigin: snackPosition(),
                            });
                          });
                          _setOpenBackdrop(false);
                        });
                      })
                      .catch((err) => {
                        _setOpenBackdrop(false);
                        alert(err);
                      });
                  }
                }
                _setCurrentPassword("");
                _setNewPassword("");
                _setRetypeNewPassword("");
                setIsPasswordInputDisabled(!isPasswordInputDisabled);
                e.preventDefault();
              }}
            >
              <Grid container>
                <Grid item>
                  <Typography key="profile-header" variant="h6">
                    Passwords
                  </Typography>
                </Grid>
                <div className={classes.grow} />
                <Button
                  className={
                    isPasswordInputDisabled
                      ? classes.updateBtnActive
                      : classes.updateBtnDisbled
                  }
                  variant="contained"
                  type="submit"
                >
                  {isPasswordInputDisabled ? "Edit" : "Update"}
                </Button>
              </Grid>
              <hr />
              <TextField
                variant="outlined"
                fullWidth
                required
                lable="Current Password"
                disabled={isPasswordInputDisabled}
                type="password"
                value={_currentPassword}
                placeholder="Current Password"
                onChange={currentPasswordInputHandler}
              />
              <TextField
                variant="outlined"
                fullWidth
                required
                lable="New Password"
                disabled={isPasswordInputDisabled}
                type="password"
                value={_newPassword}
                placeholder="New Password"
                onChange={newPasswordInputHandler}
              />
              <TextField
                variant="outlined"
                lable="Retype New Password"
                fullWidth
                required
                disabled={isPasswordInputDisabled}
                type="password"
                placeholder="Retype New Password"
                value={_retypeNewPassowrd}
                onChange={retypeNewPasswordInputHandler}
              />
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper className={classes.paperForm}>
            <form
              className={classes.root}
              validate="true"
              autoComplete="on"
              onSubmit={(e) => {
                if (!isSocialInputDisabled) {
                  _setOpenBackdrop(true);
                  let data = {};
                  if (_twitter !== social.twitter) data["twitter"] = _twitter;
                  if (_linkedIn !== social.linkedIn)
                    data["linkedIn"] = _linkedIn;
                  if (_github !== social.github) data["github"] = _github;
                  httpReq(`${config.URL}/api/users/user`, "PUT", data, token)
                    .then((res) => {
                      res.json().then((r) => {
                        NOTIFY(r.msg, (msg) => {
                          if (msg === null || msg === undefined)
                            msg = r.message;
                          enqueueSnackbar(msg, {
                            variant: r.type,
                            anchorOrigin: snackPosition(),
                          });
                          if (200 === res.status && true === r.success) {
                            dispatch(
                              setSocial({
                                twitter: r.data.twitter,
                                linkedIn: r.data.linkedIn,
                                github: r.data.github,
                              })
                            );
                            _setTwitter(r.data.twitter);
                            _setLinkedIn(r.data.linkedIn);
                            _setGithub(r.data.github);
                          } else {
                            _setTwitter(social.twitter);
                            _setLinkedIn(social.linkedIn);
                            _setGithub(social.github);
                          }
                        });
                        _setOpenBackdrop(false);
                      });
                    })
                    .catch((err) => {
                      _setOpenBackdrop(false);
                      alert(err);
                    });
                }
                setIsSocialInputDisabled(!isSocialInputDisabled);
                e.preventDefault();
              }}
            >
              <Grid container>
                <Grid item>
                  <Typography key="profile-header" variant="h6">
                    Social
                  </Typography>
                </Grid>
                <div className={classes.grow} />
                <Button
                  className={
                    isSocialInputDisabled
                      ? classes.updateBtnActive
                      : classes.updateBtnDisbled
                  }
                  variant="contained"
                  type="submit"
                >
                  {isSocialInputDisabled ? "Edit" : "Update"}
                </Button>
              </Grid>
              <hr />
              <FormControl
                variant="outlined"
                fullWidth
                style={{ marginTop: 5 }}
              >
                <OutlinedInput
                  id="twitter-username"
                  value={_twitter}
                  placeholder="Twitter"
                  onChange={twitterInputHandler}
                  disabled={isSocialInputDisabled}
                  startAdornment={
                    <InputAdornment position="start">
                      <Twitter style={{ color: "#1DA1F2" }} />
                    </InputAdornment>
                  }
                  aria-describedby="twitter-username-helper-text"
                  inputProps={{
                    "aria-label": "twitter-username",
                  }}
                  labelWidth={0}
                />
                <FormHelperText id="twitter-username-helper-text">
                  <Link
                    href={`https://twitter.com/${_twitter}`}
                    target="_blank"
                    hidden={!Boolean(_twitter) ? true : false}
                  >
                    https://twitter.com/{_twitter}
                  </Link>
                </FormHelperText>
              </FormControl>
              <FormControl
                variant="outlined"
                fullWidth
                style={{ marginTop: 5 }}
              >
                <OutlinedInput
                  id="linkedIn-username"
                  value={_linkedIn}
                  placeholder="LinkedIn"
                  onChange={linkedInInputHandler}
                  disabled={isSocialInputDisabled}
                  startAdornment={
                    <InputAdornment position="start">
                      <LinkedIn style={{ color: "#0077B5" }} />
                    </InputAdornment>
                  }
                  aria-describedby="linkedIn-username-helper-text"
                  inputProps={{
                    "aria-label": "linkedIn-username",
                  }}
                  labelWidth={0}
                />
                <FormHelperText id="linkedIn-username-helper-text">
                  <Link
                    href={`https://linkedin.com/in/${_linkedIn}`}
                    target="_blank"
                    hidden={!Boolean(_linkedIn) ? true : false}
                  >
                    https://linkedin.com/in/{_linkedIn}
                  </Link>
                </FormHelperText>
              </FormControl>
              <FormControl
                variant="outlined"
                fullWidth
                style={{ marginTop: 5 }}
              >
                <OutlinedInput
                  id="github-username"
                  value={_github}
                  placeholder="GitHub"
                  onChange={githubInputHandler}
                  disabled={isSocialInputDisabled}
                  startAdornment={
                    <InputAdornment position="start">
                      <GitHub style={{ color: "#181717" }} />
                    </InputAdornment>
                  }
                  aria-describedby="github-username-helper-text"
                  inputProps={{
                    "aria-label": "github-username",
                  }}
                  labelWidth={0}
                />
                <FormHelperText id="github-username-helper-text">
                  <Link
                    href={`https://github.com/${_github}`}
                    target="_blank"
                    hidden={!Boolean(_github) ? true : false}
                  >
                    https://github.com/{_github}
                  </Link>
                </FormHelperText>
              </FormControl>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper classes={classes.paperMore}>
            <div className={classes.paperMoreTitle}>
              <Typography
                key="profile-header"
                variant="h6"
                style={{ marginBottom: 10 }}
              >
                More
              </Typography>
              <hr />
            </div>
            <List style={{ marginTop: -20, paddingTop: -20 }}>
              <ListItem>
                <ListItemText
                  primary="User ID"
                  secondary="User Identity Number"
                />
                <ListItemSecondaryAction>
                  #{useSelector(getUId)}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider className={classes.paperMoreDivider} />
              <ListItem>
                <ListItemText
                  primary="Last Login"
                  secondary={convertToLocalTime(useSelector(getLastLogin))}
                />
              </ListItem>
              <Divider className={classes.paperMoreDivider} />
              <ListItem>
                <ListItemText
                  primary="Registerd to Fixbit"
                  secondary={convertToLocalTime(
                    useSelector(getCreatedAt),
                    false
                  )}
                />
              </ListItem>
              <Divider className={classes.paperMoreDivider} />
              <ListItem>
                <ListItemText
                  primary="Last Profile Update"
                  secondary={convertToLocalTime(
                    useSelector(getUpdatedAt),
                    false
                  )}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
