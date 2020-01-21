import React from "react";
import ReactDOM from "react-dom";
import Index from "./components/";
import Constants from "../contants";

const Element = document.createElement("div");
Element.setAttribute("id", Constants.OPTION_SCRIPT_HOST_ID);
document.body.appendChild(Element);
ReactDOM.render(
  <Index />,
  document.getElementById(Constants.OPTION_SCRIPT_HOST_ID)
);
