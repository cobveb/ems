import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import GeneratorCostTypeForm from 'components/modules/accountant/dictionary/forms/generatorCostTypeForm';
import {validate} from 'components/modules/accountant/dictionary/forms/generatorCostTypeFormValid';

let GeneratorCostTypeFormContainer = reduxForm({
    form: 'GeneratorCostTypeForm',
    touchOnChange: true,
    validate,
    enableReinitialize: true,
}) (GeneratorCostTypeForm)

GeneratorCostTypeFormContainer = connect(state => {
        const formGeneratorValues = getFormValues('GeneratorCostTypeForm')(state)

        return{
            formGeneratorValues,
        }
    }
)(GeneratorCostTypeFormContainer)


export default GeneratorCostTypeFormContainer