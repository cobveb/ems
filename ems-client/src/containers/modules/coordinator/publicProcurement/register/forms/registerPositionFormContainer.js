import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import RegisterPositionForm from 'components/modules/coordinator/publicProcurement/register/forms/registerPositionForm';
import {validate} from 'components/modules/coordinator/publicProcurement/register/forms/registerPositionFormValid';

let RegisterPositionFormContainer = reduxForm({
    form: 'RegisterPositionForm',
    validate,
    enableReinitialize: true,
}) (RegisterPositionForm)

const selector = formValueSelector('RegisterPositionForm') // <-- same as form name

RegisterPositionFormContainer = connect(state => {
        const planPosition = selector(state, 'planPosition')
        const isChangedEstimationType = selector(state, 'isChangedEstimationType')

        return{
            planPosition,
            isChangedEstimationType,
        }
    }
)(RegisterPositionFormContainer)

export default RegisterPositionFormContainer