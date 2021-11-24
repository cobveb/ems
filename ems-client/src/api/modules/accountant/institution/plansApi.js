import Axios from 'axios';

class PlansApi{
    static getPlans(){
        return Axios.get(`/api/accountant/institution/plans/getPlans`)
    }

    static getPlan(planId){
        return Axios.get(`/api/accountant/institution/plans/getPlan/${planId}`)
    }

    static getCoordinatorPlanPositions(positionId){
        return Axios.get(`/api/accountant/institution/plans/getCoordinatorPlanPosition/${positionId}`)
    }

    static acceptPlanPositions(type, positionId, data){
        return Axios.put(`/api/accountant/institution/plans/acceptPlanPositions/${type}/${positionId}`, data)
    }

    static correctPlanPositions(type, positionId, data){
        return Axios.put(`/api/accountant/institution/plans/correctPlanPositions/${type}/${positionId}`, data)
    }

    static approvePlan(planId){
        return  Axios.put(`/api/accountant/institution/plans/approvePlan/${planId}`)
    }

    static withdrawPlan(planId){
        return  Axios.put(`/api/accountant/institution/plans/withdrawPlan/${planId}`)
    }

    static exportPlansToExcel(exportType, data){
        return Axios.put(`/api/accountant/institution/plans/export/plans/${exportType}`, data, {responseType: 'blob'})
    }

    static exportPlanPositionsToExcel(exportType, planType, planId, data){
        return Axios.put(`/api/accountant/institution/plans/export/planPositions/${planType}/${planId}/${exportType}`, data, {responseType: 'blob'})
    }

    static exportPlanSubPositionsToExcel(exportType, positionType, positionId, data){
        return Axios.put(`/api/accountant/institution/plans/export/planSubPositions/${positionType}/${positionId}/${exportType}`, data, {responseType: 'blob'})
    }

    static printPlan(planId){
        return Axios.get(`/api/accountant/institution/plans/plan/print/${planId}`, {responseType: 'blob'})
    }

    static checkDisableWithdraw(planId){
        return Axios.get(`/api/accountant/institution/plans/checkDisableWithdraw/${planId}`)
    }
}
export default PlansApi;