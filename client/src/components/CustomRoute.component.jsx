import { Route, Redirect } from "react-router";
import React from "react";

const CustomRoute = ({ isSignin, ...otherProps }) => {
  if (isSignin) return <Route {...otherProps} />;
  return <Redirect to="/signin" />;
};

export default CustomRoute;
