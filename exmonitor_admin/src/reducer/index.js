import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const nameInitialState = {}
const name = (state = nameInitialState, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default combineReducers({
    name,
    routing: routerReducer,
})