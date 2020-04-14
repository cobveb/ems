import Axios from 'axios';

class UsersApi {

    static getAllUsers(){
        return Axios.get(`/api/users/getAll`)
    }

    static getUser(id){
        return Axios.get(`/api/users/getUser/${id}`)
    }

    static getUserGroups(username){
        return Axios.get(`/api/usersGroups/${username}`)
    }

    static getUserObjectPermission(user, acObject){
        return Axios.get(`/api/users/${user}/${acObject}/getPermissions`)
    }

    static saveUser(data){
        return Axios.put(`/api/users/saveUser`, data)
    }

    static saveUserObjectPermissions(data, username, acObject){
        return Axios.put(`/api/users/${username}/${acObject}/savePermission`, data)
    }

    static saveUserGroups(data, username){
        return Axios.put(`/api/users/${username}/saveGroups`, data)
    }

    static deleteUser(code){
        return Axios.delete(`/api/users/deleteUser/${code}`)
    }
}

export default UsersApi;