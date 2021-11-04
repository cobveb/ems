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
const selectorPlanPosition = formValueSelector('PlanInvestmentContentPositionForm') // <-- same as form name
PlanFoundingSourcesFormContainer = connect(
    state => {
        // can select values individually
        const sourceAmountGross = selectorFoundingSources(state, 'sourceAmountGross')
        const sourceExpensesPlanGross = selectorFoundingSources(state, 'sourceExpensesPlanGross')
        const sourceAmountAwardedGross = selectorFoundingSources(state, 'sourceAmountAwardedGross')
        const sourceExpensesPlanAwardedGross = selectorFoundingSources(state, 'sourceExpensesPlanAwardedGross')
        const sourceType = selectorFoundingSources(state, 'type')
        const vat = selectorPlanPosition(state, 'vat')
        return {
            sourceAmountGross,
            sourceExpensesPlanGross,
            sourceAmountAwardedGross,
            sourceExpensesPlanAwardedGross,
            sourceType,
            vat,
        }
    }
)(PlanFoundingSourcesFormContainer)

export default PlanFoundingSourcesFormContainer