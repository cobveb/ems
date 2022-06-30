import { reduxForm } from 'redux-form';
import InvoiceForm from 'components/modules/coordinator/realization/invoices/forms/invoiceForm';
import {validate} from 'components/modules/coordinator/realization/invoices/forms/invoiceFormValid';

let InvoiceFormContainer = reduxForm({
    form: 'InvoiceForm',
    validate,
    enableReinitialize: true,
    touchOnChange: true,
}) (InvoiceForm)

export default InvoiceFormContainer