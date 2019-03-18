import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import { Provider } from 'react-redux'
import { Web3Provider } from 'react-web3';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/store/store';
import './style.css';
import './config/moment';
import LoadingIndicatorSpinner from './components/shared/LoadingIndicator/Spinner.js';

ReactDOM.render(
  <Provider store={store}>
    <Web3Provider>
      <PersistGate loading={<LoadingIndicatorSpinner />} persistor={persistor}>
          <App />
      </PersistGate>
    </Web3Provider>
  </Provider>,
  document.getElementById('root')
);