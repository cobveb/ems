import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import CostTypeContainer from 'containers/modules/accountant/dictionary/costTypeContainer';

const styles = theme => ({
    tableWrapper: {
            minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})

class CostsTypes extends Component {
    state = {
        headCells: [
            {
                id: 'number',
                label: constants.ACCOUNTANT_COSTS_TYPES_TABLE_HEAD_ROW_NUMBER,
                type: 'text',
            },
            {
                id: 'name',
                label: constants.ACCOUNTANT_COSTS_TYPES_TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
        ],
        selected: {},
        rows: this.props.initialValues,
        codeNameSearch: '',
        isDetailsVisible: false,
        action:'',
    }

    filter = () => {
        let costs = this.props.initialValues;
        return costs.filter((cost) => {
            return cost.number.toLowerCase().search(
                this.state.codeNameSearch.toLowerCase()) !== -1 ||
                cost.name.toLowerCase().search(
                this.state.codeNameSearch.toLowerCase()) !== -1
        });
    }

    handleChangeSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleClose = (cost) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: {},
            action: '',
            rows: this.props.onClose(cost),
        }));
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues,
            });
        } else if (this.state.codeNameSearch !== prevState.codeNameSearch){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error, coordinators } = this.props;
        const { headCells, rows, selected, action } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {action === "delete" &&
                    <ModalDialog
                        message={constants.ACCOUNTANT_COSTS_TYPES_CONFIRM_DELETE_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <div>
                    {this.state.isDetailsVisible ?
                        <CostTypeContainer
                            initialValues={selected}
                            coordinators={coordinators}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            action={action}
                            onClose={this.handleClose}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                            >
                                <Typography variant="h6">{constants.ACCOUNTANT_SUBMENU_DICTIONARIES_COST_TYPES}</Typography>
                                <Divider />
                                <Grid container spacing={1} direction="row">
                                    <Grid item xs={12}>
                                        <SearchField
                                            name="codeNameSearch"
                                            onChange={this.handleChangeSearch}
                                            label={constants.ACCOUNTANT_COSTS_TYPES_SEARCH_NUMBER_NAME}
                                            placeholder={constants.ACCOUNTANT_COSTS_TYPES_SEARCH_NUMBER_NAME}
                                        />
                                    </Grid>
                                </Grid>
                                <Table
                                    className={classes.tableWrapper}
                                    rows={rows}
                                    headCells={headCells}
                                    onSelect={this.handleSelect}
                                    defaultOrderBy="number"
                                    rowKey="id"
                                />
                            </Grid>
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
                                    variant="add"
                                    onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                                    data-action="add"
                                />
                                <Button
                                    label={constants.BUTTON_EDIT}
                                    icon=<Edit className={classes.icon}/>
                                    iconAlign="right"
                                    disabled={Object.keys(selected).length === 0}
                                    variant="edit"
                                    onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                    data-action="edit"
                                />
                                <Button
                                    label={constants.BUTTON_DELETE}
                                    icon=<Delete className={classes.icon}/>
                                    iconAlign="right"
                                    disabled={Object.keys(selected).length === 0}
                                    onClick = {(event) => this.handleDeleteGroup(event, 'delete', )}
                                    variant="delete"
                                />
                            </Grid>
                        </>
                    }
                </div>
            </>
        );
    };
};

CostsTypes.propType = {
    classes: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
    coordinators: PropTypes.array,
    isLoading: PropTypes.bool.isLoading,
    error: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(CostsTypes);
