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

}

export default PlansApi;