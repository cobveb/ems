import * as types from 'constants/actionTypes';
import modulesApi from 'api/modulesApi';
import {catchError} from 'utils/apiUtils';

export function loadModulesSuccess(module) {

    return {
        type: types.LOAD_MODULES_SUCCESS,
        payload: {
            modules: module,
        }
    };
}

export function loadModules(accessToken) {
    return function(dispatch) {
        return modulesApi.getAllModules()
        .then(modules => {
            dispatch(loadModulesSuccess(modules.data.data));
        })
        .catch(error => {
            return catchError(error);
        });
    };
}