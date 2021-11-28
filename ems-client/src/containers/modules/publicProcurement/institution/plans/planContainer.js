import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import Plan from 'components/modules/publicProcurement/institution/plans/plan';
import { findSelectFieldPosition, publicProcurementEstimationTypes, publicProcurementOrderTypes, generateExportLink } from 'utils';
import PlansApi from 'api/modules/publicProcurement/institution/plansApi';

class PlanContainer extends Component {
    state = {
        initData: {
            year: '',
            planPositions:[]
        },
        orderTypes: publicProcurementOrderTypes(),
        estimationTypes: publicProcurementEstimationTypes(),
    }

    handleGetPlanPositions = () => {
        this.props.loading(true);
        PlansApi.getPlanPositions(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                initData.planPositions = response.data.data;
                initData["planPositions"].map(position => (
                    Object.assign(position,
                    {
                        orderType: position.orderType = findSelectFieldPosition(this.state.orderTypes, position.orderType),
                        estimationType: position.estimationType = findSelectFieldPosition(this.state.estimationTypes, position.estimationType),
                    }
                )))
                return {initData}
            })
             this.props.loading(false)
        })
        .catch(error =>{});
    }

    handlePrintPlan = (type) =>{
        this.props.loading(true);
        PlansApi.printPlan(this.state.initData.id, type)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PlansApi.exportPlanPositionsToExcel(exportType, this.state.initData.id, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount(){
        this.handleGetPlanPositions();
    }
    render(){
        const { levelAccess } = this.props;
        const { initData } = this.state;
        return(
            <Plan
                initialValues={initData}
                levelAccess={levelAccess}
                onPrintPlan={this.handlePrintPlan}
                onExcelExport={this.handleExcelExport}
                isLoading={this.props.isLoading}
                error={this.props.error}
                clearError={this.props.clearError}
                onClose={this.props.onClose}
            />
        );
    };
};

PlanContainer.propTypes = {
    initialValues: PropTypes.object,
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