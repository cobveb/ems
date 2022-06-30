import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import Plan from 'components/modules/accountant/institution/plans/plan';
import PlansApi from 'api/modules/accountant/institution/plansApi';
import DirectorPlansApi from 'api/modules/director/institution/plansApi';
import { findSelectFieldPosition, generateExportLink, getCoordinatorPlanPositionsStatuses } from 'utils';

class PlanContainer extends Component {
    state = {
        initData:{
            year:'',
            planPositions:[],
        },
        disableWithdraw: true,
        statuses: getCoordinatorPlanPositionsStatuses(),
    }

    checkDisableWithdraw = () => {
        PlansApi.checkDisableWithdraw(this.props.initialValues.id)
        .then(response =>{
            this.setState({ disableWithdraw : response.data.data})
        })
        .catch(error =>{});
    }

    handleGetPlan(){
        this.props.loading(true);
        PlansApi.getPlan(this.props.initialValues.id)
        .then(response =>{
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData = response.data.data;
                initData.type = findSelectFieldPosition(this.props.types, response.data.data.type);
                if(initData.isCorrected){
                    initData.planPositions.map(position => (
                        Object.assign(position,
                            {
                                status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                            }
                        )
                    ))
                }
                return {initData};
            });
            this.checkDisableWithdraw();
            this.props.loading(false)
        })
        .catch(error =>{
            this.props.loading(false)
        });
    }

    handleClosePosition = () => {
        this.handleGetPlan();
    }

    setDataOnApprove = (data) =>{
        this.setState(prevState => {
            let initData = {...prevState.initData};
            initData.status = data.status;
            if(this.props.levelAccess === "accountant"){
                initData.approveUser = data.approveUser;
            } else if (this.props.levelAccess === "director"){
                initData.chiefAcceptUser = data.chiefAcceptUser;
            }
            return {initData};
        });
    }

    setDataOnWithdraw = (data) =>{
        this.setState(prevState => {
            let initData = {...prevState.initData};
            initData.status = data.status;
            initData.approveUser = data.approveUser;
            return {initData};
        });
    }

    handleAccountantApprovePlan = () => {
        this.props.loading(true);
        PlansApi.approvePlan(this.props.initialValues.id)
        .then(response => {
            this.setDataOnApprove(response.data.data);
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false)
        })
    }

    handleChiefApprovePlan = () => {
        this.props.loading(true);
        DirectorPlansApi.approvePlan(this.props.initialValues.id)
        .then(response => {
            this.setDataOnApprove(response.data.data);
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false)
        })
    }

    handleAccountantWithdrawPlan = () => {
        this.props.loading(true);
        PlansApi.withdrawPlan(this.props.initialValues.id)
        .then(response => {
            this.setDataOnWithdraw(response.data.data);
            this.props.onClose(this.state.initData);
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handleChiefWithdrawPlan = () => {
        this.props.loading(true);
        DirectorPlansApi.withdrawPlan(this.props.initialValues.id)
        .then(response => {
            this.setDataOnWithdraw(response.data.data);
            this.props.onClose(this.state.initData);
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handlePrintPlan = () =>{
        this.props.loading(true);
        PlansApi.printPlan(this.state.initData.id)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PlansApi.exportPlanPositionsToExcel(exportType, this.state.initData.type.code, this.state.initData.id, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount() {
        this.handleGetPlan();
    }
    render(){
        const {levelAccess} = this.props;
        const {initData, disableWithdraw} = this.state;
        return(
            <Plan
                initialValues={initData}
                levelAccess={levelAccess}
                disableWithdraw={disableWithdraw}
                onClosePosition={this.handleClosePosition}
                onAccountantApprovePlan={this.handleAccountantApprovePlan}
                onChiefApprovePlan={this.handleChiefApprovePlan}
                onAccountantWithdrawPlan={this.handleAccountantWithdrawPlan}
                onChiefWithdrawPlan={this.handleChiefWithdrawPlan}
                onPrintPlan={this.handlePrintPlan}
                onExcelExport={this.handleExcelExport}
                onClose={this.props.onClose}
            />
        );
    };
};

PlanContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
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