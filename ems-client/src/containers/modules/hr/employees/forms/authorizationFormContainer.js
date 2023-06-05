import { reduxForm } from 'redux-form';
import AuthorizationForm from 'components/modules/hr/employees/forms/authorizationForm';
import {validate} from 'components/modules/hr/employees/forms/authorizationFormValid';

let AuthorizationFormContainer = reduxForm({
    form: 'AuthorizationForm',
    validate,
    enableReinitialize: true,
}) (AuthorizationForm)

export default AuthorizationFormContainer