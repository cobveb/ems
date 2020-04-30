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
        isEdit: false,
    }

    handelSubmitSucceeded = (data) => {
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

    componentDidMount() {
        if(this.props.action === "edit"){
            this.setState({
                isEdit: true,
                initData: this.props.initialValues,
            });
        }
    }

    render(){
        const {isLoading, initialValues, action, error, clearError, handleClose} = this.props;
        const {isEdit, initData} = this.state;

        return(
            <OrganizationUnit
                initialValues={initData}
                isLoading={isLoading}
                error={error}
                submitSucceeded={this.handelSubmitSucceeded}
                title={action === "edit" ? constants.ORGANIZATION_UNIT_TITLE_EDIT + " " + initialValues.code : constants.ORGANIZATION_UNIT_TITLE_ADD}
                edit={isEdit}
                clearError={clearError}
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