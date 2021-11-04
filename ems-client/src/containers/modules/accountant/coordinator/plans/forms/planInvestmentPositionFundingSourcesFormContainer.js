import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PlanInvestmentPositionFoundingSourcesForm from 'components/modules/accountant/coordinator/plans/forms/planInvestmentPositionFoundingSourcesForm';
import {validate} from 'components/modules/accountant/coordinator/plans/forms/planInvestmentPositionFoundingSourcesFormValid';


let PlanInvestmentPositionFoundingSourcesFormContainer = reduxForm({
    form: 'PlanInvestmentPositionFoundingSourcesForm',
    validate,
    enableReinitialize: true,
}) (PlanInvestmentPositionFoundingSourcesForm)

const selectorFoundingSources = formValueSelector('PlanInvestmentPositionFoundingSourcesForm') // <-- same as form name
const selectorPosition = formValueSelector('CoordinatorPlanInvestmentPositionForm') // <-- same as form name
PlanInvestmentPositionFoundingSourcesFormContainer = connect(
    state => {
        // can select values individually
        const sourceAmountAwardedGross = selectorFoundingSources(state, 'sourceAmountAwardedGross')
        const sourceExpensesPlanAwardedGross = selectorFoundingSources(state, 'sourceExpensesPlanAwardedGross')
        const amountAwardedNet = selectorPosition(state, 'amountAwardedNet')
        const amountAwardedGross = selectorPosition(state, 'amountAwardedGross')
        const expensesPositionAwardedNet = selectorPosition(state, 'expensesPositionAwardedNet')
        const expensesPositionAwardedGross = selectorPosition(state, 'expensesPositionAwardedGross')
        return {
            sourceAmountAwardedGross,
            sourceExpensesPlanAwardedGross,
            amountAwardedNet,
            amountAwardedGross,
            expensesPositionAwardedNet,
            expensesPositionAwardedGross,
        }
    }
)(PlanInvestmentPositionFoundingSourcesFormContainer)

export default PlanInvestmentPositionFoundingSourcesFormContainer