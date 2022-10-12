import React, { Component } from 'react';
import { connect } from "react-redux";
import * as constants from 'constants/uiNames';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import Applications from 'components/modules/publicProcurement/coordinator/applications/applications';
import {updateOnCloseDetails, publicProcurementEstimationTypes, publicProcurementPlanTypes, publicProcurementApplicationStatuses, publicProcurementApplicationModes, getVats, findSelectFieldPosition } from 'utils/';
import PublicProcurementApplicationApi from 'api/modules/director/coordinator/publicProcurementApplicationApi';
import DictionaryApi from 'api/common/dictionaryApi';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';

class ApplicationsContainer extends Component {
    state = {
        applications: [],
        estimationTypes: [
            {
                code: '',
                name: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE,
            },
        ].concat(publicProcurementEstimationTypes()),
        vats: getVats(),
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
        planTypes: publicProcurementPlanTypes(),
        orderProcedures: [],
        reasonsNotRealizedApplication:[],
        coordinators: [
            {
                code: '',
                name: constants.HEADING_COORDINATOR,
            },
        ],
    }

    handleGetApplications = () => {
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
                            estimationType: application.estimationType = findSelectFieldPosition(this.state.estimationTypes, application.estimationType),
                        }
                    )
                ))
                return {applications};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleUpdateOnCloseDetails = (application) => {
        let applications = this.state.applications;
        return updateOnCloseDetails(applications, application);
    }

    handleApproveApplication = (application, approveLevel) => {
        this.props.loading(true);
        switch(approveLevel){
            case "approveDirector":
                PublicProcurementApplicationApi.approveDirector(application.id)
                .then(response =>{
                    this.setState(prevState => {
                        let applications = [...prevState.applications];
                        const index = applications.findIndex(application => application.id === response.data.data.id);
                        applications[index].status = findSelectFieldPosition(this.state.statuses, response.data.data.status);
                        return {applications};
                    });
                    this.props.loading(false)
                })
                .catch(error =>{});
                break;
            case "approveMedical":
                PublicProcurementApplicationApi.approveMedical(application.id)
                .then(response =>{
                    this.setState(prevState => {
                        let applications = [...prevState.applications];
                        const index = applications.findIndex(application => application.id === response.data.data.id);
                        applications[index].status = findSelectFieldPosition(this.state.statuses, response.data.data.status);
                        return {applications};
                    });
                    this.props.loading(false)
                })
                .catch(error =>{});
                break;
            case "approveChief":
                PublicProcurementApplicationApi.approveChief(application.id)
                .then(response =>{
                    this.setState(prevState => {
                        let applications = [...prevState.applications];
                        const index = applications.findIndex(application => application.id === response.data.data.id);
                        applications[index].status = findSelectFieldPosition(this.state.statuses, response.data.data.status);
                        return {applications};
                    });
                    this.props.loading(false)
                })
                .catch(error =>{});
                break;
            // no default
        }
    }

    handleSendBackApplication = (sendBackApplication) => {
        this.props.loading(true);
        PublicProcurementApplicationApi.sendBackApplication(sendBackApplication.id)
        .then(response =>{
            this.setState(prevState => {
                let applications = [...prevState.applications];
                const idx = applications.findIndex(application => application.id === sendBackApplication.id);
                if(idx !== null){
                    applications.splice(idx, 1);
                }
                return {applications};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
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

    handleGetReasonsNotRealisedApplication = () => {
        return DictionaryApi.getDictionary('slPoNiUdZp')
        .then(response => {
            this.setState({
                reasonsNotRealizedApplication: response.data.data.items,
            })
        })
        .catch(error => {});
    }

    handleGetCoordinators(){
        return OrganizationUnitsApi.getCoordinators()
        .then(response => {
            this.setState(prevState => {
                let coordinators = [...prevState.coordinators];
                coordinators =  coordinators.concat(response.data.data);
                return {coordinators};
            });
        })
        .catch(error => {});
    }

    componentDidMount(){
        this.handleGetOrderProcedures();
        this.handleGetReasonsNotRealisedApplication();
        this.handleGetApplications();
        this.handleGetCoordinators();
    }

    render(){
        const {isLoading, loading, error, clearError} = this.props;
        const {applications, estimationTypes, vats, statuses, modes, planTypes, orderProcedures, reasonsNotRealizedApplication, coordinators} = this.state;
        return(
            <Applications
                initialValues={applications}
                levelAccess={"director"}
                estimationTypes={estimationTypes}
                vats={vats}
                statuses={statuses}
                modes={modes}
                orderProcedures={orderProcedures}
                planTypes={planTypes}
                coordinators={coordinators}
                reasonsNotRealizedApplication={reasonsNotRealizedApplication}
                isLoading={isLoading}
                loading={loading}
                error={error}
                clearError={clearError}
                onApproveApplication={this.handleApproveApplication}
                onSendBackApplication={this.handleSendBackApplication}
                onClose={this.handleUpdateOnCloseDetails}
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