import Axios from 'axios';

class WorkplaceApi {
    static getAllWorkplaces(){
        return Axios.get(`/api/hr/dict/workplace/getAllWorkplaces`)
    }

    static saveWorkplace(data){
        return Axios.put(`/api/hr/dict/workplace/saveWorkplace`, data)
    }

    static deleteWorkplace(workplaceId){
        return Axios.delete(`/api/hr/dict/workplace/${workplaceId}/deleteWorkplace`)
    }

    static getActiveWorkplaces(){
        return Axios.get(`/api/hr/dict/workplace/getActiveWorkplaces`)
    }
}
export default WorkplaceApi;