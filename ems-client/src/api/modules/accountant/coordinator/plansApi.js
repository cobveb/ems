import Axios from 'axios';

class PlansApi {
    static getPlans(){
        return Axios.get(`/api/accountant/coordinator/plans/getAll`)
    }

    static getPlan(planId){
        return Axios.get(`/api/accountant/coordinator/plans/getPlan/${planId}`)
    }

    static getPlanPositions(planId){
        return Axios.get(`/api/accountant/coordinator/plan/${planId}/getPositions`)
    }

    static savePlanPositions(planId, data){
        return Axios.put(`/api/accountant/coordinator/plan/${planId}/updatePlanPositions`, data)
    }

    static updatePlanPosition(planId, data){
        return Axios.put(`/api/accountant/coordinator/plan/${planId}/updatePlanPosition`, data)
    }

    static forwardPlan(planId){
        return  Axios.put(`/api/accountant/coordinator/plan/forwardPlan/${planId}`)
    }

    static approvePlan(planId){
        return  Axios.put(`/api/accountant/coordinator/plan/approvePlan/${planId}`)
    }

    static withdrawPlan(planId){
        return  Axios.put(`/api/accountant/coordinator/plan/withdrawPlan/${planId}`)
    }

    static exportPlansToExcel(exportType, data){
        return Axios.put(`/api/accountant/coordinator/export/plans/${exportType}`, data, {responseType: 'blob'})
    }

    static exportPlanPositionsToExcel(exportType, planId, data){
        return Axios.put(`/api/accountant/coordinator/export/planPositions/${planId}/${exportType}`, data, {responseType: 'blob'})
    }

}

export default PlansApi;