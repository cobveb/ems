import { reduxForm } from 'redux-form';
import EntitlementGroupForm from 'components/modules/asi/employees/forms/entitlementGroupForm';
import {validate} from 'components/modules/asi/employees/forms/entitlementGroupFormValid';

let EntitlementGroupFormContainer = reduxForm({
    form: 'EntitlementGroupForm',
    validate,
    enableReinitialize: true,
}) (EntitlementGroupForm)


export default EntitlementGroupFormContainer