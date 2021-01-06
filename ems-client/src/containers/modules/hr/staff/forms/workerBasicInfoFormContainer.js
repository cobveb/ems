import { reduxForm } from 'redux-form';
import WorkerBasicInfoForm from 'components/modules/hr/staff/forms/workerBasicInfoForm';
import {validate} from 'components/modules/hr/staff/forms/workerBasicInfoFormValid';


let WorkerBasicInfoFormContainer = reduxForm({
    form: 'WorkerBasicInfoForm',
    validate,
    enableReinitialize: true,
}) (WorkerBasicInfoForm)

export default WorkerBasicInfoFormContainer