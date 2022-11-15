import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import Protocols from 'components/modules/accountant/coordinator/publicProcurement/protocols';
import { getPublicProcurementProtocolStatuses, findSelectFieldPosition, getVats, updateOnCloseDetails } from 'utils/';
import * as constants from 'constants/uiNames';
import ProtocolApi from 'api/modules/publicProcurement/coordinator/protocolsApi';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';

class ProtocolsContainer extends Component {
    state = {
        protocols: [],
        coordinators: [],
        vats: getVats(),
        statuses: [
            {
                code: '',
                name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS,
            }
        ].concat(getPublicProcurementProtocolStatuses()),
    };

    handleGetProtocols = () =>{
        this.props.loading(true);
        ProtocolApi.getProtocols()
        .then(response => {
            this.setState(prevState => {
                let protocols = [...prevState.protocols];
                protocols = response.data.data;
                protocols.map(protocol => {
                    return Object.assign(protocol,
                        {
                            status: protocol.status = findSelectFieldPosition(this.state.statuses, protocol.status),
                        }
                    )
                })

                return{protocols}
            });
            this.props.loading(false)
        })
        .catch(error => {
            this.props.loading(false);
        });
    }

    handleGetCoordinators(){
        return OrganizationUnitsApi.getCoordinators()
        .then(response => {
            this.setState(prevState => {
                let coordinators = [...prevState.coordinators];
                coordinators =  coordinators.concat(response.data.data);
                return {coordinators};
            });
        })
        .catch(error => {});
    }

    handleUpdateOnCloseDetails = (closedProtocol, action) => {
        if(action === 'sendBack'){
            this.setState(prevState => {
                let protocols = [...prevState.protocols];
                const idx = protocols.findIndex(protocol => protocol.id === closedProtocol.id);
                if(idx !== null){
                    protocols.splice(idx, 1);
                }
                return {protocols};
            });
            return this.state.protocols;
        } else {
            return updateOnCloseDetails(this.state.protocols, closedProtocol);
        }
    }

    componentDidMount(){
        this.handleGetProtocols();
        this.handleGetCoordinators();
    }

    render(){
        const { isLoading, error, clearError, levelAccess } = this.props;
        const { protocols, coordinators, statuses, vats } = this.state;
        return (
            <Protocols
                initialValues={protocols}
                coordinators={coordinators}
                statuses={statuses}
                vats={vats}
                levelAccess={levelAccess}
                isLoading={isLoading}
                error={error}
                clearError={clearError}
                onClose={this.handleUpdateOnCloseDetails}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProtocolsContainer);