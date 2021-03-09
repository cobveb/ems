import { reduxForm } from 'redux-form';
import PlanInvestmentContentPositionForm from 'components/modules/coordinator/plans/forms/planInvestmentContentPositionForm';
import {validate} from 'components/modules/coordinator/plans/forms/planInvestmentContentPositionFormValid';


let PlanInvestmentContentPositionFormContainer = reduxForm({
    form: 'planInvestmentContentPositionForm',
    validate,
    enableReinitialize: true,
}) (PlanInvestmentContentPositionForm)

export default PlanInvestmentContentPositionFormContainer