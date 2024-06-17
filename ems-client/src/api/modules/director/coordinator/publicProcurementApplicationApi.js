import Axios from 'axios';

class PublicProcurementApplicationApi {
    static getApplications(year){
        return Axios.get(`/api/director/coordinator/publicProcurement/applications/${year}/getAllApplications`)
    }

    static getApplicationsPageable(data){
        return Axios.post(`/api/director/coordinator/publicProcurement/applications/getApplicationsPageable`, data)
    }

    static approveDirector(applicationId){
        return Axios.put(`/api/director/coordinator/publicProcurement/applications/application/directorApprove/${applicationId}`)
    }

    static approveMedical(applicationId){
        return Axios.put(`/api/director/coordinator/publicProcurement/applications/application/medicalApprove/${applicationId}`)
    }

    static approveChief(applicationId){
        return Axios.put(`/api/director/coordinator/publicProcurement/applications/application/chiefApprove/${applicationId}`)
    }

    static sendBackApplication(applicationId){
        return Axios.put(`/api/director/coordinator/publicProcurement/applications/application/sendBack/${applicationId}`)
    }
}

export default PublicProcurementApplicationApi;