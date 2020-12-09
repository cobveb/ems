import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading } from 'actions/';
import CostType from 'components/modules/accountant/dictionary/costType'
import CostTypeApi from 'api/modules/accountant/costTypeApi';

class CostTypeContainer extends Component {
    state = {
        initData: {
            active: false,
            years:[],
        },
        error:false,
    }

    parseCostYearsYearToJson = (years) => {
        years.map(year => {
           return Object.assign(year, {year: new Date(`${year.year}`,0,1).toJSON()})
        })
        return years
    }

    handleSubmit = (values) => {
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        if(payload.years.length > 0 ){
            payload.years.map(year => {
               return Object.assign(year, {year: new Date(year.year).getFullYear()})
            })
        }
        CostTypeApi.saveCostType(payload)
        .then(response => {
            this.props.changeAction("edit");
            this.setState(prevState => {
                let initData = {...prevState.initData};
                let error = {...prevState.error};
                Object.assign(initData, response.data.data);
                initData.years.length > 0 && this.parseCostYearsYearToJson(initData.years);
                error = false;
                return {initData, error};
            });
            this.props.loading(false)
        })
        .catch(error => {
            this.setState({
                initData: values,
                error: true,
            });
            this.props.loading(false)
        });
    }

    handleClose = () => {
        this.props.onClose(this.state.error===false ? this.state.initData : this.props.initialValues)
    }

    handleGetYearsValidity = () => {
        this.props.loading(true);
        CostTypeApi.getYearsByCostType(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues)
                initData.years =  (response.data.data.length > 0 ? this.parseCostYearsYearToJson(response.data.data) : response.data.data);
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    componentDidMount(){
        if(this.props.action === "edit"){
            this.handleGetYearsValidity();
        }
    }


    render(){
        const {isLoading, action, coordinators, allCosts} = this.props;
        const {initData} = this.state;
        return(
            <CostType
                isLoading = {isLoading}
                initialValues = {initData}
                coordinators = {coordinators}
                action={action}
                handleSubmit={this.handleSubmit}
                onClose={this.handleClose}
                allCosts={allCosts}
            />
        );
    };
};

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CostTypeContainer);