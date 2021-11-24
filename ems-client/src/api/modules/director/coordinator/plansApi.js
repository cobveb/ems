import Axios from 'axios';

class PlansApi {

    static getPlans(){
        return Axios.get(`/api/director/coordinator/plans/getAll`)
    }

    static approveDirector(planId){
        return Axios.put(`/api/director/coordinator/plan/${planId}/directorApprove`)
    }

    static approveEconomic(planId){
        return Axios.put(`/api/director/coordinator/plan/${planId}/economicApprove`)
    }

    static approveChief(planId){
        return Axios.put(`/api/director/coordinator/plan/${planId}/chiefApprove`)
    }

    static returnPlan(planId){
        return Axios.put(`/api/director/coordinator/plan/${planId}/returnPlan`)
    }

    static getPlanPositions(planId){
        return Axios.get(`/api/director/coordinator/plan/${planId}/getPositions`)
    }

    static savePlanPositions(planId, data){
        return Axios.put(`/api/director/coordinator/plan/${planId}/updatePlanPositions`, data)
    }

    static exportPlansToExcel(exportType, data){
        return Axios.put(`/api/director/coordinator/export/plans/${exportType}`, data, {responseType: 'blob'})
    }

    static exportPlanPositionsToExcel(exportType, planType, planId, data){
        return Axios.put(`/api/director/coordinator/export/planPositions/${planType}/${planId}/${exportType}`, data, {responseType: 'blob'})
    }

}

export default PlansApi;