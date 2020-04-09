import Axios from 'axios';

class ParametersApi {

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

export default ParametersApi;