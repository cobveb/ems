import Axios from 'axios';

class InvoicesApi {

    static getInvoices(){
        return Axios.get(`/api/coordinator/realization/invoice/getInvoices`)
    }

    static saveInvoice(action, data){
        return Axios.put(`/api/coordinator/realization/invoice/${action}/saveInvoice`, data)
    }

    static deleteInvoice(invoiceId){
        return Axios.delete(`/api/coordinator/realization/invoice/deleteInvoice/${invoiceId}`)
    }

    static getInvoicePositions(invoiceId){
        return Axios.get(`/api/coordinator/realization/invoice/${invoiceId}/getInvoicePositions`)
    }

    static getInvoicesPositionsByCoordinatorPlanPosition(planType, planPositionId){
        return Axios.get(`/api/coordinator/realization/invoice/planPosition/${planType}/${planPositionId}/getInvoicePositions`)
    }

    static saveInvoicePosition(invoiceId, action, data){
        return Axios.put(`/api/coordinator/realization/invoice/${invoiceId}/${action}/saveInvoicePosition`, data)
    }

    static deleteInvoicePosition(positionId){
        return Axios.delete(`/api/coordinator/realization/invoice/deleteInvoicePosition/${positionId}`)
    }
}

export default InvoicesApi;