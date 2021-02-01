import { WEB3_INITIALIZED } from '../actions/actions';

const initialState = {};

const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case WEB3_INITIALIZED:
      console.log(action.payload);
      return { ...state, ...action.payload };
    default:
      return {
        ...state
      };
  }
};

export default web3Reducer;
