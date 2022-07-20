import Axios from 'axios';

class InvoiceApi {
    static getInvoices(year){
        return Axios.get(`/api/accountant/realization/invoice/${year}/getInvoices`)
    }
}

export default InvoiceApi;