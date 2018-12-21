import {
    UPDATE_COMMENTS
} from '../actions/actions';

const initialState = {
	sorting: "newest",
}

const commentReducer = (state = initialState, action) => {
	switch (action.type) {
        
        case UPDATE_COMMENTS:
			return {
				...state,
				sorting: action.payload.target.value
			};
        default:
			return state
	}
}

export default commentReducer