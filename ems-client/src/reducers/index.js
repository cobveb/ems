import { combineReducers } from "redux";
import { auth } from "reducers/auth";
import { ui } from "reducers/ui";
import { modules } from "reducers/modules";
import { reducer as formReducer } from 'redux-form';

const appReducer = combineReducers({
    auth,
    ui,
    modules,
    form: formReducer,
})

const rootReducer = (state, action) => {
    if (action.type === 'AUTH_LOGOUT') {
        state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer;

