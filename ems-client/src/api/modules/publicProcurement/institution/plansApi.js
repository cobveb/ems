import Axios from 'axios';

class PlansApi{
    static getPlans(year){
        return Axios.get(`/api/public/institution/plans/${year}/getPlans`)
    }

    static getPlanPositions(planId){
        return Axios.get(`/api/public/institution/plans/${planId}/getPlanPositions`)
    }

    static getPositionDetails(positionId){
        return Axios.get(`/api/public/institution/plans/plan/${positionId}/getPositionDetails`)
    }

    static getSubPositions(positionId){
        return Axios.get(`/api/public/institution/plans/plan/${positionId}/getSubPositions`)
    }

    static correctPlanPositions(data){
        return Axios.put(`/api/public/institution/plans/plan/correctPlanPosition`, data)
    }

    static approvePlanPositions(positionId){
        return Axios.put(`/api/public/institution/plans/plan/approvePlanPosition/${positionId}`)
    }

    static approvePlan(planId){
        return Axios.put(`/api/public/institution/plans/plan/${planId}/approvePlan`)
    }

    static withdrawPlan(planId){
        return Axios.put(`/api/public/institution/plans/plan/${planId}/withdrawPlan`)
    }

    static printPlan(planId, type){
        return Axios.get(`/api/public/institution/plans/plan/print/${planId}/${type}`, {responseType: 'blob'})
    }

    static exportPlanPositionsToExcel(exportType, planId, data){
        return Axios.put(`/api/public/institution/plans/export/planPositions/${planId}/${exportType}`, data, {responseType: 'blob'})
    }
}
export default PlansApi;