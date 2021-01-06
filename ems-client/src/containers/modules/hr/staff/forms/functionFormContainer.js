import { reduxForm } from 'redux-form';
import FunctionForm from 'components/modules/hr/staff/forms/functionForm';
import {validate} from 'components/modules/hr/staff/forms/functionFormValid';

let FunctionFormContainer = reduxForm({
    form: 'FunctionForm',
    validate,
    enableReinitialize: true,
}) (FunctionForm)

export default FunctionFormContainer