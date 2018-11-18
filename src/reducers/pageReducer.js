import {
	UPDATE_PAGE
} from '../actions/actions';

const initialState = {
	currentPage: "Frontpage",
}

const forumReducer = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_PAGE:
			return {
				...state,
				currentPage: action.payload
			};
		default:
			return state
	}
}

export default forumReducer