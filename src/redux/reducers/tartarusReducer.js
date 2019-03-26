import { TARTARUS_ADDRESS } from '../actions/actions';

const initialState = {
  tartarusAddress: '0x29ef5e5Cc05d945e8A7DBd2e37F2F637CFB80f9B'
};

const tartarusReducer = (state = initialState, action) => {
  switch (action.type) {
    case TARTARUS_ADDRESS:
      return Object.assign({}, state, {
        tartarusAddress: action.payload
      });
    default:
      return state;
  }
};

export default tartarusReducer;
