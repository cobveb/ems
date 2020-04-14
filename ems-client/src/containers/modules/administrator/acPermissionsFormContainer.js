import { reduxForm, formValueSelector  } from 'redux-form';
import { connect } from 'react-redux'
import AcPermissionsForm from 'components/modules/administrator/common/acPermissionsForm';

let AcPermissionsFormContainer = reduxForm({
    form: 'AcPermissionsForm',
    enableReinitialize: true,
}) (AcPermissionsForm)

const selector = formValueSelector('AcPermissionsForm') // <-- same as form name
AcPermissionsFormContainer = connect(
    state => {
        // can select values individually
        const selectedObject = selector(state, 'permissions.acObject') ? selector(state, 'permissions.acObject') : []
        const selectedPrivileges = selector(state,'permissions.privileges')

        return {
            selectedObject,
            selectedPrivileges,
        }
    }
)(AcPermissionsFormContainer)

export default AcPermissionsFormContainer