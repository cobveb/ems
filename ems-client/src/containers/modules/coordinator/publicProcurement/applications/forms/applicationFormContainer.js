import { reduxForm, getFormValues, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import ApplicationForm from 'components/modules/coordinator/publicProcurement/applications/forms/applicationForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/applicationFormValid';

let ApplicationFormContainer = reduxForm({
    form: 'ApplicationForm',
    validate,
    enableReinitialize: true,
//    touchOnChange: true,
}) (ApplicationForm)

ApplicationFormContainer = connect(state => {
    const formCurrentValues = getFormValues('ApplicationForm')(state);
    const groupCurrentValues = getFormValues('ApplicationAssortmentGroupsForm')(state);
    const formErrors =  getFormSyncErrors('ApplicationForm')(state);
    return{
        formCurrentValues,
        formErrors,
        groupCurrentValues,
    }
})(ApplicationFormContainer)

export default ApplicationFormContainer