import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError, setConditions, resetSearchConditions, setPageableTableProperties } from 'actions/';
import * as constants from 'constants/uiNames';
import Applications from 'components/modules/coordinator/publicProcurement/applications/applications';
import PublicProcurementApplicationApi from 'api/modules/coordinator/publicProcurement/publicProcurementApplicationApi';
import {updateOnCloseDetails, publicProcurementEstimationTypes, publicProcurementApplicationStatuses, publicProcurementApplicationModes, getVats, findSelectFieldPosition, generateExportLink, getPlanTypes } from 'utils/';
import DictionaryApi from 'api/common/dictionaryApi';

class ApplicationsContainer extends Component {
    state = {
        applications:[],
        estimationTypes: [
            {
                code: '',
                name: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE,
            },
        ].concat(publicProcurementEstimationTypes()),
        vats: getVats(),
        coordinators: [],
        financialPlanPositions:[],
        investmentPlanPositions:[],
        reasonsNotRealizedApplication:[],
        orderProcedures: [],
        statuses: [
            {
                code: '',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS,
            }
        ].concat(publicProcurementApplicationStatuses()),
        modes: [
            {
                code: '',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE,
            },
        ].concat(publicProcurementApplicationModes()),
        planTypes: getPlanTypes(),
    }

    handleGetCoordinators(){
        PublicProcurementApplicationApi.getCoordinators()
        .then(response => {
            this.setState({
                coordinators: response.data.data,
            });
        })
        .catch(error => {
        });
    }

    handleGetFinancialPlanPositions = () => {
        PublicProcurementApplicationApi.getPlanPositions('FIN')
        .then(response => {
            this.setState( prevState =>{
                let financialPlanPositions = [...prevState.financialPlanPositions];
                financialPlanPositions = response.data.data;
                return {financialPlanPositions}
            })
        })
        .catch(error => {});
    }

    handleGetInvestmentPlanPositions = () => {
        PublicProcurementApplicationApi.getPlanPositions('INW')
        .then(response => {
            this.setState( prevState =>{
                let investmentPlanPositions = [...prevState.investmentPlanPositions];
                investmentPlanPositions = response.data.data;
                return {investmentPlanPositions}
            })
        })
        .catch(error => {});
    }

    handleGetReasonsNotRealisedApplication = () => {
        return DictionaryApi.getDictionary('slPoNiUdZp')
        .then(response => {
            this.setState({
                reasonsNotRealizedApplication: response.data.data.items,
            })
        })
        .catch(error => {});
    }

    handleGetOrderProcedures = () =>{
        return DictionaryApi.getDictionary('slTryUdzZp')
        .then(response => {
            this.setState({
                orderProcedures: response.data.data.items,
            })
        })
        .catch(error => {});
    }

    handleGetApplicationsPageable = () => {
        this.props.loading(true);
        PublicProcurementApplicationApi.getApplicationsPageable(this.props.searchConditions)
        .then(response => {
            this.props.setPageableTableProperties({
                totalElements: response.data.data.totalElements,
                lastPage: response.data.data.last,
                firstPage: response.data.data.first,
            })
            this.setState(prevState => {
                let applications = [...prevState.applications];
                applications = response.data.data.content;
                applications.map(application => (
                    Object.assign(application,
                        {
                            status: application.status = findSelectFieldPosition(this.state.statuses, application.status),
                            mode: application.mode = findSelectFieldPosition(this.state.modes, application.mode),
                            estimationType: application.estimationType = findSelectFieldPosition(this.state.estimationTypes, application.estimationType),
                        }
                    )
                ))
                return {applications};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleDelete = (applicationId) => {
        this.props.loading(true);
        PublicProcurementApplicationApi.deleteApplication(applicationId)
        .then(response => {
            this.handleGetApplicationsPageable();
        })
        .catch(error => {
            this.props.loading(false);
        });
    }

    handleWithdraw = (applicationId) => {
        this.props.loading(true);
        PublicProcurementApplicationApi.withdrawApplication(applicationId)
        .then(response => {
            this.handleGetApplicationsPageable();
        })
        .catch(error => {
            this.props.loading(false);
        });
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PublicProcurementApplicationApi.exportApplicationsToExcel(exportType, headRow, this.props.searchConditions)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidUpdate(prevProps){
        if(this.props.searchConditions !== prevProps.searchConditions){
            this.handleGetApplicationsPageable();
        }
    }

    componentDidMount(){
        this.handleGetOrderProcedures();
        this.handleGetCoordinators();
        this.handleGetFinancialPlanPositions();
        this.handleGetInvestmentPlanPositions();
        this.handleGetReasonsNotRealisedApplication();
    }

    componentWillUnmount(){
        this.props.resetSearchConditions();
    }

    render(){
        const { isLoading, loading, error, clearError } = this.props;
        const { estimationTypes, vats, coordinators, applications, modes, statuses, planTypes, financialPlanPositions, investmentPlanPositions, reasonsNotRealizedApplication, orderProcedures } = this.state;
        return(
            <Applications
                initialValues={applications}
                estimationTypes={estimationTypes}
                vats={vats}
                modes={modes}
                planTypes={planTypes}
                orderProcedures={orderProcedures}
                financialPlanPositions={financialPlanPositions}
                investmentPlanPositions={investmentPlanPositions}
                coordinators={coordinators}
                reasonsNotRealizedApplication={reasonsNotRealizedApplication}
                statuses={statuses}
                onExcelExport={this.handleExcelExport}
                onClose={this.handleGetApplicationsPageable}
                onDelete={this.handleDelete}
                onWithdraw={this.handleWithdraw}
                onSetSearchConditions={this.props.onSetSearchConditions}
                isLoading={isLoading}
                loading={loading}
                error={error}
                clearError={clearError}
            />
        );
    };
};

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
		error: state.ui.error,
		searchConditions: state.search,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
        onSetSearchConditions : bindActionCreators(setConditions, dispatch),
        resetSearchConditions : bindActionCreators(resetSearchConditions, dispatch),
        setPageableTableProperties : bindActionCreators(setPageableTableProperties, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsContainer);