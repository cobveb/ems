import { reduxForm } from 'redux-form';
import UserForm from 'components/modules/administrator/userForm';
import {validate} from 'components/modules/administrator/userFormValid';


let UserFormContainer = reduxForm({
    form: 'UserForm',
    validate,
    enableReinitialize: true,
}) (UserForm)


export default UserFormContainer