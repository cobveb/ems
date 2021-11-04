import Axios from 'axios';

class PlansApi{
    static getPlans(){
        return Axios.get(`/api/director/institution/plans/getPlans`)
    }

    static approvePlan(planId){
        return  Axios.put(`/api/director/institution/plans/approvePlan/${planId}`)
    }

    static withdrawPlan(planId){
        return  Axios.put(`/api/director/institution/plans/withdrawPlan/${planId}`)
    }

    static exportPlansToExcel(exportType, data){
        return Axios.put(`/api/director/institution/plans/export/plans/${exportType}`, data, {responseType: 'blob'})
    }

}
export default PlansApi;