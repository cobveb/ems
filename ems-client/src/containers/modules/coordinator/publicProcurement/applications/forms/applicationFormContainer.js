import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import ApplicationForm from 'components/modules/coordinator/publicProcurement/applications/forms/applicationForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/applicationFormValid';

let ApplicationFormContainer = reduxForm({
    form: 'ApplicationForm',
    validate,
    enableReinitialize: true,
}) (ApplicationForm)

ApplicationFormContainer = connect(state => {
        const formCurrentValues = getFormValues('ApplicationForm')(state)
        return{
            formCurrentValues,
        }
    }
)(ApplicationFormContainer)

export default ApplicationFormContainer