import Axios from 'axios';

class GroupsApi {

    static getAllUserGroups(){
        return Axios.get(`/api/usersGroups/getAll`)
    }

    static getGroupUsers(group){
        return Axios.get(`/api/users/${group}/getUsers`)
    }

    static getGroupObjectPermission(group, acObject){
        return Axios.get(`/api/usersGroups/${group}/${acObject}/getPermissions`)
    }

    static saveGroupBasic(data){
        return Axios.put(`/api/usersGroups/saveGroupBasic`, data)
    }

    static saveGroupUsers(data, group){
        return Axios.put(`/api/usersGroups/${group}/saveGroupUsers`, data)
    }

    static saveGroupObjectPermissions(data, group, acObject){
        return Axios.put(`/api/usersGroups/${group}/${acObject}/savePermission`, data)
    }

    static deleteGroupUsers(group){
        return Axios.delete(`/api/usersGroups/deleteGroup/${group}`)
    }
}

export default GroupsApi;