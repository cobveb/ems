import { reduxForm, formValueSelector } from 'redux-form';
import EmploymentForm from 'components/modules/hr/employees/forms/employmentForm';
import {validate} from 'components/modules/hr/employees/forms/employmentFormValid';
import { connect } from 'react-redux'

let EmploymentFormContainer = reduxForm({
    form: 'EmploymentForm',
    validate,
    touchOnChange: true,
    touchOnBlur: true,
    enableReinitialize: true,
}) (EmploymentForm)

const selector = formValueSelector('EmploymentForm') // <-- same as form name

EmploymentFormContainer = connect(state => {
    const employmentType = selector(state, 'employmentType')
    const isStatement = selector(state, 'isStatement')
    const isAuthorization = selector(state, 'isAuthorization')
    return{
        employmentType,
        isStatement,
        isAuthorization,
    }
}
)(EmploymentFormContainer)

export default EmploymentFormContainer