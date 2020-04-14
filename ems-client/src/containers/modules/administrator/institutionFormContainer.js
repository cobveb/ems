import { reduxForm } from 'redux-form';
import InstitutionForm from 'components/modules/administrator/institution/institutionForm';
import {validate} from 'components/modules/administrator/institution/institutionFormValid';

let InstitutionFormContainer = reduxForm({
    form: 'InstitutionForm',
    validate,
    enableReinitialize: true,
}) (InstitutionForm)


export default InstitutionFormContainer