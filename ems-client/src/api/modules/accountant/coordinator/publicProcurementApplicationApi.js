import Axios from 'axios';

class PublicProcurementApplicationApi {
    static getApplications(){
        return Axios.get(`/api/accountant/coordinator/publicProcurement/applications/getAllApplications`)
    }

    static approveApplication(applicationId){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/applications/application/approve/${applicationId}`)
    }

    static sendBackApplication(applicationId){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/applications/application/sendBack/${applicationId}`)
    }

    static exportApplicationsToExcel(exportType, data){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/applications/export/${exportType}`, data, {responseType: 'blob'})
    }
}

export default PublicProcurementApplicationApi;