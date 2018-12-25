import {
    UPDATE_COMMENTS
} from '../actions/actions.js';

const initialState = {
	sorting: "newest"
}

const commentReducer = (state = initialState, action) => {
	switch (action.type) {
        case UPDATE_COMMENTS:
            console.log(action.payload.target.value);
			return {
				...state,
				sorting: action.payload.target.value
			};
        default:
			return state
	}
}

export default commentReducer