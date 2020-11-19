import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import {findCoordinator} from 'utils';
import CostType from 'components/modules/accountant/dictionary/costType'


const response = {
    data: {
        data: [
            {
                coordinator: {
                    code: 'it',
                },
                year: 2020,
            },
            {
                coordinator: {
                    code: 'adm',
                },
                year: 2020,
            },
            {
                coordinator: {
                    code: 'lab',
                },
                year: 2020,
            },
        ],
    },
};

class CostTypeContainer extends Component {
    state = {
        initData: {
            years:[],
        },
    }

    handleSubmit = (values) => {
        console.log(values);
    }

    handleClose = () => {
        this.props.onClose(this.state.initData)
    }

    handleSetupYears = (years) => {
        years.map(year => (
            Object.assign(year, {
                coordinator: year.coordinator = findCoordinator(this.props.coordinators, year.coordinator.code)
            })
        ))

        return years;
    }

    handleGetYearsValidity = () => {
        this.setState(prevState => {
            let initData = {...prevState.initData};
            Object.assign(initData, this.props.initialValues)
            initData.years =  this.handleSetupYears(response.data.data);
            return {initData};
        });
    }

    componentDidMount(){
        if(this.props.action === "edit"){
            this.handleGetYearsValidity();
        }
    }


    render(){
        const {isLoading, error, clearError, action} = this.props;
        const {initData} = this.state;
        return(
            <CostType
                isLoading = {isLoading}
                initialValues = {initData}
                action={action}
                error = {error}
                clearError = {clearError}
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


export default connect(mapStateToProps, mapDispatchToProps)(CostTypeContainer);