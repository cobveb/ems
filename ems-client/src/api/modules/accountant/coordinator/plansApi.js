import Axios from 'axios';

class PlansApi {
    static getPlans(){
        return Axios.get(`/api/accountant/coordinator/plans/getAll`)
    }

    static getPlan(planId){
        return Axios.get(`/api/accountant/coordinator/plans/getPlan/${planId}`)
    }

    static approvePlan(planId){
        return Axios.put(`/api/accountant/coordinator/plan/${planId}/accountantApprove`)
    }

    static withdrawApprovedPlan(planId){
        return Axios.put(`/api/accountant/coordinator/plan/withdraw/${planId}`)
    }

    static getPlanPositions(planId){
        return Axios.get(`/api/accountant/coordinator/plan/${planId}/getPositions`)
    }

    static savePlanPositions(planId, data){
        return Axios.put(`/api/accountant/coordinator/plan/${planId}/updatePlanPositions`, data)
    }

    static exportPlansToExcel(exportType, data){
        return Axios.put(`/api/accountant/coordinator/export/plans/${exportType}`, data, {responseType: 'blob'})
    }

    static exportPlanPositionsToExcel(exportType, planId, data){
        return Axios.put(`/api/accountant/coordinator/export/planPositions/${planId}/${exportType}`, data, {responseType: 'blob'})
    }

}

export default PlansApi;