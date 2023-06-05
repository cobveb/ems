import Axios from 'axios';

class PlansApi{
    static getPlans(year){
        return Axios.get(`/api/director/institution/plans/${year}/getPlans`)
    }

    static approvePlan(planId){
        return  Axios.put(`/api/director/institution/plans/approvePlan/${planId}`)
    }

    static approveEconomicPlan(planId){
        return  Axios.put(`/api/director/institution/plans/approveEconomicPlan/${planId}`)
    }

    static withdrawPlan(planId){
        return  Axios.put(`/api/director/institution/plans/withdrawPlan/${planId}`)
    }

    static exportPlansToExcel(exportType, data){
        return Axios.put(`/api/director/institution/plans/export/plans/${exportType}`, data, {responseType: 'blob'})
    }

    static existsPlanToApprove(planId){
        return Axios.get(`/api/director/institution/plans/existsPlanToApprove/${planId}`)
    }
}
export default PlansApi;