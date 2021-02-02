import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
// import { Web3Provider } from 'react-web3';
import Web3Provider from '../src/services/web3/web3Provider';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/store/store';
import './config/moment';
import LoadingIndicatorSpinner from './components/shared/LoadingIndicator/Spinner.js';
// import Landing from './components/Landing';
// import { ThemeProvider } from 'styled-components';
// import themes from './components/Landing/themes';
import { Landing } from 'tartarus-landing';
import './style.css';
import { HashRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
  // <Landing />,
  <Provider store={store}>
    {/* <Web3Provider passive web3UnavailableScreen={Landing} accountUnavailableScreen={Landing} > */}

    <PersistGate loading={<LoadingIndicatorSpinner />} persistor={persistor}>
      <HashRouter>
        <Web3Provider
          web3UnavailableScreen={() => <Landing noWeb3 />}
          accountUnavailableScreen={() => <App />}
        >
          <App />
        </Web3Provider>
      </HashRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
