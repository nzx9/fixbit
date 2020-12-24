import React from "react";
import { makeStyles } from "@material-ui/core";
import notFoundImage from "../images/404-error-not-found.png";

const useStyles = makeStyles((theme) => ({
  notFoundImage: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "50%",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
    },
  },
}));

const NotFound = () => {
  const classes = useStyles();
  return (
    <div>
      <img
        className={classes.notFoundImage}
        src={notFoundImage}
        alt="Not Found"
      />
    </div>
  );
};

export default NotFound;
