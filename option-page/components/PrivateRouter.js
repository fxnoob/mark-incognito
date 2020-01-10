import React, { useState } from "react";
import Loader from "./loader";
import Error from "./error";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [loading, completeLoading] = useState(true);
  const [error, setError] = useState("");
  chrome.extension.isAllowedIncognitoAccess(isAllowedIncognito => {
    completeLoading(false);
    if (!isAllowedIncognito) {
      setError("No Allowed!");
    }
  });
  if (loading) return <Loader />;
  return error == "" ? <Component {...rest} /> : <Error />;
};
export default PrivateRoute;
