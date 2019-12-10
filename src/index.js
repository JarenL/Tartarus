import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { Provider } from 'react-redux';
import { Web3Provider } from 'react-web3';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/store/store';
import './style.css';
import './config/moment';
import LoadingIndicatorSpinner from './components/shared/LoadingIndicator/Spinner.js';
// import Landing from './components/Landing';
// import { ThemeProvider } from 'styled-components';
// import themes from './components/Landing/themes';

ReactDOM.render(
  <Provider store={store}>
    <Web3Provider>
      <PersistGate loading={<LoadingIndicatorSpinner />} persistor={persistor}>
        <App />
      </PersistGate>
    </Web3Provider>
  </Provider>,
  // <ThemeProvider theme={themes["dark"]}>
  //   <Landing night={true} isAnimationDone={true} />
  // </ThemeProvider>,
  document.getElementById('root')
);
