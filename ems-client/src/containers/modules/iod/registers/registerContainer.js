import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import RegisterFormContainer from 'containers/modules/iod/registers/forms/registerFormContainer';
import RegisterApi from 'api/common/registerApi';
import { findIndexElement } from 'utils/';

class RegisterContainer extends Component {
    state = {
        initData: {
            positions: [],
        }
    }

    handleGetRegisterPositions(){
        this.props.loading(true);
        RegisterApi.getRegisterPositions(this.props.initialValues.code)
        .then(response =>{
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                initData.positions = response.data.data;
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleSubmitRegister = (values) =>{
        this.props.loading(true)
        RegisterApi.saveRegister(values)
        .then(response => {
            this.setState( prevState => {
                const initData = {...prevState.initData};
                Object.assign(initData, response.data.data);
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleSubmitRegisterPosition = (values, action) =>{
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        RegisterApi.saveRegisterPosition(this.state.initData.code, payload)
        .then(response => {
            this.setState( prevState => {
                const initData = {...prevState.initData};
                if(action === "add"){
                    initData.positions.push(response.data.data);
                } else {
                    const idx = findIndexElement(values, this.state.initData.positions);
                    if(idx !== null){
                        initData.positions.splice(idx, 1, response.data.data);
                    }
                }
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleDeletePosition = (position) =>{
        const idx = findIndexElement(position, this.state.initData.positions);
        if(idx !== null){
            RegisterApi.deleteRegisterPosition(this.state.initData.code, position.id)
            .then(response => {
                this.setState( prevState => {
                    const initData = {...prevState.initData};
                    initData.positions.splice(idx, 1);
                    return {initData};
                });
            })
            .catch(error => {});
        }
    }

    componentDidMount() {
        this.setState(prevState => {
            let initData = {...prevState.initData};
            Object.assign(initData, this.props.initialValues);
            return {initData};
        });
        this.handleGetRegisterPositions();
    }

    render() {
        return (
            <RegisterFormContainer
                initialValues={this.state.initData}
                isLoading={this.props.isLoading}
                error={this.props.error}
                clearError={this.props.clearError}
                onSubmit={this.handleSubmitRegister}
                onSubmitPosition={this.handleSubmitRegisterPosition}
                onDeletePosition={this.handleDeletePosition}
                onClose={this.props.onClose}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);