import { reduxForm } from 'redux-form';
import WorkerFunctionsForm from 'components/modules/hr/staff/forms/workerFunctionsForm';
import {validate} from 'components/modules/hr/staff/forms/workerFunctionsFormValid';


let WorkerFunctionsFormContainer = reduxForm({
    form: 'WorkerFunctionsForm',
    validate,
    enableReinitialize: true,
}) (WorkerFunctionsForm)

export default WorkerFunctionsFormContainer