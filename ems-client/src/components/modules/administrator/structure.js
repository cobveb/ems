import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import { Delete, Add, Edit, Folder } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';
import Collapse from '@material-ui/core/Collapse';
import { Link } from 'react-router-dom';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import {generateTreeStructure, isExistsOuNodes} from 'utils'
import { SearchField, Button, Checkbox } from 'common/gui';


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
    treeAction: {
        margin: 0,
        padding: 0,
        height: theme.spacing(5.5),
    },
    treeContent: {
        height: `calc(100vh - ${theme.spacing(32)}px)`,
        overflow: 'auto'
    },
    root: {
        flexGrow: 1,
    },
    grid: {
        height: `100%`,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
})


class Structure extends Component {

    state = {
        filter: [],
        selectedIndex: '',
        actionDelete: false,
        message: constants.STRUCTURE_CONFIRM_DELETE_MESSAGE,
        inactive: false,
        searchValue: '',
    };

    handleListItemClick = (event, index) => {
        this.setState({ selectedIndex: index });
    };

    handleConfirmDeleteOu = () =>{
        this.setState({ actionDelete: !this.state.actionDelete });
        this.props.onDelete(this.state.selectedIndex);
    }

    handleCancelDeleteOu = () =>{
        this.setState({ actionDelete: !this.state.actionDelete });
    }

    getNodes = (nodes) => {
        return(
            <div>
                {nodes.map( node =>
                    <Collapse in={true} component="ul" key={node.code}>
                        <List component="nav" disablePadding key={node.code}>
                            <ListItem
                                button
                                selected={this.state.selectedIndex === node.code}
                                onClick={event => this.handleListItemClick(event, node.code)}
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


    filterList = (event) => {
        let searchValue ='';
        let updateList = [];
        let ous = this.props.initialValues;
        if(event.target.id === 'search'){
            searchValue = event.target.value;
            this.setState({
                searchValue: event.target.value,
            });
        }

        if(event.target.id === 'inactive'){
            searchValue = this.state.searchValue
            this.setState({
                inactive: !this.state.inactive,
            });

            if(!this.state.inactive === false){
                ous = ous.filter(ou => ou.active === true)
            }
        } else if (this.state.inactive === false){
            ous = ous.filter(ou => ou.active === true)
        }

        updateList = ous.filter((item) => {
            return item.name.toLowerCase().search(
                searchValue.toLowerCase()) !== -1;
        });

        this.setState({
            filter: generateTreeStructure(updateList),
            selectedIndex: '',
        });
    };

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    componentDidUpdate(prevProps){
        if(this.props.initialValues !== prevProps.initialValues){
            let ous = this.props.initialValues;
            ous = ous.filter(ou => ou.active === true)
            this.setState({
                filter: generateTreeStructure(ous),
            });
        }
    }

    render(){
        const { classes, isLoading, error, } = this.props;
        const {filter, selectedIndex, actionDelete, message, inactive } = this.state;

        return(
            <>
                {isLoading && <Spinner />}
                {actionDelete && <ModalDialog message={message} variant="confirm" onConfirm={this.handleConfirmDeleteOu} onClose={this.handleCancelDeleteOu}/>}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <div className={classes.root}>
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
                    <div  className={classes.treeContent}>
                    <Grid item xs={12}>
                        <Divider />
                        <List component="ul">
                            {filter.map(ou =>
                                <div key={ou.code}>
                                    <ListItem
                                        button
                                        selected={this.state.selectedIndex === ou.code}
                                        onClick={event => this.handleListItemClick(event, ou.code)}
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
                    <div className={classes.treeAction}>
                        <Grid item xs={12} className={classes.grid}>
                            <Divider />
                            <Grid
                              container
                              direction="row"
                              justify="center"
                              alignItems="flex-end"
                              className={classes.grid}
                            >
                                <Button
                                    label={constants.BUTTON_ADD}
                                    icon=<Add className={classes.icon}/>
                                    iconAlign="right"
                                    disabled={selectedIndex.length === 0}
                                    variant="add"
                                    component={Link}
                                    to={`structure/addOu/${selectedIndex}`}
                                />
                                <Button
                                    label={constants.BUTTON_EDIT}
                                    icon=<Edit className={classes.icon}/>
                                    iconAlign="right"
                                    disabled={selectedIndex.length === 0 || (selectedIndex === filter[0].code && filter[0].parent === null)}
                                    variant="edit"
                                    component={Link}
                                    to={`structure/editOu/${selectedIndex}`}
                                />
                                <Button
                                    label={constants.BUTTON_DELETE}
                                    icon=<Delete className={classes.icon}/>
                                    iconAlign="right"
                                    disabled={selectedIndex.length === 0 || (selectedIndex === filter[0].code && filter[0].parent === null) || isExistsOuNodes(selectedIndex, this.props.initialValues)}
                                    onClick = {this.handleCancelDeleteOu}
                                    variant="delete"
                                />
                             </Grid>
                         </Grid>
                     </div>
                 </Grid>
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