import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlanBasicInfoFormContainer from 'containers/modules/coordinator/plans/forms/planBasicInfoFormContainer';

class Plan extends Component {

    handleSubmitPlan = (values) => {
        this.props.onSubmitPlan(values);
    }

    render(){
        const { initialValues, plans, action, onClose, types, vats, units, costsTypes, modes, assortmentGroups, orderTypes, estimationTypes, submit, isSubmit,  } = this.props;
        return(
            <>
                <PlanBasicInfoFormContainer
                    initialValues={initialValues}
                    plans={plans}
                    action={action}
                    types={types}
                    vats={vats}
                    units={units}
                    costsTypes={costsTypes}
                    modes={modes}
                    assortmentGroups={assortmentGroups}
                    orderTypes={orderTypes}
                    estimationTypes={estimationTypes}
                    onClose={() => onClose(initialValues)}
                    onSubmitPlanPosition={this.props.onSubmitPlanPosition}
                    onDeletePlanPosition={this.props.onDeletePlanPosition}
                    onSendPlan={this.props.onSendPlan}
                    onSubmit={this.handleSubmitPlan}
                    submitAction={submit}
                    isSubmit={isSubmit}
                />
            </>
        );
    };
};
Plan.propTypes = {
    classes: PropTypes.object,
    initialValues: PropTypes.object,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
}
export default Plan;