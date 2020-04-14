import { reduxForm } from 'redux-form';
import OrganizationUnitForm from 'components/modules/administrator/ou/organizationUnitForm';
import {validate} from 'components/modules/administrator/institution/institutionFormValid';


let OrganizationUnitFormContainer = reduxForm({
    form: 'OrganizationUnitForm',
    validate,
    enableReinitialize: true,
}) (OrganizationUnitForm)


export default OrganizationUnitFormContainer