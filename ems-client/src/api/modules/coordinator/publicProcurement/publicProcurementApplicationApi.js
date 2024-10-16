import Axios from 'axios';

class PublicProcurementApplicationApi {

    static getApplicationProcurementPlanPosition(coordinator){
        return Axios.get(`/api/coordinator/publicProcurement/application/${coordinator}/getApplicationProcurementPlanPosition`)
    }

    static getPlanPositions(planType){
        return Axios.get(`/api/coordinator/publicProcurement/application/${planType}/getPlanPositions`)
    }

    static getCoordinators(){
        return Axios.get(`/api/ou/getPublicProcurementApplicationCoordinators`)
    }

    static getReplayApplications(year){
        return Axios.get(`/api/coordinator/publicProcurement/application/${year}/getReplayApplications`)
    }

    static getApplicationsPageable(data){
        return Axios.post(`/api/coordinator/publicProcurement/application/getApplicationsPageable`, data)
    }

    static getApplicationsDictionary(conditions){
        return Axios.post(`/api/coordinator/publicProcurement/application/getApplicationsDictionary`, conditions)
    }

    static getApplication(applicationId){
        return Axios.get(`/api/coordinator/publicProcurement/application/getApplication/${applicationId}`)
    }

    static saveApplication(action, data){
        return Axios.put(`/api/coordinator/publicProcurement/application/${action}/save`, data)
    }

    static saveApplicationAssortmentGroup(applicationId, action, data){
        return Axios.put(`/api/coordinator/publicProcurement/application/${applicationId}/${action}/saveAssortmentGroup`, data)
    }

    static saveAssortmentGroupSubsequentYear(assortmentGroupPlanPositionId, action, data){
        return Axios.put(`/api/coordinator/publicProcurement/application/${assortmentGroupPlanPositionId}/${action}/saveAssortmentGroupSubsequentYear`, data)
    }

    static deleteAssortmentGroupSubsequentYear(assortmentGroupPlanPositionId, subsequentYearId){
        return Axios.delete(`/api/coordinator/publicProcurement/application/${assortmentGroupPlanPositionId}/deleteAssortmentGroupSubsequentYear/${subsequentYearId}`)
    }

    static deleteApplicationAssortmentGroup(assortmentGroupId){
        return Axios.delete(`/api/coordinator/publicProcurement/application/deleteAssortmentGroup/${assortmentGroupId}`)
    }

    static deleteApplicationAssortmentGroupPlanPosition(planPositionId){
        return Axios.delete(`/api/coordinator/publicProcurement/application/deleteApplicationAssortmentGroupPlanPosition/${planPositionId}`)
    }

    static savePart(applicationId, action, data){
        return Axios.put(`/api/coordinator/publicProcurement/application/${applicationId}/${action}/savePart`, data)
    }

    static deletePart(partId){
        return Axios.delete(`/api/coordinator/publicProcurement/application/deletePart/${partId}`)
    }

    static saveCriterion(applicationId, action, data){
        return Axios.put(`/api/coordinator/publicProcurement/application/${applicationId}/${action}/saveCriterion`, data)
    }

    static deleteCriterion(criterionId){
        return Axios.delete(`/api/coordinator/publicProcurement/application/deleteCriterion/${criterionId}`)
    }

    static sendApplication(applicationId){
        return Axios.put(`/api/coordinator/publicProcurement/application/send/${applicationId}`)
    }

    static withdrawApplication(applicationId){
        return Axios.put(`/api/coordinator/publicProcurement/application/withdraw/${applicationId}`)
    }

    static deleteApplication(applicationId){
        return Axios.delete(`/api/coordinator/publicProcurement/application/delete/${applicationId}`)
    }

    static exportApplicationsToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/coordinator/publicProcurement/application/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }

    static exportApplicationPartToExcel(exportType, applicationId, data){
        return Axios.put(`/api/coordinator/publicProcurement/application/${applicationId}/export/parts/${exportType}`, data, {responseType: 'blob'})
    }

    static printApplication(applicationId){
        return Axios.get(`/api/coordinator/publicProcurement/application/print/${applicationId}`, {responseType: 'blob'})
    }
}

export default PublicProcurementApplicationApi;