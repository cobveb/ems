import { reduxForm } from 'redux-form';
import ParameterForm from 'components/modules/administrator/parameters/parameterForm';


let ParameterFormContainer = reduxForm({
    form: 'ParameterForm',
    enableReinitialize: true,
}) (ParameterForm)


export default ParameterFormContainer