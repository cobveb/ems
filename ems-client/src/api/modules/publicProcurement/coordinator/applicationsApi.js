import Axios from 'axios';

class ApplicationsApi {
    static getApplications(year){
        return Axios.get(`/api/public/coordinator/applications/${year}/getAllApplications`)
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
}

export default ApplicationsApi;