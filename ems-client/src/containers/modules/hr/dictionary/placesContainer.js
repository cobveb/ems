import React, { Component } from 'react';
import { connect } from "react-redux";
import Places from 'components/modules/hr/dictionary/places';
import PlacesApi from 'api/modules/hr/dictionary/placesApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import { updateOnCloseDetails, findSelectFieldPosition, generateExportLink, findIndexElement } from 'utils';
import DictionaryApi from 'api/common/dictionaryApi';
import * as constants from 'constants/uiNames';

class PlacesContainer extends Component {
    state = {
        places:[],
        locations:[
            {
                code: '',
                name: constants.HR_PLACE_SEARCH_LOCATION,
            },
        ],
    }

    handleGetPlaces(){
        PlacesApi.getAllPlaces()
        .then(response => {
            this.setState(prevState => {
                let places = [...prevState.places];
                places = response.data.data;
                places.map(place => (
                    Object.assign(place,
                        {
                            location: place.location = findSelectFieldPosition(this.state.locations, place.location.code),
                        }
                    )
                ))
                return {places};
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleGetLocations = () =>{
        this.props.loading(true);
        return DictionaryApi.getDictionaryActiveItems('slHrLoc')
        .then(response => {
            this.setState({
                locations: this.state.locations.concat(response.data.data),
            })
            this.handleGetPlaces();
        })
        .catch(error => {});
    }

    handleUpdateOnClose = (place) => {
        let places = this.state.places;
        return updateOnCloseDetails(places, place);
    }

    handleDelete = (place) => {
        this.props.loading(true);
        PlacesApi.deletePlace(place.id)
        .then(response => {
            this.setState(prevState => {
                const places = [...prevState.places];
                const idx = findIndexElement(place, places);
                if(idx !== null){
                    places.splice(idx, 1);
                }
                return {places};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PlacesApi.exportPlacesToExcel(exportType, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount() {
        this.handleGetLocations();

    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {places, locations} = this.state;
        return(
            <Places
                initialValues = {places}
                locations = {locations}
                isLoading = {isLoading}
                error = {error}
                clearError={clearError}
                onClose={this.handleUpdateOnClose}
                onDelete={this.handleDelete}
                onExcelExport={this.handleExcelExport}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlacesContainer);