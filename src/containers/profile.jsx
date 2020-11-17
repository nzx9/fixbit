import React from "react";
import {
  Container,
  Paper,
  makeStyles,
  TextField,
  InputAdornment,
  Grid,
  Button,
  IconButton,
  Avatar,
  Hidden,
  CssBaseline,
  Typography,
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
import { useSelector, useDispatch } from "react-redux";
import { httpPOST } from "../components/httpRequest";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      marginTop: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(5),
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
  updateBtn: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.grey[100],
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  updateBtnGrid: {
    display: "flex",
    flexDirection: "column",
    alignItems: "right",
  },
  avatarLg: {
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
  avatarSm: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

const Profile = () => {
  const classes = useStyles();
  const uId = useSelector(getUId);
  const username = useSelector(getUserName);
  const fullname = useSelector(getFullName);
  const email = useSelector(getEmail);

  const [isInputDisabled, setIsInputDisabled] = React.useState(true);

  const [_userName, _setUserName] = React.useState(username);
  const [_fullName, _setFullName] = React.useState(fullname);
  const [_email, _setEmail] = React.useState(email);

  const userNameInputHandler = (e) => {
    _setUserName(e.target.value);
  };
  const fullNameInputHandler = (e) => {
    _setFullName(e.target.value);
  };
  const emailInputHandler = (e) => {
    _setEmail(e.target.value);
  };
  const dispatch = useDispatch();
  return (
    <Container component="main" maxWidth="xl">
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
            <form
              className={classes.root}
              onSubmit={(e) => {
                if (!isInputDisabled) {
                  httpPOST(
                    `${window.location.protocol}//${window.location.hostname}/api/users/update.php`,
                    {
                      uid: uId,
                      username: _userName,
                      fullname: _fullName,
                      email: _email,
                    }
                  )
                    .then((res) => {
                      if (res.success) {
                        dispatch(setUserName(res.user_data.username));
                        dispatch(setFullName(res.user_data.fullname));
                        dispatch(setEmail(res.user_data.email));
                      }
                    })
                    .catch((err) => alert(err));
                }
                e.preventDefault();
              }}
            >
              <Grid container>
                <Grid item xs={9} justify="flex-start">
                  <Typography key="profile-header" variant="h6">
                    Profile
                  </Typography>
                </Grid>
                <Grid item xs={3} className={classes.updateBtnGrid}>
                  <Button
                    className={classes.updateBtn}
                    variant="contained"
                    type={isInputDisabled ? "button" : "submit"}
                    onClick={() => {
                      setIsInputDisabled(!isInputDisabled);
                    }}
                  >
                    {isInputDisabled ? "Edit" : "Update"}
                  </Button>
                </Grid>
              </Grid>
              <hr />
              <TextField
                variant="outlined"
                fullWidth
                required
                disabled={isInputDisabled}
                type="text"
                lable="User Name"
                defaultValue={username}
                onChange={userNameInputHandler}
              />
              <TextField
                variant="outlined"
                fullWidth
                required
                disabled={isInputDisabled}
                type="text"
                lable="Full Name"
                defaultValue={fullname}
                onChange={fullNameInputHandler}
              />
              <TextField
                variant="outlined"
                fullWidth
                required
                disabled={isInputDisabled}
                type="text"
                lable="Email"
                defaultValue={email}
                onChange={emailInputHandler}
              />
            </form>
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <h3>Teams</h3>
            <hr />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
