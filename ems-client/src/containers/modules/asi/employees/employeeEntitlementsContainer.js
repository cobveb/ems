import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import EmployeeEntitlements from 'components/modules/asi/employees/employeeEntitlements';
import EmploymentApi from 'api/modules/hr/employees/employmentApi';
import EntitlementSystemApi from 'api/modules/asi/dictionary/employee/entitlementSystemApi';
import EntitlementApi from 'api/modules/asi/employee/entitlementApi';
import PlacesApi from 'api/modules/hr/dictionary/placesApi';

class EmployeeEntitlementsContainer extends Component {
    state = {
        entitlements: [],
        entitlement: null,
        employments: [],
        systems:[],
        systemPermissions:[],
        organizationUnits:[]
    }

    handleGetActiveEmployments = () =>{
        this.props.loading(true);
        EmploymentApi.getActiveEmployments(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let employments = [...prevState.employments]
                employments = response.data.data;

                return {employments};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleGetActiveEntitlementSystems = () =>{
        this.props.loading(true);
        EntitlementSystemApi.getActiveEntitlementSystems()
        .then(response => {
            this.setState(prevState => {
                let systems = [...prevState.systems]
                systems = response.data.data;

                return {systems};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleGetEntitlementSystemPermissions = (system) =>{
        this.props.loading(true);
        EntitlementSystemApi.getEntitlementSystemPermissions(system.id)
        .then(response => {
            this.setState(prevState => {
                let systemPermissions = [...prevState.systemPermissions]
                systemPermissions = response.data.data;
                return {systemPermissions};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleGetOrganizationUnits = () =>{
        PlacesApi.getActivePlaces()
        .then(response => {
            this.setState(prevState => {
                let organizationUnits = [...prevState.organizationUnits]
                organizationUnits = response.data.data;
                    return {organizationUnits};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleGetEntitlements = () =>{
        this.props.loading(true);
        EntitlementApi.getEntitlements(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let entitlements = [...prevState.entitlements];
                entitlements = response.data.data;
                entitlements.map(entitlement => (
                    Object.assign(entitlement,
                        {
                            permissions:[],
                        }
                    )
                ))
                return {entitlements};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleGetEntitlementDetails = (action, entitlement) => {
        if(action === "edit"){
            this.props.loading(true);
            EntitlementApi.getEntitlementDetails(this.props.initialValues.id, entitlement.id)
            .then(response => {
                this.setState(prevState => {
                    let entitlements = [...prevState.entitlements];
                    let entitlement = {...prevState.entitlement};
                    const idx = entitlements.findIndex(entitlement => entitlement.id === response.data.data.id);
                    if(idx !== null){
                        Object.assign(entitlements[idx],response.data.data);
                        if(entitlement !== null){
                            entitlement = null;
                        }
                    }
                    return {entitlements, entitlement}
                })
                this.props.loading(false);
            })
            .catch(error => {});
        }
    }

    handleSubmitEntitlement = (values, action) =>{
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(values));

        EntitlementApi.saveEntitlement(this.props.initialValues.id, payload)
        .then(response => {
            this.setState(prevState => {
                let entitlements = [...prevState.entitlements];
                let entitlement = {...prevState.entitlement};
                if(action === 'add'){
                    entitlements.push(response.data.data)
                    entitlement = response.data.data;
                    entitlement.permissions = [];
                } else if (action === "edit"){
                    const idx = entitlements.findIndex(entitlement => entitlement.id === response.data.data.id);
                    if(idx !== null){
                        entitlements.splice(idx, 1, response.data.data);
                        if(entitlement !== null){
                            entitlement = null;
                        }
                    }
                }
                return {entitlements, entitlement}
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleDeleteEntitlement = (ent) => {
        this.props.loading(true);
        EntitlementApi.deleteEntitlement(this.props.initialValues.id, ent.id)
        .then(response => {
            this.props.loading(true)
            this.setState(prevState => {
                let entitlements = [...prevState.entitlements];
                const idx = entitlements.findIndex(entitlement => entitlement.id === ent.id);
                if(idx !== null){
                    entitlements.splice(idx, 1);
                }
                return {entitlements}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleSubmitEntitlementPermission = (ent, permission, action) =>{
        this.props.loading(true);
        EntitlementApi.saveEntitlementPermission(this.props.initialValues.id, ent.id, permission)
        .then(response => {
            this.updateEntitlementDetails(ent, response.data.data);
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleDeleteEntitlementPermission = (ent, values) =>{
        this.props.loading(true);
        EntitlementApi.deleteEntitlementPermission(this.props.initialValues.id, ent.id, values.id)
        .then(response => {
            this.updateEntitlementDetails(ent, response.data.data);
            this.props.loading(false)
         })
         .catch(error => {});
    }

    updateEntitlementDetails(ent, updatedEntitlement){
        this.setState(prevState => {
            let entitlements = [...prevState.entitlements];
            let entitlement = entitlements[entitlements.findIndex(entitlementIn => entitlementIn.id === ent.id)];

            const idx = entitlements.findIndex(entitlement => entitlement.id === updatedEntitlement.id);
            if(idx !== null){
                entitlements.splice(idx, 1, updatedEntitlement);
                if(entitlement !== null){
                    entitlement = null;
                }
            }
            return {entitlements, entitlement}
        });
    }

    componentDidMount() {
        this.handleGetActiveEmployments();
        this.handleGetActiveEntitlementSystems();
        this.handleGetEntitlements();
    }

    render(){
        const { changeVisibleDetails, onClose, error, clearError, isLoading } = this.props;
        const { entitlements, entitlement, employments, systems, systemPermissions, organizationUnits } = this.state;
        return(
            <EmployeeEntitlements
                initialValues={entitlements}
                entitlement={entitlement}
                changeVisibleDetails={changeVisibleDetails}
                employments={employments}
                systems={systems}
                systemPermissions={systemPermissions}
                organizationUnits={organizationUnits}
                getEntitlementDetails={this.handleGetEntitlementDetails}
                getSystemPermissions={this.handleGetEntitlementSystemPermissions}
                getOrganizationUnits={this.handleGetOrganizationUnits}
                error={error}
                clearError={clearError}
                isLoading={isLoading}
                onClose={onClose}
                onSubmitEntitlement={this.handleSubmitEntitlement}
                onDeleteEntitlement={this.handleDeleteEntitlement}
                onSubmitEntitlementPermission={this.handleSubmitEntitlementPermission}
                onDeleteEntitlementPermission={this.handleDeleteEntitlementPermission}
            />
        );
    };
};

EmployeeEntitlementsContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    onClose: PropTypes.func,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeEntitlementsContainer);
