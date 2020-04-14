import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import { Delete, Add, Edit, Folder } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';
import Collapse from '@material-ui/core/Collapse';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import {generateTreeStructure, isExistsOuNodes} from 'utils'
import { SearchField, Button, Checkbox } from 'common/gui';
import OrganizationUnitContainer from 'containers/modules/administrator/organizationUnitContainer';

const styles = theme => ({
    button: {
        margin: theme.spacing(0.5),
    },
    buttonLabel: {
        textTransform: 'capitalize',
    },
    icon: {
        marginLeft: theme.spacing(1),
    },
    treeContent: {
        height: `calc(100vh - ${theme.spacing(33)}px)`,
        overflow: 'auto'
    },
})


class Structure extends Component {

    state = {
        filter: [],
        selected: '',
        action: '',
        message: constants.STRUCTURE_CONFIRM_DELETE_MESSAGE,
        inactive: false,
        searchValue: '',
        isDetailsVisible: false,
    };

    handleListItemClick = (event, index) => {
        this.setState({ selected: index });
    };

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleDeleteOu = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleConfirmDeleteOu = () =>{
        this.props.onDelete(this.state.selected.code);
        this.setState({
            action: '',
            selected: '',
        });
    }

    handleCancelDeleteOu = () =>{
        this.setState({ action: '' });
    }

    getNodes = (nodes) => {
        return(
            <div>
                {nodes.map( node =>
                    <Collapse in={true} component="ul" key={node.code}>
                        <List component="nav" disablePadding key={node.code}>
                            <ListItem
                                button
                                selected={this.state.selected === node}
                                onClick={event => this.handleListItemClick(event, node)}
                                key={node.code}
                                divider
                            >
                                <ListItemIcon>
                                    <Folder />
                                </ListItemIcon>
                                <ListItemText primary={node.name} />
                            </ListItem>
                        </List>
                        {node.nodes !== null ? this.getNodes(node.nodes ): null}
                    </Collapse>
                )}
            </div>
        )
    };

    updateListOnSearchValue = (ous, searchValue) => {
    return ous.filter((item) => {
        return item.name.toLowerCase().search(
            searchValue.toLowerCase()) !== -1;
        });
    }

    filterList = (event) => {
        let searchValue = this.state.searchValue;
        let ous = this.props.initialValues;

        if(event.target.id === 'search'){
            searchValue = event.target.value;
            this.setState({
                searchValue: event.target.value,
            });
        }

        if(event.target.id === 'inactive'){

            this.setState({
                inactive: !this.state.inactive,
            });

            if(!this.state.inactive === false){
                ous = ous.filter(ou => ou.active === true)
            }
        } else if (this.state.inactive === false){
            ous = ous.filter(ou => ou.active === true)
        }

        this.setState({
            filter: generateTreeStructure(this.updateListOnSearchValue(ous, searchValue)),
            selected: '',
        });
    };

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    handleClose = (ou) => {
        let ous = (!this.state.inactive ? this.props.onClose(ou).filter(ou => ou.active === true) : this.props.onClose(ou))

        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: '',
            filter: generateTreeStructure(this.updateListOnSearchValue(ous, this.state.searchValue)),
        }));
    }

    componentDidUpdate(prevProps){
        if(this.props.initialValues !== prevProps.initialValues){
            let ous = this.props.initialValues;
            if(!this.state.inactive){
                ous = ous.filter(ou => ou.active === true)
            }
            this.setState({
                filter: generateTreeStructure(ous),
            });
        }
    }

    render(){
        const { classes, isLoading, error, } = this.props;
        const {filter, selected, action, message, inactive, isDetailsVisible } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {action === "delete" &&
                    <ModalDialog
                        message={message}
                        variant="confirm"
                        onConfirm={this.handleConfirmDeleteOu}
                        onClose={this.handleCancelDeleteOu}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <div>
                    { isDetailsVisible ?
                        <OrganizationUnitContainer
                            initialValues={action === "add" ? {parent: selected.code} : selected}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            action={action}
                            handleClose={this.handleClose}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                            >
                                <Typography variant="h6">{constants.SUBMENU_INSTITUTION_STRUCTURE}</Typography>
                                <Divider />
                                <Grid
                                    container
                                    spacing={0}
                                    justify="flex-start"
                                    direction="row"
                                    alignItems="center"
                                >
                                    <Grid item xs={12}>
                                        <SearchField
                                            onChange={this.filterList}
                                            value={this.state.searchValue}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Checkbox
                                            label={constants.STRUCTURE_SHOW_INACTIVE}
                                            labelPlacement="start"
                                            onChange={this.filterList}
                                            checked={inactive}
                                            id="inactive"
                                        />
                                    </Grid>
                                </Grid>
                                <div className={classes.treeContent}>
                                <Grid item xs={12}>
                                    <Divider />
                                    <List component="ul">
                                        {filter.map(ou =>
                                            <div key={ou.code}>
                                                <ListItem
                                                    button
                                                    selected={this.state.selected === ou}
                                                    onClick={event => this.handleListItemClick(event, ou)}
                                                    key={ou.code}
                                                    divider
                                                >
                                                    <ListItemIcon >
                                                        <Folder />
                                                    </ListItemIcon>
                                                    <ListItemText primary={ou.name} />
                                                </ListItem>
                                                {ou.nodes !== null ? this.getNodes(ou.nodes) : null}
                                            </div>
                                        )}
                                    </List>
                                </Grid>
                                </div>
                                <div>
                                    <Grid item xs={12}>
                                        <Divider />
                                        <Grid
                                          container
                                          direction="row"
                                          justify="center"
                                          alignItems="flex-end"
                                        >
                                            <Button
                                                label={constants.BUTTON_ADD}
                                                icon=<Add className={classes.icon}/>
                                                iconAlign="right"
                                                disabled={selected.length === 0 || (selected.active === false)}
                                                variant="add"
                                                onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                                                data-action="add"
                                            />
                                            <Button
                                                label={constants.BUTTON_EDIT}
                                                icon=<Edit className={classes.icon}/>
                                                iconAlign="right"
                                                disabled={selected.length === 0 || (selected.code === filter[0].code && filter[0].parent === null)}
                                                variant="edit"
                                                onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                                data-action="edit"
                                            />
                                            <Button
                                                label={constants.BUTTON_DELETE}
                                                icon=<Delete className={classes.icon}/>
                                                iconAlign="right"
                                                disabled={selected.length === 0 || (selected.code === filter[0].code && filter[0].parent === null) || isExistsOuNodes(selected.code, this.props.initialValues)}
                                                onClick = {(event) => this.handleDeleteOu(event, 'delete', )}
                                                variant="delete"
                                            />
                                         </Grid>
                                     </Grid>
                                 </div>
                             </Grid>
                        </>
                    }
                </div>
            </>
        )
    }
}

Structure.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default withStyles(styles)(Structure);