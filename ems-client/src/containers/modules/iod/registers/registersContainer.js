import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import Registers from 'components/modules/iod/registers/registers';
import RegisterApi from 'api/common/registerApi';

class RegistersContainers extends Component {
    state = {
        registers: [],
    }

    handleGetRegisters(){
        this.props.loading(true);
        RegisterApi.getRegisters()
        .then(response =>{
            this.setState(prevState => {
                let registers = [...prevState.registers];
                registers = response.data.data;
                return {registers};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    componentDidMount() {
        this.handleGetRegisters();
    }


    render() {
        return (
            <Registers
                initialValues={this.state.registers}
                isLoading={this.props.isLoading}
                error={this.props.error}
                clearError={this.props.clearError}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistersContainers);