import { reduxForm} from 'redux-form';
import PlanPositionRemarksForm from 'components/modules/accountant/coordinator/plans/forms/planPositionRemarksForm.js';

let PlanPositionRemarksFormContainer = reduxForm({
    form: 'PlanPositionRemarksForm',
    touchOnChange: true,
    enableReinitialize: true,
}) (PlanPositionRemarksForm)


export default PlanPositionRemarksFormContainer