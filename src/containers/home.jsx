import React from "react";
import {
  getUId,
  getFirstName,
  getLastName,
  getEmail,
} from "../reducers/userDataTracker";
import { useSelector } from "react-redux";

const Home = () => {
  const uid = useSelector(getUId);
  const firstname = useSelector(getFirstName);
  const lastname = useSelector(getLastName);
  const email = useSelector(getEmail);
  return (
    <div>
      <h1>Welcome {firstname}!</h1>
      <code>
        <span>{"-->"}</span>Info
      </code>
      <ul>
        <li>User Id : {uid}</li>
        <li>First Name: {firstname}</li>
        <li>Last Name : {lastname}</li>
        <li>Email : {email}</li>
        <li>Build type: {process.env.NODE_ENV}</li>
      </ul>
    </div>
  );
};

export default Home;
