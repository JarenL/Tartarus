const initialState = {
    web3: null
}

const web3Reducer = (state = initialState, action) => {
    if (action.type === 'WEB3_INITIALIZED') {
        state = {...state, ...action.payload}
    }
    return state
}

export default web3Reducer