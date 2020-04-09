import { auth } from 'reducers/auth';
import * as types from 'constants/actionTypes';

describe('auth reducer', () => {
    it('should return the initial state', () => {
        expect(auth(undefined, {})).toEqual({
            authenticated: false,
            user:{},
        })
    });

    it('should handle LOAD_ACCESS_TOKENS_SUCCESS', () => {

        expect(auth({},{
            type: types.LOAD_ACCESS_TOKENS_SUCCESS,
        })).toEqual({
            authenticated: true,
        })
    });

    it('should handle LOAD_USER_DETAILS', () => {

        const user = {
            "id": 1,
            "name": "User",
            "surname": "Name",
            "username": "user",
        }

        expect(auth({},{
            type: types.LOAD_USER_DETAILS,
            payload:{
                userDetails : user,
            }
        })).toEqual({
            user: {
                "id": 1,
                "name": 'User',
                "surname": 'Name',
                "username": 'user'
            }
        })
    })
});