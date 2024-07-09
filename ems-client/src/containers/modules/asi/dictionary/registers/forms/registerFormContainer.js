import { reduxForm } from 'redux-form';
import RegisterForm from 'components/modules/asi/dictionary/registers/forms/registerForm';
import {validate} from 'components/modules/asi/dictionary/registers/forms/registerFormValid';

let RegisterFormContainer = reduxForm({
    form: 'RegisterForm',
    validate,
    enableReinitialize: true,
}) (RegisterForm)


export default RegisterFormContainer