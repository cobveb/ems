import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import InvoicePositionForm from 'components/modules/coordinator/realization/invoices/forms/invoicePositionForm';
import {validate} from 'components/modules/coordinator/realization/invoices/forms/invoicePositionFormValid';

let InvoicePositionFormContainer = reduxForm({
    form: 'InvoicePositionForm',
    validate,
    enableReinitialize: true,
//    touchOnChange: true,
}) (InvoicePositionForm)

const selector = formValueSelector('InvoicePositionForm') // <-- same as form name

InvoicePositionFormContainer = connect(state => {
    const positionIncludedPlanType = selector(state, 'positionIncludedPlanType');
    const amountGross = selector(state, 'amountGross')
    const optionValueNet = selector(state, 'optionValueNet')
    const optionValueGross = selector(state, 'optionValueGross')
    const vat = selector(state, 'vat')

    return{
        positionIncludedPlanType,
        amountGross,
        optionValueNet,
        optionValueGross,
        vat,
    }
})(InvoicePositionFormContainer)

export default InvoicePositionFormContainer