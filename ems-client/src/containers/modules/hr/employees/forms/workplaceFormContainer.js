import { reduxForm } from 'redux-form';
import WorkplaceForm from 'components/modules/hr/employees/forms/workplaceForm';
import {validate} from 'components/modules/hr/employees/forms/workplaceFormValid';

let WorkplaceFormContainer = reduxForm({
    form: 'WorkplaceForm',
    validate,
    enableReinitialize: true,
}) (WorkplaceForm)

export default WorkplaceFormContainer