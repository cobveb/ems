import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PlanInvestmentPositionForm from 'components/modules/accountant/coordinator/plans/forms/planInvestmentPositionForm';
import { validate } from 'components/modules/accountant/coordinator/plans/forms/planInvestmentPositionFormValid';

let PlanInvestmentPositionFormContainer = reduxForm({
    form: 'CoordinatorPlanInvestmentPositionForm',
    validate,
    touchOnChange: true,
    enableReinitialize: true,
}) (PlanInvestmentPositionForm)

const selectorPosition = formValueSelector('CoordinatorPlanInvestmentPositionForm') // <-- same as form name

PlanInvestmentPositionFormContainer = connect(
    state => {
        // can select values individually
        const amountAwardedNet = selectorPosition(state, 'amountAwardedNet')
        const amountAwardedGross = selectorPosition(state, 'amountAwardedGross')
        const expensesPositionAwardedNet = selectorPosition(state, 'expensesPositionAwardedNet')
        const expensesPositionAwardedGross = selectorPosition(state, 'expensesPositionAwardedGross')
        return {
            amountAwardedNet,
            amountAwardedGross,
            expensesPositionAwardedNet,
            expensesPositionAwardedGross,
        }
    }
)(PlanInvestmentPositionFormContainer)

export default PlanInvestmentPositionFormContainer