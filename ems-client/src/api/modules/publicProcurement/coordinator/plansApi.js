import Axios from 'axios';

class PlansApi {
    static getPlans(year){
        return Axios.get(`/api/public/coordinator/plans/${year}/getAll`)
    }

    static getPlanUpdates(levelAccess, year){
        return Axios.get(`/api/${levelAccess}/coordinator/plans/${year}/getCoordinatorsPlanUpdates`)
    }

    static approvePlan(planId){
        return Axios.put(`/api/public/coordinator/plan/${planId}/publicApprove`)
    }

    static approveUpdatePlan(planId, levelAccess){
        return Axios.put(`/api/${levelAccess === 'chief' ? "director" : levelAccess}/coordinator/plan/${planId}/${levelAccess}Approve`)
    }

    static sendBack(planId){
        return Axios.put(`/api/public/coordinator/plan/${planId}/returnPlan`)
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

    static printPlan(planId){
        return Axios.get(`/api/coordinator/plan/print/${planId}`, {responseType: 'blob'})
    }
}

export default PlansApi;