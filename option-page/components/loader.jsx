import React from "react";
import Lottie from "lottie-react-web";
import loaderJson from "./happy-diwali.loader";

export default class Loader extends React.Component {
  render() {
    return (
      <div style={{width: "60%", margin: 'auto'}}>
        <Lottie
          style={{ width: "60%", margin: 'auto'}}
          options={{
            animationData: loaderJson
          }}
        />
      </div>
    );
  }
}
