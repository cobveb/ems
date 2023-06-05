import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading } from 'actions/';
import EmployeeEmployments from 'components/modules/hr/employees/employeeEmployments';
import { getEmploymentTypes, getEmploymentStatuses, findSelectFieldPosition } from 'utils';
import RegisterApi from 'api/common/registerApi';
import WorkplacesApi from 'api/modules/hr/dictionary/workplacesApi';
import PlacesApi from 'api/modules/hr/dictionary/placesApi';
import EmploymentApi from 'api/modules/hr/employees/employmentApi';

class EmployeeEmploymentsContainer extends Component {
    state ={
        places: [],
        workplaces: [],
        processingBases: [],
        employment: null,
        employments: [],
        employmentTypes: getEmploymentTypes(),
        statuses: getEmploymentStatuses(),
    }

    handleGetEmployments(){
        this.props.loading(true);
        EmploymentApi.getEmployments(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let employments = [...prevState.employments]
                employments = response.data.data;
                employments.map(employment => (
                    Object.assign(employment,
                        {
                            employmentType: employment.employmentType = findSelectFieldPosition(this.state.employmentTypes, employment.employmentType),
                            status: employment.status = findSelectFieldPosition(this.state.statuses, employment.status),
                            statements: employment.statements = [],
                            authorizations: employment.authorizations = [],
                            workplaces: employment.workplaces = [],
                        }
                    )
                ))
                return {employments};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleGetDictionaryPlaces(){
       return PlacesApi.getActivePlaces()
        .then(response => {
            this.setState({
                places: response.data.data,
            })
        })
        .catch(error => {});
    };

    handleGetDictionaryWorkplaces(){
       return WorkplacesApi.getActiveWorkplaces()
        .then(response => {
            this.setState({
                workplaces: response.data.data,
            })
        })
        .catch(error => {});
    };

    handleGetDictionaryProcessingBases(){
       return RegisterApi.getRegisterActivePositions('cpdo')
        .then(response => {
            this.setState({
                processingBases: response.data.data,
            })
        })
        .catch(error => {});
    };

    handleSubmitEmployment = (employment, action) =>{
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(employment));
        payload.employmentType = payload.employmentType.code
        if(payload.status !== undefined){
            payload.status = payload.status.code
        }
        EmploymentApi.saveEmployment(this.props.initialValues.id, payload)
        .then(response => {
            this.setState(prevState => {
                let employments = [...prevState.employments];
                let employment = prevState.employment;
                response.data.data.employmentType = findSelectFieldPosition(this.state.employmentTypes, response.data.data.employmentType);
                response.data.data.status = findSelectFieldPosition(this.state.statuses, response.data.data.status);
                if(action === 'add'){
                    employments.push(response.data.data)
                    employment = response.data.data;
                    employment.statements = [];
                    employment.authorizations = [];
                    employment.workplaces = [];
                } else if (action === 'edit'){
                    const idx = employments.findIndex(employment => employment.id === response.data.data.id);
                    if(idx !== null){
                        response.data.data.statements = payload.statements;
                        response.data.data.authorizations = payload.authorizations;
                        response.data.data.workplaces = payload.workplaces;
                        employments.splice(idx, 1, response.data.data);
                        if(employment !== null){
                            employment = null;
                        }
                    }
                }
                return {employment, employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleDeleteEmployment = (epl) =>{
        this.props.loading(true);
        EmploymentApi.deleteEmployment(this.props.initialValues.id, epl.id)
        .then(response => {
            this.props.loading(true)
            this.setState(prevState => {
                let employments = [...prevState.employments];
                const idx = employments.findIndex(employment => employment.id === epl.id);
                if(idx !== null){
                    employments.splice(idx, 1);
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleEmploymentStatements = (employmentId) =>{
        EmploymentApi.getEmploymentStatements(this.props.initialValues.id, employmentId)
        .then(response => {
            this.setState(prevState => {
                let employments = [...prevState.employments];
                const idx = employments.findIndex(employment => employment.id === employmentId);

                if(idx !== null){
                    employments[idx].statements = response.data.data;
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleSubmitStatement = (epl, statement, action) =>{
        this.props.loading(true);
        EmploymentApi.saveEmploymentStatement(this.props.initialValues.id, epl.id, statement)
        .then(response => {
            this.setState(prevState => {
                const employments = [...prevState.employments];
                let employment = employments[employments.findIndex(employmentIn => employmentIn.id === epl.id)];
                if(action === 'add'){
                    employment.statements.push(response.data.data)
                } else if (action === 'edit'){
                    const idx = employment.statements.findIndex(statement => statement.id === response.data.data.id);
                    if(idx !== null){
                        employment.statements.splice(idx, 1, response.data.data);
                        if(employment !== null){
                            employment = null;
                        }
                    }
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleDeleteStatement = (epl, statement) =>{
        this.props.loading(true);
        EmploymentApi.deleteEmploymentStatement(this.props.initialValues.id, epl.id, statement.id)
        .then(response => {
            this.setState(prevState => {
                const employments = [...prevState.employments];
                let employment = employments[employments.findIndex(employmentIn => employmentIn.id === epl.id)];
                const idx = employment.statements.findIndex(stat => stat.id === statement.id);
                if(idx !== null){
                    employment.statements.splice(idx, 1);
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleSubmitAuthorization = (epl, authorization, action) =>{
        this.props.loading(true);
        EmploymentApi.saveEmploymentAuthorization(this.props.initialValues.id, epl.id, authorization)
        .then(response => {
            this.setState(prevState => {
                const employments = [...prevState.employments];
                let employment = employments[employments.findIndex(employmentIn => employmentIn.id === epl.id)];
                if(action === 'add'){
                    employment.authorizations.push(response.data.data)
                } else if (action === 'edit'){
                    const idx = employment.authorizations.findIndex(authorization => authorization.id === response.data.data.id);
                    if(idx !== null){
                        employment.authorizations.splice(idx, 1, response.data.data);
                        if(employment !== null){
                            employment = null;
                        }
                    }
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleDeleteAuthorization = (epl, authorization) =>{
        this.props.loading(true);
        EmploymentApi.deleteEmploymentAuthorization(this.props.initialValues.id, epl.id, authorization.id)
        .then(response => {
            this.setState(prevState => {
                const employments = [...prevState.employments];
                let employment = employments[employments.findIndex(employmentIn => employmentIn.id === epl.id)];
                const idx = employment.authorizations.findIndex(auth => auth.id === authorization.id);
                if(idx !== null){
                    employment.authorizations.splice(idx, 1);
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleSubmitWorkplace = (epl, workplace, action) =>{
        this.props.loading(true);
        EmploymentApi.saveEmploymentWorkplace(this.props.initialValues.id, epl.id, workplace)
        .then(response => {
            this.setState(prevState => {
                const employments = [...prevState.employments];
                let employment = employments[employments.findIndex(employmentIn => employmentIn.id === epl.id)];
                if(action === 'add'){
                    employment.workplaces.push(response.data.data)
                } else if (action === 'edit'){
                    const idx = employment.workplaces.findIndex(statement => workplace.id === response.data.data.id);
                    if(idx !== null){
                        employment.workplaces.splice(idx, 1, response.data.data);
                        if(employment !== null){
                            employment = null;
                        }
                    }
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleDeleteWorkplace = (epl, workplace) =>{
        this.props.loading(true);
        EmploymentApi.deleteEmploymentWorkplace(this.props.initialValues.id, epl.id, workplace.id)
        .then(response => {
            this.setState(prevState => {
                const employments = [...prevState.employments];
                let employment = employments[employments.findIndex(employmentIn => employmentIn.id === epl.id)];
                const idx = employment.workplaces.findIndex(place => place.id === workplace.id);
                if(idx !== null){
                    employment.workplaces.splice(idx, 1);
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleSubmitEmploymentDetail = (values, employment, type, action) => {
        if(type === 'statement'){
            this.handleSubmitStatement(employment, values, action);
        } else if (type === 'authorization'){
            this.handleSubmitAuthorization(employment, values, action);
        } else if (type === 'workplace'){
            this.handleSubmitWorkplace(employment, values, action);
        }
    }

    handleDeleteEmploymentDetail = (employment, values, type) =>{
        if(type === 'statement'){
            this.handleDeleteStatement(employment, values);
        } else if (type === 'authorization'){
            this.handleDeleteAuthorization(employment, values);
        } else if (type === 'workplace'){
            this.handleDeleteWorkplace(employment, values);
        }
    }

    handleEmploymentAuthorizations = (employmentId) =>{
        EmploymentApi.getEmploymentAuthorizations(this.props.initialValues.id, employmentId)
        .then(response => {
            this.setState(prevState => {
                let employments = [...prevState.employments];
                const idx = employments.findIndex(employment => employment.id === employmentId);

                if(idx !== null){
                    employments[idx].authorizations = response.data.data;
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleEmploymentWorkplaces = (employmentId) =>{
        EmploymentApi.getEmploymentWorkplaces(this.props.initialValues.id, employmentId)
        .then(response => {
            this.setState(prevState => {
                let employments = [...prevState.employments];
                const idx = employments.findIndex(employment => employment.id === employmentId);

                if(idx !== null){
                    employments[idx].workplaces = response.data.data;
                }
                return {employments}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleEmploymentDetails = (employment) =>{
        this.handleEmploymentStatements(employment.id)
        this.handleEmploymentAuthorizations(employment.id)
        this.handleEmploymentWorkplaces(employment.id)
    }

    componentDidMount() {
        this.handleGetEmployments();
        this.handleGetDictionaryPlaces();
        this.handleGetDictionaryWorkplaces();
        this.handleGetDictionaryProcessingBases();
    }

    render(){
        const {changeVisibleDetails, isLoading } = this.props;
        const { employments, employment, employmentTypes, statuses, places, workplaces, processingBases } = this.state;
        return(
            <EmployeeEmployments
                initialValues={employments}
                employment={employment}
                hrNumber={this.props.hrNumber}
                changeVisibleDetails={changeVisibleDetails}
                employmentTypes={employmentTypes}
                employmentStatuses={statuses}
                places={places}
                workplaces={workplaces}
                processingBases={processingBases}
                isLoading={isLoading}
                getEmploymentDetails={this.handleEmploymentDetails}
                onSubmitEmployment={this.handleSubmitEmployment}
                onDeleteEmployment={this.handleDeleteEmployment}
                onSubmitEmploymentDetail={this.handleSubmitEmploymentDetail}
                onDeleteEmploymentDetail={this.handleDeleteEmploymentDetail}
                onClose={this.props.onClose}
            />
        );
    };
};

EmployeeEmploymentsContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
}
const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeEmploymentsContainer);
