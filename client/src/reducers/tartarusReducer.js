import {
    TARTARUS_ADDRESS,
    TARTARUS_INSTANCE
} from '../actions/actions';

const initialState = {
    tartarusAddress: null,
    tartarusInstance: null
}

const tartarusReducer = (state = initialState, action) => {
    switch (action.type) {
        case TARTARUS_ADDRESS:
            return Object.assign({}, state, {
                tartarusAddress: action.payload
            })
        case TARTARUS_INSTANCE:
            return Object.assign({}, state, {
                tartarusInstance: action.payload
            })
        default:
            return state
    }
}

export default tartarusReducer