import Axios from 'axios';

class OrganizationUnitsApi {
    static getMainOu(){
        return Axios.get(`/api/ou/getMainOu`)
    }

    static getAllOu(){
        return Axios.get(`/api/ou/getAll`)
    }

    static getActiveOu(){
        return Axios.get(`/api/ou/getActive`)
    }

    static getOu(code){
        return Axios.get(`/api/ou/getOu/${code}`)
    }

    static saveOu(action, data){
        return Axios.put(`/api/ou/${action}`, data)
    }

    static deleteOu(code){
        return Axios.delete(`/api/ou/deleteOu/${code}`)
    }
}

export default OrganizationUnitsApi;