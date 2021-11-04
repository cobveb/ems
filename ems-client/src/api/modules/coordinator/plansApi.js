import Axios from 'axios';

class PlansApi {

    static getPlans(){
        return Axios.get(`/api/coordinator/plans/getAll`)
    }

    static getPlanPositions(planId){
        return Axios.get(`/api/coordinator/plan/${planId}/getPositions`)
    }

    static savePlanPosition(planId, action, data){
        return Axios.put(`/api/coordinator/plan/${planId}/${action}/savePlanPosition`, data)
    }

    static deletePlanPosition(planId, positionId){
        return Axios.delete(`/api/coordinator/plan/${planId}/deletePlanPosition/${positionId}`)
    }

    static deletePlanSubPosition(positionId, subPosition){
        return Axios.delete(`/api/coordinator/plan/position/${positionId}/deleteSubPosition`, { data: subPosition })
    }

    static savePlan(action, data){
    return Axios.put(`/api/coordinator/plan/${action}/savePlan`, data)
    }

    static sendPlan(planId){
        return Axios.put(`/api/coordinator/plan/send/${planId}`)
    }

    static withdrawPlan(planId){
        return Axios.put(`/api/coordinator/plan/withdraw/${planId}`)
    }

    static deletePlan(planId){
        return Axios.delete(`/api/coordinator/plan/deletePlan/${planId}`)
    }

    static exportPlansToExcel(exportType, data){
        return Axios.put(`/api/coordinator/export/plans/${exportType}`, data, {responseType: 'blob'})
    }

    static exportPlanPositionsToExcel(exportType, planType, planId, data){
        return Axios.put(`/api/coordinator/export/planPositions/${planType}/${planId}/${exportType}`, data, {responseType: 'blob'})
    }

    static exportPlanPositionSubPositionsToExcel(exportType, planType, positionId, data){
        return Axios.put(`/api/coordinator/export/planPositionSubPositions/${planType}/${positionId}/${exportType}`, data, {responseType: 'blob'})
    }

    static printPlan(planId){
        return Axios.get(`/api/coordinator/plan/print/${planId}`, {responseType: 'blob'})
    }

    static updatePlan(planId){
        return Axios.put(`/api/coordinator/plan/update/${planId}`)
    }

    static deleteTargetUnit(unitId){
        return Axios.delete(`/api/coordinator/plan/position/deleteTargetUnit/${unitId}`)
    }

    static deleteInvestmentSource(positionId, sourceId){
        return Axios.delete(`/api/coordinator/plan/position/${positionId}/deleteSource/${sourceId}`)
    }
}

export default PlansApi;