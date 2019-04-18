import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from '../reducer/index.js';

export default function configStore() {
    return createStore(
        reducer,
        applyMiddleware(thunk),
    );
};