import { reduxForm } from 'redux-form';
import UserForm from 'components/modules/administrator/users/userForm';
import {validate} from 'components/modules/administrator/users/userFormValid';


let UserFormContainer = reduxForm({
    form: 'UserForm',
    validate,
    enableReinitialize: true,
}) (UserForm)


export default UserFormContainer