import Axios from 'axios';

class AccessControlApi {

    static getAllAcObject(){
        return Axios.get(`/api/ac/objects/getAll`)
    }

//    static getGroupObjectPermission(group, acObject){
//        return Axios.get(`/api/ac/permissions/groups/${group}/${acObject}`)
//    }
}

export default AccessControlApi;