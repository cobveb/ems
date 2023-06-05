import { reduxForm } from 'redux-form';
import RegisterPositionForm from 'components/modules/iod/registers/forms/registerPositionForm';
import {validate} from 'components/modules/iod/registers/forms/registerPositionFormValid';

let RegisterPositionFormContainer = reduxForm({
    form: 'RegisterPositionForm',
    validate,
    enableReinitialize: true,
    touchOnChange: true,
}) (RegisterPositionForm)

export default RegisterPositionFormContainer;