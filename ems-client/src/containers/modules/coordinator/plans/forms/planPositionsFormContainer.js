import { reduxForm } from 'redux-form';
import PlanPositionsForm from 'components/modules/coordinator/plans/forms/planPositionsForm';
import {validate} from 'components/modules/coordinator/plans/forms/planPositionsFormValid';


let PlanPositionsFormContainer = reduxForm({
    form: 'PlanPositionsForm',
    validate,
    enableReinitialize: true,
}) (PlanPositionsForm)

export default PlanPositionsFormContainer