import {getRefreshToken, setTokens, catchError, getAccessToken, updateStorageTokens, removeToken, catchMessageError} from 'utils/apiUtils';
import Axios from 'axios';

describe('apiUtils ', () => {

    it('it should catch error response data message ', () => {

        const error = {
            response : {
                status: 401,
                data: {
                    message: 'Error response data message',
                }
            }
        };

        function errorMessage(){catchError(error)};

        expect(errorMessage).toThrowError('Error response data message')

    });


    it('it should catch error response data statusText', () => {

        const error = {
            response: {
                status: 401,
                    data : {
                    statusText : "Error response statusText"
                }
            }
        };

        function errorStatusText(){catchError(error)};

        expect(errorStatusText).toThrowError('Error response statusText')

    })


    it('it should catch error request statusText', () => {

        const error = {
            request : {
                status: 401,
                statusText : "Error request"
            }
        };

        function errorRequestStatusText(){catchError(error)};

        expect(errorRequestStatusText).toThrowError('Error request')
    })

    it('it should catch unknown error', () => {

        const error = {
            message: "Unknown error"
        }

        function errorUnknown(){catchError(error)};

        expect(errorUnknown).toThrowError('Unknown error')
    })

    it('it should return error response data message ', () => {

        const error = {
            response : {
                status: 401,
                data: {
                    message: 'Error response data message',
                }
            }
        };

        expect(catchMessageError(error)).toEqual('Error response data message')

    });


    it('it should return error response data statusText', () => {

        const error = {
            response: {
                status: 401,
                    data : {
                    statusText : "Error response statusText"
                }
            }
        };


        expect(catchMessageError(error)).toEqual('Error response statusText')

    })


    it('it should return error request statusText', () => {

        const error = {
            request : {
                status: 401,
                statusText : "Error request"
            }
        };

        expect(catchMessageError(error)).toEqual('Error request')
    })

    it('it should catch unknown error', () => {

        const error = {
            message: "Unknown error"
        }


        expect(catchMessageError(error)).toEqual('Unknown error')
    })

    it('it should get refresh token', () => {
        const tokens = {
            "accessToken": "test",
            "refreshToken": "refreshToken",
            "tokenType": "Bearer"
        }

        setTokens(tokens);

        expect(getRefreshToken()).toEqual('refreshToken');
    })

    it('it should get access token', () => {
        const tokens = {
            "accessToken": "test",
            "refreshToken": "refreshToken",
            "tokenType": "Bearer"
        }

        setTokens(tokens);

        expect(getAccessToken()).toEqual('test');
    })

    it('it should update token', () => {
        const tokens = {
            "accessToken": "test",
            "refreshToken": "refreshToken",
            "tokenType": "Bearer"
        }

        const updTokens = {
            "accessToken": "newAccessToken",
            "refreshToken": "newRefreshToken",
            "tokenType": "Bearer"
        }

        setTokens(tokens);

        expect(getAccessToken()).toEqual('test');
        expect(getRefreshToken()).toEqual('refreshToken');

        updateStorageTokens(updTokens);

        expect(getAccessToken()).toEqual('newAccessToken');
        expect(getRefreshToken()).toEqual('newRefreshToken');
    })

    it('it should remove token', () => {
        const tokens = {
            "accessToken": "test",
            "refreshToken": "refreshToken",
            "tokenType": "Bearer"
        }

        setTokens(tokens);

        expect(getAccessToken()).toEqual('test');
        expect(getRefreshToken()).toEqual('refreshToken');

        removeToken('refreshToken');

        expect(getRefreshToken()).toEqual(null);
    })
});
