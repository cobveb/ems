import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import Applications from 'components/modules/coordinator/publicProcurement/applications/applications';
import PublicProcurementApplicationApi from 'api/modules/coordinator/publicProcurement/publicProcurementApplicationApi';
import {updateOnCloseDetails, publicProcurementEstimationTypes, getVats, findSelectFieldPosition, generateExportLink} from 'utils/';

class ApplicationsContainer extends Component {
    state = {
        applications:[],
        estimationTypes: publicProcurementEstimationTypes(),
        vats: getVats(),
        coordinators: [],
        statuses:[
            {
                code: '',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS,
            },
            {
                code: 'ZP',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_SAVE,
            },
            {
                code: 'WY',
                name: constants.COORDINATOR_PLAN_STATUS_SENT,
            },
            {
                code: 'RE',
                name: constants.COORDINATOR_PLAN_STATUS_REALIZED,
            },
            {
                code: 'ZR',
                name: constants.COORDINATOR_PLAN_STATUS_EXECUTED,
            },
        ],
        modes:[
            {
                code: '',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE,
            },
            {
                code: 'PL',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_PLANNED,
            },
            {
                code: 'UP',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_UNPLANNED,
            }
        ]
    }

    handleGetCoordinators(){
        this.props.loading(true);
        PublicProcurementApplicationApi.getCoordinators()
        .then(response => {
            this.setState({
                coordinators: response.data.data,
            });
            this.props.loading(false)
        })
        .catch(error => {
            this.props.loading(false);
        });
    }

    handleGetApplications(){
        this.props.loading(true);
        PublicProcurementApplicationApi.getApplications()
        .then(response =>{
            this.setState(prevState => {
                let applications = [...prevState.applications];
                applications = response.data.data;
                applications.map(application => (
                    Object.assign(application,
                        {
                            status: application.status = findSelectFieldPosition(this.state.statuses, application.status),
                            mode: application.mode = findSelectFieldPosition(this.state.modes, application.mode),
                            estimationType: application.estimationType = findSelectFieldPosition(this.state.estimationTypes, application.estimationType)
                        }
                    )
                ))
                return {applications};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleDelete = (applicationId) => {
        this.props.loading(true);
        PublicProcurementApplicationApi.deleteApplication(applicationId)
        .then(response => {
            this.setState(prevState => {
                let applications = [...prevState.applications];
                applications = applications.filter(application => application.id !== applicationId)
                return {applications};
            });
            this.props.loading(false);
        })
        .catch(error => {
            this.props.loading(false);
        });
    }

    handleWithdraw = (applicationId) => {
        this.props.loading(true);
        PublicProcurementApplicationApi.withdrawApplication(applicationId)
        .then(response => {
            this.setState(prevState => {
                let applications = [...prevState.applications];
                const index = applications.findIndex(application => application.id === response.data.data.id);
                applications[index].status = findSelectFieldPosition(this.state.statuses, response.data.data.status);
                applications[index].assortmentGroups.map(group =>{
                    return group.applicationProcurementPlanPosition.amountInferredNet = response.data.data.assortmentGroups.find(
                        o => o.id === group.id).applicationProcurementPlanPosition.amountInferredNet
                })
                return {applications};
            });
            this.props.loading(false);
        })
        .catch(error => {
            this.props.loading(false);
        });
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PublicProcurementApplicationApi.exportApplicationsToExcel(exportType, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleUpdateOnCloseDetails = (application) => {
        let applications = this.state.applications;
        return updateOnCloseDetails(applications, application);
    }

    componentDidMount(){
        this.handleGetApplications();
        this.handleGetCoordinators();
    }

    render(){
        const { isLoading, loading, error, clearError } = this.props;
        const { estimationTypes, vats, coordinators, applications, modes, statuses } = this.state;
        return(
            <Applications
                initialValues={applications}
                estimationTypes={estimationTypes}
                vats={vats}
                modes={modes}
                coordinators={coordinators}
                statuses={statuses}
                onSave={this.handleSaveApplication}
                onExcelExport={this.handleExcelExport}
                onClose={this.handleUpdateOnCloseDetails}
                onDelete={this.handleDelete}
                onWithdraw={this.handleWithdraw}
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
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsContainer);