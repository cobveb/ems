import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import GroupContainer from 'containers/modules/administrator/groupContainer';

const styles = theme => ({
    tableWrapper: {
            minHeight: `calc(100vh - ${theme.spacing(35 )}px)`,
    },
})

class Groups extends Component {
    state = {
        rows:[],
        headCells: [
            {
                id: 'code',
                numeric: false,
                label: constants.GROUPS_TABLE_HEAD_ROW_CODE,
                boolean: false,
            },
            {
                id: 'name',
                numeric: false,
                label: constants.GROUPS_TABLE_HEAD_ROW_NAME,
                boolean: false,
            },
        ],
        selected: '',
        codeNameSearch: '',
        isDetailsVisible: false,
        action:'',
    }

    filter = (event) => {
        let groups = this.props.initialValues;
        return groups[0].basic.filter((item) => {
            return (
                item.name.toLowerCase().search(
                    this.state.codeNameSearch.toLowerCase()) !== -1 ||
                item.code.toLowerCase().search(
                    this.state.codeNameSearch.toLowerCase()) !== -1
            )
        });
    }

    handleChangeSearch = (event) => {
        this.setState({codeNameSearch: event.target.value})
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleClose = (group) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: '',
            rows: this.props.onClose(group),
        }));
    }

    handleDeleteGroup = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleConfirmDeleteGroup = () =>{
        this.props.onDelete(this.state.selected.code);
        this.setState({
            action: '',
            selected: '',
        });
    }

    handleCancelDeleteGroup = () =>{
        this.setState({ action: '' });
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                 rows: this.filter(),
            });
        } else if (this.state.codeNameSearch !== prevState.codeNameSearch){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){

        const { classes, isLoading, error } = this.props;
        const { headCells, rows, selected, action } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {action === "delete" &&
                    <ModalDialog
                        message={constants.GROUP_CONFIRM_DELETE_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmDeleteGroup}
                        onClose={this.handleCancelDeleteGroup}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}

                <div>
                    {this.state.isDetailsVisible ?
                        <GroupContainer
                            initialValues={action === "add" ? {} : selected}
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
                                <Typography variant="h6">{constants.SUBMENU_ACCESS_CONTROL_GROUPS}</Typography>
                                <Divider />
                                <Grid container spacing={1} direction="row">
                                    <Grid item xs={12}>
                                        <SearchField
                                            name="codeNameSearch"
                                            onChange={this.handleChangeSearch}
                                            label={constants.GROUPS_SEARCH_CODE_NAME}
                                            placeholder={constants.GROUPS_SEARCH_CODE_NAME}
                                        />
                                    </Grid>
                                </Grid>
                                <Table
                                    className={classes.tableWrapper}
                                    rows={rows}
                                    headCells={headCells}
                                    onSelect={this.handleSelect}
                                    defaultOrderBy="code"
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
                                    disabled={!selected}
                                    variant="edit"
                                    onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                    data-action="edit"
                                />
                                <Button
                                    label={constants.BUTTON_DELETE}
                                    icon=<Delete className={classes.icon}/>
                                    iconAlign="right"
                                    disabled={!selected || selected.code ==="admin"}
                                    onClick = {(event) => this.handleDeleteGroup(event, 'delete', )}
                                    variant="delete"
                                />
                            </Grid>
                        </>
                    }
                </div>
            </>
        )
    }
}

Groups.propType = {
    classes: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isLoading,
    error: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(Groups);