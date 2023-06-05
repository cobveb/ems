import { reduxForm } from 'redux-form';
import EmployeeBasicInfoForm from 'components/modules/hr/employees/forms/employeeBasicInfoForm';
import {validate} from 'components/modules/hr/employees/forms/employeeBasicInfoFormValid';


let EmployeeBasicInfoFormContainer = reduxForm({
    form: 'EmployeeBasicInfoForm',
    validate,
    enableReinitialize: true,
}) (EmployeeBasicInfoForm)

export default EmployeeBasicInfoFormContainer