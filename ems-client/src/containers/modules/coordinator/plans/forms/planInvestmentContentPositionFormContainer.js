import { reduxForm } from 'redux-form';
import PlanInvestmentContentPositionForm from 'components/modules/coordinator/plans/forms/planInvestmentContentPositionForm';
import { validate } from 'components/modules/coordinator/plans/forms/planInvestmentContentPositionFormValid';


let PlanInvestmentContentPositionFormContainer = reduxForm({
    form: 'PlanInvestmentContentPositionForm',
    touchOnChange: true,
    validate,
    enableReinitialize: true,
}) (PlanInvestmentContentPositionForm)

export default PlanInvestmentContentPositionFormContainer