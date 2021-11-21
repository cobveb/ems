import { reduxForm } from 'redux-form';
import PlanUpdateForm from 'components/modules/accountant/coordinator/plans/forms/planUpdateForm';

let PlanUpdateFormContainer = reduxForm({
    form: 'PlanUpdateForm',
    touchOnChange: true,
    enableReinitialize: true,
}) (PlanUpdateForm)

export default PlanUpdateFormContainer