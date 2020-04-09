import React, { Component } from 'react';
import { connect } from "react-redux";
import Parameters from 'components/modules/administrator/parameters';
import AdministratorApi from 'api/modules/administrator/administratorApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';

class ParametersContainer extends Component {
    state = {
        initData : [{
            parameters: [],
            categories: [],
            sections: [],
            categorySearch: "",
        }],
        allParams : [],
    };

    handleInitialValues(){
        this.props.loading(true);
        AdministratorApi.getParamsCategory()
        .then(response => {
            this.setState(prevState => {
                const data = response.data.data;
                const initData = [{ ...prevState.initData[0]}];
                initData[0].categories = data.map(category => {
                    return {
                        code: category,
                        name: category
                    }
                });
                initData[0].categorySearch = "System"
                return { initData };
            })
            AdministratorApi.getParamsByCategory(this.state.initData[0].categorySearch)
                .then(response => {
                    this.setState(prevState => {
                        const data = response.data.data;
                        const initData = [{ ...prevState.initData[0]}];
                        initData[0].parameters = data;
                        initData[0].sections = [...new Set(data.filter((param) => {
                            return (
                                param.category.toLowerCase().search(
                                    this.state.initData[0].categorySearch.toLowerCase()) !== -1)
                        }).map(param => param.section))].map(section => {
                            return {
                                code: section,
                                name: section
                            }
                        })
                        initData[0].sections.unshift({code: "", name: constants.SELECT_FIELD_ALL});
                        return { initData };
                    })
                })
            .catch(error => {})
            this.props.loading(false);
        })
        .catch(error => {})
    }

    handleChangeCategory = (category) =>{
        this.props.loading(true);
        AdministratorApi.getParamsByCategory(category)
        .then(response => {
            this.setState(prevState => {
                const data = response.data.data;
                const initData = [{ ...prevState.initData[0]}];
                initData[0].parameters = data;
                initData[0].sections = [...new Set(data.filter((param) => {
                    return (
                        param.category.toLowerCase().search(
                            category.toLowerCase()) !== -1)
                }).map(param => param.section))].map(section => {
                    return {
                        code: section,
                        name: section
                    }
                })
                initData[0].sections.unshift({code: "", name: constants.SELECT_FIELD_ALL});
                initData[0].categorySearch = category
                return { initData }
            })
            this.props.loading(false);
        })
        .catch(error => {})
    }

    handleSubmit = (data, closeParameterDetails) => {
        return AdministratorApi.saveParam(data)
            .then(response => {
                this.setState(prevState => {
                    const initData = [{ ...prevState.initData[0]}];
                    initData[0].parameters.filter(param =>{
                        return (param.code === data.code)
                    })[0].value = data.value;
                    return { initData }
                });
                closeParameterDetails();
            })
            .catch(error => {});
    }

    componentDidMount() {
        this.handleInitialValues();
    }

    render(){
        const {error, isLoading} = this.props;
        const {initData} = this.state;
        return(
            <Parameters
                initialValues={initData}
                error = {error}
                changeCategory = {this.handleChangeCategory}
                isLoading = {isLoading}
                onSubmit = {this.handleSubmit}
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

export default connect(mapStateToProps, mapDispatchToProps) (ParametersContainer);