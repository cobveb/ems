import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux'
import PlanFinancialPositionsForm from 'components/modules/coordinator/plans/forms/planFinancialPositionsForm';
import {validate} from 'components/modules/coordinator/plans/forms/planFinancialPositionsFormValid';


let PlanFinancialPositionsFormContainer = reduxForm({
    form: 'PlanFinancialPositionsForm',
    validate,
    enableReinitialize: true,
}) (PlanFinancialPositionsForm)

const selectorPlanFinancialContentPositionForm = formValueSelector('PlanFinancialContentPositionForm') // <-- same as form name
const selectorPlanFinancialPositions = formValueSelector('PlanFinancialPositionsForm') // <-- same as form name
PlanFinancialPositionsFormContainer = connect(
    state => {
        // can select values individually
        const quantity = selectorPlanFinancialPositions(state, 'quantity')
        const unitPrice = selectorPlanFinancialPositions(state, 'unitPrice')
        const vat = selectorPlanFinancialContentPositionForm(state, 'vat')
        return {
            quantity,
            unitPrice,
            vat,
        }
    }
)(PlanFinancialPositionsFormContainer)

export default PlanFinancialPositionsFormContainer