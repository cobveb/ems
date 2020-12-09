import Axios from 'axios';

class CostTypeApi {

    static getCostTypeAll(){
        return Axios.get(`/api/accountant/costType/getAll`)
    }

    static getYearsByCostType(costId){
        return Axios.get(`/api/accountant/costType/getYears/${costId}`)
    }

    static saveCostType(data){
        return Axios.put(`/api/accountant/costType/saveCostType`, data)
    }

    static deleteCostType(costId){
        return Axios.delete(`/api/accountant/costType/deleteCostType/${costId}`)
    }
}

export default CostTypeApi;