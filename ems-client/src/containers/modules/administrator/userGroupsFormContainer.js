import { reduxForm } from 'redux-form';
import UserGroupsForm from 'components/modules/administrator/users/userGroupsForm';

let UserGroupsFormContainer = reduxForm({
    form: 'UserGroupForm',
    enableReinitialize: true,
}) (UserGroupsForm)


export default UserGroupsFormContainer