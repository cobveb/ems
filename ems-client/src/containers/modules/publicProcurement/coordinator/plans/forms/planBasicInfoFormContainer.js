import { reduxForm, getFormValues,} from 'redux-form';
import { connect } from 'react-redux';
import PlanBasicInfoForm from 'components/modules/publicProcurement/coordinator/plans/forms/planBasicInfoForm';


let PlanBasicInfoFormContainer = reduxForm({
    form: 'PlanBasicInfoForm',
    touchOnChange: true,
    enableReinitialize: true,
}) (PlanBasicInfoForm)


PlanBasicInfoFormContainer = connect(state => {
        const formValues = getFormValues('PlanBasicInfoForm')(state)

        return{
            formValues,
        }
    }
)(PlanBasicInfoFormContainer)

export default PlanBasicInfoFormContainer