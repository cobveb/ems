import { reduxForm } from 'redux-form';
import EntitlementSystemForm from 'components/modules/asi/dictionary/employees/forms/entitlementSystemForm';
import {validate} from 'components/modules/asi/dictionary/employees/forms/entitlementSystemFormValid';

let EntitlementSystemFormContainer = reduxForm({
    form: 'EntitlementSystemForm',
    validate,
    enableReinitialize: true,
}) (EntitlementSystemForm)


export default EntitlementSystemFormContainer