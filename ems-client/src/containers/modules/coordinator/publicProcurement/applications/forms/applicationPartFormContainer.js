import { reduxForm, formValueSelector, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import ApplicationPartForm from 'components/modules/coordinator/publicProcurement/applications/forms/applicationPartForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/applicationPartFormValid';

let ApplicationPartFormContainer = reduxForm({
    form: 'ApplicationPartForm',
    validate,
    enableReinitialize: true,
    touchOnChange: true,
}) (ApplicationPartForm)

const selector = formValueSelector('ApplicationPartForm') // <-- same as form name

ApplicationPartFormContainer = connect(state => {
        const formCurrentValues = getFormValues('ApplicationPartForm')(state);
        const amountNet = selector(state, 'amountNet')
        const amountGross = selector(state, 'amountGross')
        const vat = selector(state, 'vat')
        const applicationProcurementPlanPosition = selector(state, "applicationProcurementPlanPosition")
        const isRealized = selector(state, "isRealized")
        const amountContractAwardedNet = selector(state, "amountContractAwardedNet")
        const optionValue = selector(state, "optionValue")
        const isOption = selector(state, "isOption")
        return{
            formCurrentValues,
            amountNet,
            amountGross,
            vat,
            applicationProcurementPlanPosition,
            isRealized,
            amountContractAwardedNet,
            optionValue,
            isOption
        }
    }
)(ApplicationPartFormContainer)

export default ApplicationPartFormContainer