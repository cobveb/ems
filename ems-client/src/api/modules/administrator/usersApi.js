import Axios from 'axios';

class UsersApi {

    static getAllUsers(){
        return Axios.get(`/api/users/getAll`)
    }

    static getUser(id){
        return Axios.get(`/api/users/getUser/${id}`)
    }

    static getUserObjectPermission(user, acObject){
        return Axios.get(`/api/usersGroups/${user}/${acObject}/getPermissions`)
    }

    static saveUser(data){
        return Axios.put(`/api/users/saveUser`, data)
    }

    static deleteUser(code){
        return Axios.delete(`/api/users/deleteUser/${code}`)
    }
}

export default UsersApi;