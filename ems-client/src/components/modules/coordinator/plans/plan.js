import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlanBasicInfoFormContainer from 'containers/modules/coordinator/plans/forms/planBasicInfoFormContainer';

class Plan extends Component {

    handleSubmitPlan = (values) => {
        this.props.onSubmitPlan(values);
    }

    render(){
        const { initialValues, plans, action, onClose, types, vats, units, costsTypes, modes, assortmentGroups, orderTypes, estimationTypes, submit,  } = this.props;
        return(
            <>
                <PlanBasicInfoFormContainer
                    initialValues={initialValues}
                    newPosition={this.props.newPosition}
                    setNewPositionToNull={this.props.setNewPositionToNull}
                    plans={plans}
                    action={action}
                    types={types}
                    vats={vats}
                    units={units}
                    costsTypes={costsTypes}
                    modes={modes}
                    assortmentGroups={assortmentGroups}
                    foundingSources={this.props.foundingSources}
                    unassignedUnits={this.props.unassignedUnits}
                    investmentCategories={this.props.investmentCategories}
                    orderTypes={orderTypes}
                    estimationTypes={estimationTypes}
                    euroExchangeRate={this.props.euroExchangeRate}
                    onClose={() => onClose(initialValues)}
                    onSubmitPlanPosition={this.props.onSubmitPlanPosition}
                    onDeletePlanPosition={this.props.onDeletePlanPosition}
                    onSubmitPlanSubPosition={this.props.onSubmitPlanPosition}
                    onDeletePlanSubPosition={this.props.onDeletePlanSubPosition}
                    onDeleteTargetUnit={this.props.onDeleteTargetUnit}
                    onDeleteSource={this.props.onDeleteSource}
                    onExcelExport={this.props.onExcelExport}
                    onSendPlan={this.props.onSendPlan}
                    onPrintPlan={this.props.onPrintPlan}
                    onSubmit={this.handleSubmitPlan}
                    submitAction={submit}
                />
            </>
        );
    };
};
Plan.propTypes = {
    classes: PropTypes.object,
    initialValues: PropTypes.object,
    action: PropTypes.oneOf(['add', 'edit', 'update']).isRequired,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
}
export default Plan;