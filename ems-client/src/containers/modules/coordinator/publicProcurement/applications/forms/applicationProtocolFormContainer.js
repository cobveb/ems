import { reduxForm, getFormValues, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import ApplicationProtocolForm from 'components/modules/coordinator/publicProcurement/applications/forms/applicationProtocolForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/applicationProtocolFormValid';

let ApplicationProtocolFormContainer = reduxForm({
    form: 'ApplicationProtocolForm',
    validate,
    enableReinitialize: true,
    touchOnChange: true,
}) (ApplicationProtocolForm)

ApplicationProtocolFormContainer = connect(state => {
    const formCurrentValues = getFormValues('ApplicationProtocolForm')(state)
    const formErrors =  getFormSyncErrors('ApplicationProtocolForm')(state);
    return{
        formCurrentValues,
        formErrors,
    }
})(ApplicationProtocolFormContainer)

export default ApplicationProtocolFormContainer