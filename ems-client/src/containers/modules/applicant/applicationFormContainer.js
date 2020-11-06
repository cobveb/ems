import { reduxForm } from 'redux-form';
import ApplicationForm from 'components/modules/applicant/applications/forms/applicationForm';
import {validate} from 'components/modules/applicant/applications/forms/applicationFormValid';


let ApplicationFormContainer = reduxForm({
    form: 'ApplicationForm',
    validate,
    enableReinitialize: true,
}) (ApplicationForm)

export default ApplicationFormContainer