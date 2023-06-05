import { reduxForm } from 'redux-form';
import StatementForm from 'components/modules/hr/employees/forms/statementForm';
import {validate} from 'components/modules/hr/employees/forms/statementFormValid';

let StatementFormContainer = reduxForm({
    form: 'StatementForm',
    validate,
    enableReinitialize: true,
}) (StatementForm)

export default StatementFormContainer