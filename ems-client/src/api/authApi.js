import Axios from 'axios';

/**
 * Component responsible for communication with the api
 * on the server side in the scope of authorization
 *
 * @version 1.0.1 23
 * @author [Grzegorz Viola]
*/

class AuthApi {
    /**
    * Downloads access and refresh tokens
    */
    static loadAccessTokens(data){
        return Axios.post(`/api/auth/login`, data)
    }

    static loadUserDetails(){
        return Axios.get(`/api/users/user`)
    }

    /**
    * Delete refresh tokens on logout
    */
    static deleteRefreshToken(refreshToken){
        return Axios.delete(`/api/auth/token/delete/${refreshToken}`)
    }

    /**
    * Update refresh token
    */
    static updateTokens(data){
        return Axios.post(`/api/auth/token/refresh`, data)
    }

    /**
        * Change password
        */
    static changePassword(data){
        return Axios.post(`/api/auth/changePassword`, data)
    }
}

export default AuthApi;