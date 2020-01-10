import React from "react";
import Home from "./home";
import PrivateRoute from "./PrivateRouter";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <PrivateRoute component={Home} />;
  }
}
