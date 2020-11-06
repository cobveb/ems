import { reduxForm } from 'redux-form';
import ApplicationPositionForm from 'components/modules/applicant/applications/forms/applicationPositionForm';
import {validate} from 'components/modules/applicant/applications/forms/applicationPositionFormValid';

let ApplicationPositionFormContainer = reduxForm({
    form: 'ApplicationPositionForm',
    validate,
    enableReinitialize: true,
}) (ApplicationPositionForm)


export default ApplicationPositionFormContainer