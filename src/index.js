import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import { Provider } from 'react-redux'
import { Web3Provider } from 'react-web3';
import { HashRouter, Route, Switch } from "react-router-dom";
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/store/store';
import Loading from './components/Loading'

ReactDOM.render(
  <Provider store={store}>
    <Web3Provider>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <HashRouter>
          <App />
        </HashRouter>
      </PersistGate>
    </Web3Provider>
  </Provider>,
  document.getElementById('root')
);