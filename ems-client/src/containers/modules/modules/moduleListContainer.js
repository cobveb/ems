import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { updateHeaderName } from 'actions';
import ModuleList from 'components/modules/modules/moduleList';

class ModulesAllContainer extends Component {

    render(){
        const {modules, updateName} = this.props;
        return(
            <ModuleList modules={modules} updateHeader={updateName} />
        )
    }
}

ModulesAllContainer.propTypes = {
    updateName : PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
	return {
		modules: state.modules.modules,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        updateName: bindActionCreators(updateHeaderName, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModulesAllContainer);