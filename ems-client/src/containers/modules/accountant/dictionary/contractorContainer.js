import React, { Component } from 'react';
import { connect } from "react-redux";
import ContractorFormContainer from 'containers/modules/accountant/dictionary/forms/contractorFormContainer';
import ContractorApi from 'api/modules/accountant/dictionary/contractorApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';

class ContractorContainer extends Component {

    state = {
        initData: {
            active: true,
        }
    }

    handleSubmit = (values) => {
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        ContractorApi.saveContractor(payload)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, response.data.data);
                return {initData};
            });
            this.props.loading(false);
            this.handleClose();
        })
        .catch(error => {});
    }

    handleClose = () =>{
        this.props.onClose(this.state.initData);
    }

    componentDidMount(){
        this.setState(prevState => {
            let initData = {...prevState.initData};
            Object.assign(initData, this.props.initialValues)
            return {initData};
        });
    }

    render(){
        const { isLoading, error, clearError, action, open } = this.props;
        const { initData } = this.state;
        return(
            <ContractorFormContainer
                initialValues = {initData}
                isLoading = {isLoading}
                error = {error}
                clearError={clearError}
                action = {action}
                open = {open}
                onSubmit={this.handleSubmit}
                onClose={this.handleClose}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContractorContainer);