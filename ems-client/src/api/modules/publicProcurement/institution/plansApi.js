import Axios from 'axios';

class PlansApi{
    static getPlans(){
        return Axios.get(`/api/public/institution/plans/getPlans`)
    }

    static getPlanPositions(planId){
        return Axios.get(`/api/public/institution/plans/${planId}/getPlanPositions`)
    }

    static getSubPositions(positionId){
        return Axios.get(`/api/public/institution/plans/plan/${positionId}/getSubPositions`)
    }

    static printPlan(planId, type){
        return Axios.get(`/api/public/institution/plans/plan/print/${planId}/${type}`, {responseType: 'blob'})
    }

    static exportPlanPositionsToExcel(exportType, planId, data){
        return Axios.put(`/api/public/institution/plans/export/planPositions/${planId}/${exportType}`, data, {responseType: 'blob'})
    }
}
export default PlansApi;