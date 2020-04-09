import { reduxForm } from 'redux-form';
import OrganizationUnitForm from 'components/modules/administrator/organizationUnitForm';
import {validate} from 'components/modules/administrator/institutionFormValid';


let OrganizationUnitFormContainer = reduxForm({
    form: 'OrganizationUnitForm',
    validate,
    enableReinitialize: true,
}) (OrganizationUnitForm)


export default OrganizationUnitFormContainer