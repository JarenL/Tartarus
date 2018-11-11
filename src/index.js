import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store/store'
import { Web3Provider } from 'react-web3';

ReactDOM.render(
  <Provider store={store}>
    <Web3Provider onChangeAccount={nextAddress => console.log(nextAddress)}>
      <App />
    </Web3Provider>
  </Provider>,
  document.getElementById('root')
);