import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import CostType from 'components/modules/accountant/dictionary/costType'


const response = {
    data: {
        data: [
            {
                "id": 1,
                "year": new Date(2019,0,1).toJSON(),
                "coordinators": [
                    { "code": "it",
                      "name": "Dział Informatyki",
                      "shortName": "Dział Informatyki",
                      "nip": null,
                      "regon": null,
                      "city": null,
                      "zipCode": null,
                      "street": null,
                      "building": null,
                      "phone": null,
                      "fax": null,
                      "email": "it@uck.katowice.pl",
                      "active": true,
                      "coordinator": true,
                      "parent": "uck"
                    },
                ],
            },
            {
                "id": 2,
                "year": new Date(2020,0,1).toJSON(),
                "coordinators": [
                    { "code": 'adm' },
                ]
            },
            {
                "id":3,
                "year": new Date(2021,0,1).toJSON(),
                "coordinators": [
                    { "code": 'lab' },
                ]
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

    handleGetYearsValidity = () => {
        this.setState(prevState => {
            let initData = {...prevState.initData};
            Object.assign(initData, this.props.initialValues)
            //TODO : Pobranie okresów obowiązywania z API
            initData.years =  response.data.data;
            return {initData};
        });
    }

    componentDidMount(){
        if(this.props.action === "edit"){
            this.handleGetYearsValidity();
        }
    }


    render(){
        const {isLoading, error, clearError, action, coordinators} = this.props;
        const {initData} = this.state;
        return(
            <CostType
                isLoading = {isLoading}
                initialValues = {initData}
                coordinators = {coordinators}
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