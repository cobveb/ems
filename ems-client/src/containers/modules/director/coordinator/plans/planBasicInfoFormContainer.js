import { reduxForm,} from 'redux-form';
import PlanBasicInfoForm from 'components/modules/director/coordinator/plans/planBasicInfoForm';


let PlanBasicInfoFormContainer = reduxForm({
    form: 'PlanBasicInfoForm',
    touchOnChange: true,
    enableReinitialize: true,
}) (PlanBasicInfoForm)


export default PlanBasicInfoFormContainer