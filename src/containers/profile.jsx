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
} from "@material-ui/core";
import {
  getUId,
  getUserName,
  getFullName,
  getEmail,
  setUserName,
  setFullName,
  setEmail,
} from "../reducers/userDataTracker";
import { getToken } from "../reducers/tokenTracker";
import { useSelector, useDispatch } from "react-redux";
import { httpReq } from "../components/httpRequest";
import { DEBUG_PRINT } from "../components/debugTools";
import { useSnackbar } from "notistack";
import { logout } from "../reducers/loginTracker";
import settings from "../components/settings.json";

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
  updateBtnDisbled: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.grey[100],
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  updateBtnActive: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.grey[100],
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
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
  const uId = useSelector(getUId);
  const token = useSelector(getToken);
  const username = useSelector(getUserName);
  const fullname = useSelector(getFullName);
  const email = useSelector(getEmail);

  const [isUserInputDisabled, setIsUserInputDisabled] = React.useState(true);
  const [isPasswordInputDisabled, setIsPasswordInputDisabled] = React.useState(
    true
  );

  const [_userName, _setUserName] = React.useState(username);
  const [_fullName, _setFullName] = React.useState(fullname);
  const [_email, _setEmail] = React.useState(email);

  const [_currentPassword, _setCurrentPassword] = React.useState("");
  const [_newPassword, _setNewPassword] = React.useState("");
  const [_retypeNewPassowrd, _setRetypeNewPassword] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);

  const userNameInputHandler = (e) => {
    _setUserName(e.target.value);
  };
  const fullNameInputHandler = (e) => {
    _setFullName(e.target.value);
  };
  const emailInputHandler = (e) => {
    _setEmail(e.target.value);
  };
  const currentPasswordInputHandler = (e) => {
    _setCurrentPassword(e.target.value);
  };
  const newPasswordInputHandler = (e) => {
    _setNewPassword(e.target.value);
  };
  const retypeNewPasswordInputHandler = (e) => {
    _setRetypeNewPassword(e.target.value);
  };
  const dispatch = useDispatch();

  return (
    <Container component="main" maxWidth="xl">
      <Backdrop className={classes.backdrop} open={_openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <form
              className={classes.root}
              validate="true"
              autoComplete="on"
              onSubmit={(e) => {
                if (!isUserInputDisabled) {
                  _setOpenBackdrop(true);
                  httpReq(
                    `${window.location.protocol}//${window.location.hostname}/api/users/update.php`,
                    {
                      uid: uId,
                      username: _userName,
                      fullname: _fullName,
                      email: _email,
                      token: token,
                    }
                  )
                    .then((res) => {
                      DEBUG_PRINT(res);
                      _setOpenBackdrop(false);
                      if (res.success) {
                        dispatch(setUserName(res.user_data.username));
                        dispatch(setFullName(res.user_data.fullname));
                        dispatch(setEmail(res.user_data.email));
                        enqueueSnackbar(res.msg, {
                          variant: "success",
                          anchorOrigin: settings.snackbar.anchorOrigin,
                        });
                      } else {
                        _setUserName(username);
                        _setFullName(fullname);
                        _setEmail(email);
                        enqueueSnackbar(res.msg, {
                          variant: res.type,
                          anchorOrigin: settings.snackbar.anchorOrigin,
                        });
                      }
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
                <Grid item justify="flex-start">
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
                variant="outlined"
                fullWidth
                required
                disabled={isUserInputDisabled}
                type="text"
                lable="User Name"
                value={_userName}
                onChange={userNameInputHandler}
              />
              <TextField
                variant="outlined"
                fullWidth
                required
                disabled={isUserInputDisabled}
                type="text"
                lable="Full Name"
                value={_fullName}
                onChange={fullNameInputHandler}
              />
              <TextField
                variant="outlined"
                fullWidth
                required
                disabled={isUserInputDisabled}
                type="email"
                lable="Email"
                value={_email}
                onChange={emailInputHandler}
              />
            </form>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <form
              className={classes.root}
              validate="true"
              autoComplete="on"
              onSubmit={(e) => {
                DEBUG_PRINT({
                  uid: uId,
                  currentPassword: _currentPassword,
                  newPassword: _newPassword,
                  confirmNewPassword: _retypeNewPassowrd,
                  token: token,
                });
                if (!isPasswordInputDisabled) {
                  if (
                    _currentPassword !== null &&
                    _newPassword !== null &&
                    _retypeNewPassowrd !== null
                  ) {
                    _setOpenBackdrop(true);
                    httpReq(
                      `${window.location.protocol}//${window.location.hostname}/api/users/changepassword.php`,
                      {
                        uid: uId,
                        currentPassword: _currentPassword,
                        newPassword: _newPassword,
                        confirmNewPassword: _retypeNewPassowrd,
                        token: token,
                      }
                    )
                      .then((res) => {
                        _setOpenBackdrop(false);
                        DEBUG_PRINT(res);
                        if (res.success) {
                          enqueueSnackbar(res.msg, {
                            variant: "success",
                            anchorOrigin: settings.snackbar.anchorOrigin,
                          });
                        } else {
                          enqueueSnackbar(res.msg, {
                            variant: res.type,
                            anchorOrigin: settings.snackbar.anchorOrigin,
                          });
                        }
                      })
                      .catch((err) => {
                        _setOpenBackdrop(true);
                        alert(err);
                      });
                  } else {
                    enqueueSnackbar("All fields are required", {
                      variant: "error",
                      anchorOrigin: settings.snackbar.anchorOrigin,
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
                <Grid item justify="flex-start">
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
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
