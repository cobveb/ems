import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux'
import PlanFoundingSourcesForm from 'components/modules/coordinator/plans/forms/planFoundingSourcesForm';
import {validate} from 'components/modules/coordinator/plans/forms/planFoundingSourcesFormValid';


let PlanFoundingSourcesFormContainer = reduxForm({
    form: 'PlanFoundingSourcesForm',
    validate,
    enableReinitialize: true,
}) (PlanFoundingSourcesForm)

const selectorFoundingSources = formValueSelector('PlanFoundingSourcesForm') // <-- same as form name
const selectorPlanPosition = formValueSelector('PlanPositionForm') // <-- same as form name
PlanFoundingSourcesFormContainer = connect(
    state => {
        // can select values individually
        const sourceAmountRequestedNet = selectorFoundingSources(state, 'sourceAmountRequestedNet')
        const sourceExpensesPlanNet = selectorFoundingSources(state, 'sourceExpensesPlanNet')
        const vat = selectorPlanPosition(state, 'vat')
        return {
            sourceAmountRequestedNet,
            sourceExpensesPlanNet,
            vat,
        }
    }
)(PlanFoundingSourcesFormContainer)

export default PlanFoundingSourcesFormContainer