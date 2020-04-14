import { reduxForm } from 'redux-form';
import GroupUsersForm from 'components/modules/administrator/groups/groupUsersForm';

let GroupUsersFormContainer = reduxForm({
    form: 'GroupUsersForm',
    enableReinitialize: true,
}) (GroupUsersForm)


export default GroupUsersFormContainer