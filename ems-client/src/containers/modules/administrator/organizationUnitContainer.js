import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import OrganizationUnit from 'components/modules/administrator/ou/organizationUnit';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';

class OrganizationUnitContainer extends Component {
    state = {
        initData: {
            active: false,
            coordinator: false,
        },
        unassignedCoordinators: [],
        isEdit: false,
    }

    handleSubmitSucceeded = (data) => {
        if(this.props.action === "add"){
            data.parent = this.props.initialValues.parent;
        }
        OrganizationUnitsApi.saveOu(this.props.action, data)
        .then(response => {
            this.setState({
                initData: response.data.data,
            });
            this.props.loading(false)
        })
        .catch(error => {
            this.setState({
                initData: data,
            });
        });
    };

    handleUnassignedCoordinators = () =>{
        this.props.loading(true);
        OrganizationUnitsApi.getUnassignedCoordinators()
        .then(response => {
            this.setState({
                unassignedCoordinators: response.data.data,
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleAddDirectorCoordinator = (coordinators) =>{
        this.props.loading(true);
        OrganizationUnitsApi.addDirectorCoordinators(this.state.initData.code, coordinators)
        .then(response => {
            console.log(response.data.data)
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.directorCoordinators = response.data.data;
                return {initData}
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleRemoveDirectorCoordinator = (coordinator) =>{
        this.props.loading(true);
        OrganizationUnitsApi.removeDirectorCoordinators(this.state.initData.code, coordinator)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.directorCoordinators = response.data.data;
                return {initData}
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount() {
        if(this.props.action === "edit"){
            this.setState({
                isEdit: true,
                initData: this.props.initialValues,
            });
        }
        if(this.props.initialValues.role === 'DIRECTOR'){
            this.handleUnassignedCoordinators();
        }
    }

    render(){
        const {isLoading, initialValues, action, error, clearError, ous, handleClose} = this.props;
        const {isEdit, initData, unassignedCoordinators} = this.state;
        return(
            <OrganizationUnit
                initialValues={initData}
                isLoading={isLoading}
                error={error}
                submitSucceeded={this.handleSubmitSucceeded}
                title={action === "edit" ? constants.ORGANIZATION_UNIT_TITLE_EDIT + " " + initialValues.code : constants.ORGANIZATION_UNIT_TITLE_ADD}
                edit={isEdit}
                ous={ous}
                unassignedCoordinators={unassignedCoordinators}
                clearError={clearError}
                onAddDirectorCoordinator={this.handleAddDirectorCoordinator}
                onRemoveDirectorCoordinator={this.handleRemoveDirectorCoordinator}
                onClose={handleClose}
            />
        )
    }
}

OrganizationUnitContainer.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	loading: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationUnitContainer);