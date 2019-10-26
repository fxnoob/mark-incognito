import React from "react";
import Home from "./home";
import Loader from "./loader";
import Error from "./error";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isError: false
    };
  }

  componentDidMount() {
    chrome.extension.isAllowedIncognitoAccess(isAllowedIncognito => {
      console.log({isAllowedIncognito})
      this.setState({
        isLoaded: true,
        isError: !isAllowedIncognito
      });
    });
  }

  render() {
    let html;
    const { isLoaded, isError } = this.state;
    if (!isLoaded) html = <Loader />;
    else {
      if (isError) html = <Error />;
      else html = <Home />;
    }

    return <React.Fragment>{html}</React.Fragment>;
  }
}
