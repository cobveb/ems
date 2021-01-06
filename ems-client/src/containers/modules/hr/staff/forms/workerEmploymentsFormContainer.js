import { reduxForm } from 'redux-form';
import WorkerEmploymentsForm from 'components/modules/hr/staff/forms/workerEmploymentsForm';
import {validate} from 'components/modules/hr/staff/forms/workerEmploymentsFormValid';


let WorkerEmploymentsFormContainer = reduxForm({
    form: 'WorkerEmploymentsForm',
    validate,
    enableReinitialize: true,
}) (WorkerEmploymentsForm)

export default WorkerEmploymentsFormContainer