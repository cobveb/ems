import Axios from 'axios';

class AdministratorApi {
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

    static saveOu(data){
        return Axios.put(`/api/ou/saveOu`, data)
    }

    static deleteOu(code){
        return Axios.delete(`/api/ou/deleteOu/${code}`)
    }

    static getAllUsers(){
        return Axios.get(`/api/users/getAll`)
    }

    static getUser(id){
        return Axios.get(`/api/users/getUser/${id}`)
    }

    static saveUser(data){
        return Axios.put(`/api/users/saveUser`, data)
    }

    static deleteUser(code){
        return Axios.delete(`/api/users/deleteUser/${code}`)
    }

    static getParamsByCategory(category){
        return Axios.get(`/api/param/getParams/${category}`)
    }

    static getParamsCategory(){
        return Axios.get(`/api/param/getCategories`)
    }

    static saveParam(param){
        return Axios.put(`/api/param/save`, param)
    }
}

export default AdministratorApi;