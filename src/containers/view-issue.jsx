import React, { useEffect } from "react";

import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
}));

const ViewIssue = (props) => {
  const classes = useStyles();
  const [issueData, setIssueData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  //   useEffect(() => {}, []);
  //   if (error) return <div>Error: {error}</div>;
  //   else if (!isLoaded)
  //     return (
  //       <div>
  //         <Backdrop className={classes.backdrop} open="true">
  //           <CircularProgress color="inherit" />
  //         </Backdrop>
  //       </div>
  //     );
  //   else
  return (
    <div>
      {props.match.params.pid} ISSUE : {props.match.params.iid}
    </div>
  );
};

export default ViewIssue;
