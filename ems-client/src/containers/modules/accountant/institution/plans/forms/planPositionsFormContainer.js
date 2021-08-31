import { reduxForm, getFormInitialValues, } from 'redux-form';
import { connect } from 'react-redux';
import PlanPositionsForm from 'components/modules/accountant/institution/plans/forms/planPositionsForm';

let PlanPositionsFormContainer = reduxForm({
    form: 'PlanPositionsForm',
    touchOnChange: true,
    enableReinitialize: true,
}) (PlanPositionsForm)

PlanPositionsFormContainer = connect(state => {
       const initValues= getFormInitialValues('PlanPositionsForm')(state)

       return{
           initValues,
       }
    }
)(PlanPositionsFormContainer)


export default PlanPositionsFormContainer