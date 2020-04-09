import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import OrganizationUnit from 'components/modules/administrator/organizationUnit';
import AdministratorApi from 'api/modules/administrator/administratorApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import { Redirect } from 'react-router'
import * as constants from 'constants/uiNames';

class OrganizationUnitContainer extends Component {
    state = {
        initData: {
            active: false,
            coordinator: false,
        },
        isEdit: false,
        redirect: false,
        action: this.props.match.params.action
    }

    handelSubmitSucceeded = (data) => {
        if(this.state.action === "addOu"){
            data.parent = this.props.match.params.ou
        }
        AdministratorApi.saveOu(data)
        .then(response => {
            this.setState({
                data: response.data.data,
                redirect: true,
            });
            this.props.loading(false)
        })
        .catch(error => {});
    };

    handleInitialValues(){
        this.props.loading(true);
        AdministratorApi.getOu(this.props.match.params.ou)
        .then(response => {
            this.setState({
                initData: response.data.data,
            })
            this.props.loading(false)
        })
        .catch(error => {});
    }

    componentDidMount() {
        if(this.state.action === "editOu"){
            this.setState({
                isEdit: true,
            });
            this.handleInitialValues();
        }
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {isEdit, redirect, initData} = this.state;

        if (redirect === true) {
            return <Redirect to="/modules/administrator/structure" />
        }

        return(
            <OrganizationUnit
                initialValues={initData}
                isLoading={isLoading}
                error={error}
                submitSucceeded={this.handelSubmitSucceeded}
                title={isEdit ? constants.ORGANIZATION_UNIT_TITLE_EDIT + " " + this.props.match.params.ou : constants.ORGANIZATION_UNIT_TITLE_ADD}
                edit={isEdit}
                clearError={clearError}
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