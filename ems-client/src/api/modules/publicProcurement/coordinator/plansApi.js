import Axios from 'axios';

class PlansApi {
    static getPlans(){
        return Axios.get(`/api/public/coordinator/plans/getAll`)
    }

    static approvePlan(planId){
        return Axios.put(`/api/public/coordinator/plan/${planId}/publicApprove`)
    }

    static getPlanPositions(planId){
        return Axios.get(`/api/public/coordinator/plan/${planId}/getPositions`)
    }

    static exportPlansToExcel(exportType, data){
        return Axios.put(`/api/public/coordinator/export/plans/${exportType}`, data, {responseType: 'blob'})
    }

    static exportPlanPositionsToExcel(exportType, planType, planId, data){
        return Axios.put(`/api/public/coordinator/export/planPositions/${planType}/${planId}/${exportType}`, data, {responseType: 'blob'})
    }

    static exportPlanPositionSubPositionsToExcel(exportType, planType, positionId, data){
        return Axios.put(`/api/public/coordinator/export/planPositionSubPositions/${planType}/${positionId}/${exportType}`, data, {responseType: 'blob'})
    }
}

export default PlansApi;