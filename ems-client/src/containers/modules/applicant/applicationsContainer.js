import React, { Component } from 'react';
import { connect } from "react-redux";
import Applications from 'components/modules/applicant/applications/applications';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import {updateOnCloseDetails} from 'utils';
import * as constants from 'constants/uiNames';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import DictionaryApi from 'api/common/dictionaryApi';
import ApplicationsApi from 'api/modules/applicant/applicationsApi';


class ApplicationsContainer extends Component {
    state = {
        applications: [],
        coordinators: [
            {
                code: '',
                name: constants.HEADING_COORDINATOR,
            },
        ],
        units: [],
        status:[
            {
                code: '',
                name: 'Status',
            },
            {
                code: 'ZP',
                name: constants.APPLICATIONS_APPLICATION_STATUS_SAVED,
            },
            {
                code: 'WY',
                name: constants.APPLICATIONS_APPLICATION_STATUS_SENT,
            },
            {
                code: 'RO',
                name: constants.APPLICATIONS_APPLICATION_STATUS_CONSIDERED,
            },
            {
                code: 'CZ',
                name: constants.APPLICATIONS_APPLICATION_STATUS_PARTIALLY_APPROVED,
            },
            {
                code: 'ZA',
                name: constants.APPLICATIONS_APPLICATION_STATUS_APPROVED,
            },
            {
                code: 'CR',
                name: constants.APPLICATIONS_APPLICATION_STATUS_PARTIALLY_REALIZED,
            },
            {
                code: 'RE',
                name: constants.APPLICATIONS_APPLICATION_STATUS_REALIZED,
            },
            {
                code: 'CE',
                name: constants.APPLICATIONS_APPLICATION_STATUS_PARTIALLY_EXECUTED,
            },
            {
                code: 'ZR',
                name: constants.APPLICATIONS_APPLICATION_STATUS_EXECUTED,
            },
            {
                code: "CO",
                name: constants.APPLICATIONS_APPLICATION_STATUS_PARTIALLY_REJECTED,
            },
            {
                code: "OD",
                name: constants.APPLICATIONS_APPLICATION_STATUS_REJECTED,
            },
        ],
    }

    handleFindStatus = (applicationStatus) =>{
        return this.state.status.find(status => {
            return status.code === applicationStatus;
        });

    }

    handleDelete = (applicationId) => {
        this.props.loading(true);
        ApplicationsApi.deleteApplication(applicationId)
        .then(response => {
            let applications = this.state.applications;
            applications = applications.filter(application => application.id !== applicationId)
            this.setState({
                applications: applications,
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleWithdraw = (applicationId) => {
        this.props.loading(true);
        ApplicationsApi.withdrawApplication(applicationId)
        .then(response => {
            this.setState(prevState => {
                const applications = [...prevState.applications];
                const index = applications.findIndex(application => application.id === response.data.data.id);
                applications[index].status = this.handleFindStatus(response.data.data.status);
                applications[index].sendDate = response.data.data.sendDate;
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

    handleGetCoordinators(){
        return OrganizationUnitsApi.getCoordinators()
        .then(response => {
            this.setState(prevState => {
                let coordinators = [...prevState.coordinators];
                coordinators =  coordinators.concat(response.data.data);
                return {coordinators};
            });
            this.handleGetDictionaryUnits();
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleGetDictionaryUnits(){
       return DictionaryApi.getDictionary('jedMiar')
        .then(response => {
            this.setState({
                units: response.data.data.items,
            })
        })
        .catch(error => {});
    }

    handleGetApplications(){
        this.props.loading(true);
        ApplicationsApi.getApplications()
        .then(response =>{
            this.setState(prevState => {
                let applications = [...prevState.coordinators];
                applications = response.data.data;
                applications.map(application => (
                    Object.assign(application,
                        {
                            status: application.status = this.handleFindStatus(application.status)
                        }
                    )
                ))
                return {applications};
            });
        })
        .catch(error =>{});
    }

    componentDidMount() {
        this.handleGetApplications();
        this.handleGetCoordinators();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {applications, coordinators, units, status} = this.state;
        return(
            <Applications
                initialValues = {applications}
                coordinators= {coordinators}
                units={units}
                statusVal={status}
                isLoading = {isLoading}
                error = {error}
                clearError = {clearError}
                onDelete={this.handleDelete}
                onWithdraw={this.handleWithdraw}
                onClose={this.handleUpdateOnCloseDetails}
            />
        )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsContainer);