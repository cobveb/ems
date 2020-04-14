import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Structure from 'components/modules/administrator/ou/structure';
import AdministratorApi from 'api/modules/administrator/administratorApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import {updateOnCloseDetails} from 'utils';

class StructureContainer extends Component {
    state = {
        initData: [],
    }

    handleAll(){
        this.props.loading(true);
        AdministratorApi.getAllOu()
        .then(response => {
            this.setState({
                initData: response.data.data,
            })
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleDelete = (code) => {
        this.props.loading(true);
        AdministratorApi.deleteOu(code)
        .then(response => {
            let ous = this.state.initData
            ous = ous.filter(ou => ou.code !== code)
            this.setState({
                initData: ous,
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleUpdateOnClose = (ou) => {
        let ous = this.state.initData;
        return updateOnCloseDetails(ous, ou, 'code');
    }

    componentDidMount() {
        this.handleAll();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {initData} = this.state;
        return(
            <Structure
                initialValues={initData}
                isLoading={isLoading}
                error={error}
                loading={loading}
                onDelete={this.handleDelete}
                onClose={this.handleUpdateOnClose}
                clearError={clearError}
            />
        )
    }
}

StructureContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(StructureContainer);