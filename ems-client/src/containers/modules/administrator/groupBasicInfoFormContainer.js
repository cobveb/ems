import { reduxForm } from 'redux-form';
import GroupBasicInfoForm from 'components/modules/administrator/groups/groupBasicInfoForm';
import {validate} from 'components/modules/administrator/groups/groupBasicInfoFormValid';


let GroupBasicInfoFormContainer = reduxForm({
    form: 'GroupBasicInfoForm',
    validate,
    enableReinitialize: true,
}) (GroupBasicInfoForm)


export default GroupBasicInfoFormContainer