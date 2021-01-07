import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux'
import PlanFoundingSourcesForm from 'components/modules/coordinator/plans/forms/planFoundingSourcesForm';
import {validate} from 'components/modules/coordinator/plans/forms/planFoundingSourcesFormValid';


let PlanFoundingSourcesFormContainer = reduxForm({
    form: 'PlanFoundingSourcesForm',
    validate,
    enableReinitialize: true,
}) (PlanFoundingSourcesForm)

const selector = formValueSelector('PlanFoundingSourcesForm') // <-- same as form name
PlanFoundingSourcesFormContainer = connect(
    state => {
        // can select values individually
        const amountRequestedNet = selector(state, 'amountRequestedNet')
        const expensesPlanNet = selector(state, 'expensesPlanNet')
        const vat = selector(state,'vat')

        return {
            amountRequestedNet,
            expensesPlanNet,
            vat,
        }
    }
)(PlanFoundingSourcesFormContainer)

export default PlanFoundingSourcesFormContainer