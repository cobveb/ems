import Axios from 'axios';

class PublicProcurementApi {

    static getPlanPositions(){
        return Axios.get(`/api/coordinator/publicProcurement/application/getPlanPositions`)
    }

    static getCoordinators(){
        return Axios.get(`/api/ou/getPublicProcurementApplicationCoordinators`)
    }

    static getApplications(){
        return Axios.get(`/api/coordinator/publicProcurement/application/getApplications`)
    }

    static saveApplication(action, data){
        return Axios.put(`/api/coordinator/publicProcurement/application/${action}/save`, data)
    }

    static saveApplicationAssortmentGroup(applicationId, action, data){
        return Axios.put(`/api/coordinator/publicProcurement/application/${applicationId}/${action}/saveAssortmentGroup`, data)
    }

    static deleteApplicationAssortmentGroup(assortmentGroupId){
        return Axios.delete(`/api/coordinator/publicProcurement/application/deleteAssortmentGroup/${assortmentGroupId}`)
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

    static exportApplicationsToExcel(exportType, data){
        return Axios.put(`/api/coordinator/publicProcurement/application/export/${exportType}`, data, {responseType: 'blob'})
    }

    static printApplication(applicationId){
        return Axios.get(`/api/coordinator/publicProcurement/application/print/${applicationId}`, {responseType: 'blob'})
    }


}

export default PublicProcurementApi;