import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { Web3Provider } from 'react-web3';
import { HashRouter, Route, Switch } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <Web3Provider>
      <HashRouter>
        <App />
      </HashRouter>
    </Web3Provider>
  </Provider>,
  document.getElementById('root')
);