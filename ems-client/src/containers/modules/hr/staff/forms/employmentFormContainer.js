import { reduxForm } from 'redux-form';
import EmploymentForm from 'components/modules/hr/staff/forms/employmentForm';
import {validate} from 'components/modules/hr/staff/forms/employmentFormValid';

let EmploymentFormContainer = reduxForm({
    form: 'EmploymentForm',
    validate,
    enableReinitialize: true,
}) (EmploymentForm)

export default EmploymentFormContainer