import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux'
import PlanPositionForm from 'components/modules/coordinator/plans/forms/planPositionForm';
import {validate} from 'components/modules/coordinator/plans/forms/planPositionFormValid';

let PlanPositionFormContainer = reduxForm({
    form: 'PlanPositionForm',
    validate,
    enableReinitialize: true,
}) (PlanPositionForm)

const selector = formValueSelector('PlanPositionForm') // <-- same as form name
PlanPositionFormContainer = connect(
    state => {
        // can select values individually
        const amountRequestedNet = selector(state, 'amountRequestedNet')
        const vat = selector(state,'vat')

        return {
            amountRequestedNet,
            vat,
        }
    }
)(PlanPositionFormContainer)


export default PlanPositionFormContainer