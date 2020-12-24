import React from "react";

const ViewTeam = (props) => {
  return <p>Team: {props.match.params.tid}</p>;
};

export default ViewTeam;
