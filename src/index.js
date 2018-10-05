import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import drizzleOptions from "./drizzleOptions";

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";

// setup the drizzle store and drizzle
const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

// pass in the drizzle instance
ReactDOM.render(
  <App drizzle={drizzle} />, 
  document.getElementById("root")
);
