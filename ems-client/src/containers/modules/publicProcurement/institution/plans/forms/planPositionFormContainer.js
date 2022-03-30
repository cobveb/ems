import { reduxForm, getFormValues,} from 'redux-form';
import { connect } from 'react-redux';
import PlanPositionForm from 'components/modules/publicProcurement/institution/plans/forms/planPositionForm';


let PlanPositionFormContainer = reduxForm({
    form: 'PlanPositionForm',
    touchOnChange: true,
    enableReinitialize: true,
}) (PlanPositionForm)

PlanPositionFormContainer = connect(state => {
    const formCurrentValues = getFormValues('PlanPositionForm')(state)
    return{
        formCurrentValues,
    }
}
)(PlanPositionFormContainer)

export default PlanPositionFormContainer