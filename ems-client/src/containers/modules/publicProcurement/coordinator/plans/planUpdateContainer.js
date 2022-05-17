import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PlanUpdateFormContainer from 'containers/modules/coordinator/plans/forms/planUpdateFormContainer';
import {findSelectFieldPosition, generateExportLink, publicProcurementEstimationTypes, getCoordinatorPlanPositionsStatuses, publicProcurementOrderTypes, getVats} from 'utils';
import PlansApi from 'api/modules/publicProcurement/coordinator/plansApi';

class PlanUpdateContainer extends Component {
    state = {
        initData: {
            positions: [],
        },
        vats: getVats(),
        orderTypes: publicProcurementOrderTypes(),
        estimationTypes: publicProcurementEstimationTypes(),
        statuses: getCoordinatorPlanPositionsStatuses(),
    }

    setUpPlanValue = (values) =>{
        let planAmountNet = 0;
        let planAmountGross = 0;
        values.positions.map(position => {
            planAmountNet += position.amountRequestedNet;
            planAmountGross += position.amountRequestedGross;
            return position;
        })
        values.planAmountRequestedNet = planAmountNet
        values.planAmountAwardedGross = planAmountGross
    }

    handleGetPlanPositions = () => {
        this.props.loading(true);
        PlansApi.getPlanPositions(this.props.initialValues.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                initData.year = new Date(initData.year,0,1).toJSON();
                initData.positions = response.data.data;
                initData["positions"].map(position => (
                    Object.assign(position,
                    {
                        vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                        orderType: position.orderType = findSelectFieldPosition(this.state.orderTypes, position.orderType),
                        status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                        mode: position.mode = findSelectFieldPosition(this.props.modes, position.mode.code),
                        estimationType: position.estimationType = findSelectFieldPosition(this.state.estimationTypes, position.estimationType),
                        amountCorrect: position.correctionPlanPosition !== null ?
                            position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet === 0 ?
                                null : position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet :
                            position.amountRequestedNet,
                    }
                )));
                this.setUpPlanValue(initData);
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    };

    handleApprovePlan = (levelAccess) => {
        this.props.loading(true);
        PlansApi.approveUpdatePlan(this.state.initData.id, levelAccess)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                switch(levelAccess){
                    case "public":
                        initData.publicAcceptUser = response.data.data.publicAcceptUser;
                        break;
                    case "director":
                        initData.directorAcceptUser = response.data.data.directorAcceptUser;
                        break;
                    case "accountant":
                        initData.planAcceptUser = response.data.data.planAcceptUser;
                        break;
                    case "chief":
                        initData.chiefAcceptUser = response.data.data.chiefAcceptUser;
                    //no default
                }
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
    }

    handleSendBack = () => {
        this.props.loading(true);
        PlansApi.sendBack(this.state.initData.id)
        .then(response =>{
            this.props.loading(false)
            this.props.onSendBack(this.state.initData);
        })
        .catch(error =>{});
    }

    handleExcelExport = (exportType, headRow, level, positionId) =>{
        this.props.loading(true);
        if(level === "position"){
            PlansApi.exportPlanPositionsToExcel(exportType, this.state.initData.type.code, this.state.initData.id, headRow)
            .then(response => {
                generateExportLink(response);
                this.props.loading(false);
            })
            .catch(error => {});
        } else if (level === "subPositions") {
            PlansApi.exportPlanPositionSubPositionsToExcel(exportType, this.state.initData.type.code, positionId, headRow)
            .then(response => {
                generateExportLink(response);
                this.props.loading(false);
            })
            .catch(error => {});
        }
    }
    componentDidMount() {
        if (this.props.action !== 'add'){
            this.handleGetPlanPositions();
        }
    }
    render(){
        const {changeVisibleDetails, action, handleClose, error, isLoading, modes} = this.props;
        const {initData, vats, assortmentGroups, orderTypes, estimationTypes } = this.state;
        return(
            <PlanUpdateFormContainer
                initialValues={initData}
                changeVisibleDetails={changeVisibleDetails}
                action={action}
                error={error}
                isLoading={isLoading}
                onApprovePlan={this.handleApprovePlan}
                onSendBack={this.handleSendBack}
                onClose={handleClose}
                onExcelExport={this.handleExcelExport}
                vats={vats}
                modes={modes}
                levelAccess={this.props.levelAccess}
                assortmentGroups={assortmentGroups}
                orderTypes={orderTypes}
                estimationTypes={estimationTypes}
            />
        );
    };
};

PlanUpdateContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    changeAction: PropTypes.func,
    handleClose: PropTypes.func,
    error: PropTypes.string,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
}

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
		error: state.ui.error,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlanUpdateContainer);
