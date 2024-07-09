import { reduxForm } from 'redux-form';
import RegisterEntitlementSystemForm from 'components/modules/asi/dictionary/registers/forms/registerEntitlementSystemForm';


let RegisterEntitlementSystemFormContainer = reduxForm({
    form: 'RegisterEntitlementSystemForm',
    touchOnChange: true,
    enableReinitialize: true,
}) (RegisterEntitlementSystemForm)

export default RegisterEntitlementSystemFormContainer