import Axios from 'axios';

class PublicProcurementApplicationApi {

    static getApplicationsPageable(data){
        return Axios.post(`/api/accountant/coordinator/publicProcurement/applications/getApplicationsPageable`, data)
    }

    static approveApplication(applicationId){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/applications/application/approve/${applicationId}`)
    }

    static sendBackApplication(applicationId){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/applications/application/sendBack/${applicationId}`)
    }

    static exportApplicationsToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/applications/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }
}

export default PublicProcurementApplicationApi;