import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import Applications from 'components/modules/coordinator/publicProcurement/applications/applications';
import PublicProcurementApi from 'api/modules/coordinator/publicProcurement/publicProcurementApi';
import {updateOnCloseDetails, publicProcurementEstimationTypes, getVats, findSelectFieldPosition, generateExportLink} from 'utils/';

class ApplicationsContainer extends Component {
    state = {
        applications:[],
        estimationTypes: publicProcurementEstimationTypes(),
        planPositions:[],
        vats: getVats(),
        coordinators: [],
        statuses:[
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
                code: 'PL',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_PLANNED,
            },
            {
                code: 'UP',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_UNPLANNED,
            }
        ]
    }

    handlePlanPositions = () =>{
        this.props.loading(true);
        PublicProcurementApi.getPlanPositions()
        .then(response => {
            this.setState( prevState =>{
                let planPositions = [...prevState.planPositions];
                planPositions = response.data.data;
                planPositions.map(position => (
                    Object.assign(position,
                        {
                            estimationType: position.estimationType = findSelectFieldPosition(this.state.estimationTypes, position.estimationType),
                            vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                        }
                )))
                return {planPositions}
            })
            this.handleGetCoordinators();
        })
        .catch(error => {});
    }

    handleGetCoordinators(){
        PublicProcurementApi.getCoordinators()
        .then(response => {
            this.setState({
                coordinators: response.data.data,
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleGetApplications(){
        this.props.loading(true);
        PublicProcurementApi.getApplications()
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

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PublicProcurementApi.exportApplicationsToExcel(exportType, headRow)
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
        this.handlePlanPositions();
    }

    render(){
        const { isLoading, loading, error, clearError } = this.props;
        const { estimationTypes, planPositions, vats, coordinators, applications, modes, statuses } = this.state;
        return(
            <Applications
                initialValues={applications}
                estimationTypes={estimationTypes}
                vats={vats}
                modes={modes}
                planPositions={planPositions}
                coordinators={coordinators}
                statuses={statuses}
                onSave={this.handleSaveApplication}
                onExcelExport={this.handleExcelExport}
                onClose={this.handleUpdateOnCloseDetails}
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