import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import ApplicationPriceForm from 'components/modules/coordinator/publicProcurement/applications/forms/applicationPriceForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/applicationPriceFormValid';

let ApplicationPriceFormContainer = reduxForm({
    form: 'ApplicationPriceForm',
    validate,
    enableReinitialize: true,
}) (ApplicationPriceForm)

const selector = formValueSelector('ApplicationPriceForm') // <-- same as form name

ApplicationPriceFormContainer = connect(state => {
        const amountContractAwardedNet = selector(state, 'amountContractAwardedNet')
//        const vat = selector(state, 'applicationAssortmentGroup.vat')
        const vat = selector(state, 'vat')
        const applicationAssortmentGroup = selector(state, "applicationAssortmentGroup")
        return{
            amountContractAwardedNet,
            vat,
//            curVat,
            applicationAssortmentGroup,
        }
    }
)(ApplicationPriceFormContainer)

export default ApplicationPriceFormContainer