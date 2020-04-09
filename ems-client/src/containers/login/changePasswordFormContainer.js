import { reduxForm } from 'redux-form';
import ChangePasswordForm from 'components/login/form/changePasswordForm';
import {validate} from 'components/login/form/valid/changePasswordFormValid';

let ChangePasswordFormContainer = reduxForm({
    form: 'ChangePasswordForm',
    validate,
    enableReinitialize: true,
}) (ChangePasswordForm)

export default ChangePasswordFormContainer