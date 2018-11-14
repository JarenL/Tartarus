import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store/store'
import { Web3Provider } from 'react-web3';
import { BrowserRouter, Route, Switch } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <Web3Provider>
      <App />
    </Web3Provider>
  </Provider>,
  document.getElementById('root')
);