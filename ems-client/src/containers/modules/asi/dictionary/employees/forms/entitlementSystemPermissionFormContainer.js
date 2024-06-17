import { reduxForm } from 'redux-form';
import EntitlementSystemPermissionForm from 'components/modules/asi/dictionary/employees/forms/entitlementSystemPermissionForm';
import {validate} from 'components/modules/asi/dictionary/employees/forms/entitlementSystemPermissionFormValid';

let EntitlementSystemPermissionFormContainer = reduxForm({
    form: 'EntitlementSystemPermissionForm',
    validate,
    enableReinitialize: true,
}) (EntitlementSystemPermissionForm)


export default EntitlementSystemPermissionFormContainer