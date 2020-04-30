import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Institution from 'components/modules/administrator/institution/institution';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';

class InstitutionContainer extends Component {
    state = {
        data: null,
    }

    handelSubmitSucceeded = (data) => {
        OrganizationUnitsApi.saveOu(data)
        .then(response => {
            this.setState({
                data: response.data.data,
            });
            this.props.loading(false)
        })
        .catch(error => {});

    };

    handleInitialValues(){
        this.props.loading(true);
        OrganizationUnitsApi.getMainOu()
        .then(response => {
            this.setState({
                data: response.data.data,
            })
            this.props.loading(false)
        })
        .catch(error => {});
    }

    componentDidMount() {
        this.handleInitialValues();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        return(
            <Institution
                initialValues={this.state.data}
                isLoading={isLoading}
                error={error}
                submitSucceeded={this.handelSubmitSucceeded}
                clearError={clearError}
            />
        )
    }
}

InstitutionContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(InstitutionContainer);