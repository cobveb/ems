import Axios from 'axios';

class ApplicationsApi {

    static getApplicationsPageable(data){
        return Axios.post(`/api/public/coordinator/applications/getApplicationsPageable`, data)
    }

    static approveApplication(applicationId){
        return Axios.put(`/api/public/coordinator/applications/approve/${applicationId}`)
    }

    static sendBackApplication(applicationId){
        return Axios.put(`/api/public/coordinator/applications/sendBack/${applicationId}`)
    }

    static confirmRealization(applicationId){
        return Axios.put(`/api/public/coordinator/applications/confirmRealization/${applicationId}`)
    }

    static rollbackPartRealization(applicationId, data){
        return Axios.put(`/api/public/coordinator/applications/rollbackPartRealization/${applicationId}`, data)
    }

    static rollbackRealization(applicationId, data){
        return Axios.put(`/api/public/coordinator/applications/rollbackRealization/${applicationId}`)
    }

    static setPublicRealization(applicationId){
        return Axios.put(`/api/public/coordinator/applications/${applicationId}/setPublicRealization`)
    }

    static exportApplicationsToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/public/coordinator/applications/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }
}

export default ApplicationsApi;