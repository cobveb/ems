import { reduxForm } from 'redux-form';
import RegisterForm from 'components/modules/iod/registers/forms/registerForm';

let RegisterFormContainer = reduxForm({
    form: 'RegisterForm',
    enableReinitialize: true,
}) (RegisterForm)


export default RegisterFormContainer