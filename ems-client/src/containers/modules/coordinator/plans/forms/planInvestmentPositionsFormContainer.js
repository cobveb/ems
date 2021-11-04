import { reduxForm, getFormValues, formValueSelector } from 'redux-form';
import { connect } from 'react-redux'
import PlanInvestmentPositionsForm from 'components/modules/coordinator/plans/forms/planInvestmentPositionsForm';
import { validate } from 'components/modules/coordinator/plans/forms/planInvestmentPositionsFormValid';

let PlanInvestmentPositionsFormContainer = reduxForm({
    form: 'PlanInvestmentPositionsForm',
    validate,
    touchOnChange: true,
    enableReinitialize: true,
}) (PlanInvestmentPositionsForm)

const selectorSubPosition = formValueSelector('PlanInvestmentPositionsForm') // <-- same as form name
PlanInvestmentPositionsFormContainer = connect(
    state => {
        // can select values individually
        const fundingSources = selectorSubPosition(state, 'fundingSources')
        const formCurrentValues = getFormValues('PlanInvestmentPositionsForm')(state)
        return {
            fundingSources,
            formCurrentValues
        }
    }
)(PlanInvestmentPositionsFormContainer)

export default PlanInvestmentPositionsFormContainer