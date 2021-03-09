import { reduxForm } from 'redux-form';
import PlanBasicInfoForm from 'components/modules/coordinator/plans/forms/planBasicInfoForm';
import {validate} from 'components/modules/coordinator/plans/forms/planBasicInfoFormValid';


let PlanBasicInfoFormContainer = reduxForm({
    form: 'PlanBasicInfoForm',
    touchOnChange: true,
    validate,
    enableReinitialize: true,
}) (PlanBasicInfoForm)

export default PlanBasicInfoFormContainer