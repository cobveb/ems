import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { updateHeaderName } from 'actions/uiAction';
import Module from 'components/modules/modules/module';

class ModuleContainer extends Component {

    render(){
        const {module} = this.props;
        return(
            <Module
                code={module.code}
                name={module.name}
                updateHeader={this.props.updateName}
            />
        )
    }
}

ModuleContainer.propTypes = {
    updateName : PropTypes.func.isRequired
};

function mapDispatchToProps (dispatch) {
    return {
        updateName: bindActionCreators(updateHeaderName, dispatch)
    }
};

export default connect(null, mapDispatchToProps)(ModuleContainer);