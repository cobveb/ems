import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import ApplicationPlanPositionForm from 'components/modules/coordinator/publicProcurement/applications/forms/applicationPlanPositionForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/applicationPlanPositionFormValid';

let ApplicationPlanPositionFormContainer = reduxForm({
    form: 'ApplicationPlanPositionForm',
    touchOnChange: true,
    validate,
    enableReinitialize: true,
}) (ApplicationPlanPositionForm)

const selector = formValueSelector('ApplicationPlanPositionForm') // <-- same as form name
//
ApplicationPlanPositionFormContainer = connect(
    state => {
        // can select values individually
        const vat = selector(state, 'vat')
        const positionAmountNet = selector(state, 'positionAmountNet')

        return {
            vat,
            positionAmountNet,
        }
    }
)(ApplicationPlanPositionFormContainer)

export default ApplicationPlanPositionFormContainer