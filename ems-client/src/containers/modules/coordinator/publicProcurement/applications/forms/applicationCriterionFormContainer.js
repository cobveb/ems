import { reduxForm } from 'redux-form';
import ApplicationCriterionForm from 'components/modules/coordinator/publicProcurement/applications/forms/applicationCriterionForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/applicationCriterionFormValid';

let ApplicationCriterionFormContainer = reduxForm({
    form: 'ApplicationCriterionForm',
    validate,
    enableReinitialize: true,
}) (ApplicationCriterionForm)

export default ApplicationCriterionFormContainer