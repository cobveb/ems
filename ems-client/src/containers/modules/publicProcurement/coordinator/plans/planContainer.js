import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PlanBasicInfoForm from 'containers/modules/publicProcurement/coordinator/plans/forms/planBasicInfoFormContainer';
import {findSelectFieldPosition, generateExportLink, publicProcurementEstimationTypes, getCoordinatorPlanPositionsStatuses, publicProcurementOrderTypes} from 'utils';
import PlansApi from 'api/modules/publicProcurement/coordinator/plansApi';

class PlanContainer extends Component {
    state = {
        initData: {
            positions: [],
        },
        vats: [
            {
                code: 1.08,
                name: "8%",
            },
            {
                code: 1.23,
                name: "23%",
            },
        ],
        orderTypes: publicProcurementOrderTypes(),
        estimationTypes: publicProcurementEstimationTypes(),
        statuses: getCoordinatorPlanPositionsStatuses(),
    }

    handleGetPlanPositions = () => {
        this.props.loading(true);
        PlansApi.getPlanPositions(this.props.initialValues.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                initData.positions = response.data.data;
                initData["positions"].map(position => (
                    Object.assign(position,
                    {
                        vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                        orderType: position.orderType = findSelectFieldPosition(this.state.orderTypes, position.orderType),
                        status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                        mode: position.mode = findSelectFieldPosition(this.props.modes, position.mode.code),
                        estimationType: position.estimationType = findSelectFieldPosition(this.state.estimationTypes, position.estimationType),
                    }
                )));
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    };

    handleApprovePlan = () => {
        this.props.loading(true);
        PlansApi.approvePlan(this.state.initData.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                initData.planAcceptUser = response.data.data.planAcceptUser;
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
    }

//    handleExcelExport = (exportType, headRow) =>{
//        this.props.loading(true);
//        PlansApi.exportPlanPositionsToExcel(exportType, this.state.initData.id, headRow)
//        .then(response => {
//            generateExportLink(response);
//            this.props.loading(false);
//        })
//        .catch(error => {});
//    }

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
            <PlanBasicInfoForm
                initialValues={initData}
                changeVisibleDetails={changeVisibleDetails}
                action={action}
                error={error}
                isLoading={isLoading}
                onApprovePlan={this.handleApprovePlan}
                onClose={handleClose}
                onExcelExport={this.handleExcelExport}
                vats={vats}
                modes={modes}
                assortmentGroups={assortmentGroups}
                orderTypes={orderTypes}
                estimationTypes={estimationTypes}
            />
        );
    };
};

PlanContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PlanContainer);
