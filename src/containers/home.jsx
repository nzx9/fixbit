import React from "react";
import {
  getUId,
  getFirstName,
  getLastName,
  getEmail,
} from "../reducers/userDataTracker";
import { useSelector } from "react-redux";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Home = () => {
  const uid = useSelector(getUId);
  const firstname = useSelector(getFirstName);
  const lastname = useSelector(getLastName);
  const email = useSelector(getEmail);
  return (
    <div>
      <h1>Welcome {firstname}!</h1>
      <code>Info</code>
      <ul>
        <li>User Id : {uid}</li>
        <li>First Name: {firstname}</li>
        <li>Last Name : {lastname}</li>
        <li>Email : {email}</li>
      </ul>
    </div>
  );
};

export default Home;
