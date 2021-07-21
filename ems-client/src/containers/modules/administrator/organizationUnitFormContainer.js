import { reduxForm, formValueSelector } from 'redux-form';
import OrganizationUnitForm from 'components/modules/administrator/ou/organizationUnitForm';
import {validate} from 'components/modules/administrator/ou/organizationUnitFormValid';
import { connect } from 'react-redux';

let OrganizationUnitFormContainer = reduxForm({
    form: 'OrganizationUnitForm',
    validate,
    enableReinitialize: true,
}) (OrganizationUnitForm)

const selector = formValueSelector('OrganizationUnitForm') // <-- same as form name

OrganizationUnitFormContainer = connect(
    state => {
        // can select values individually
        const role = selector(state, 'role')

        return {
            role,
        }
    }
)(OrganizationUnitFormContainer)


export default OrganizationUnitFormContainer