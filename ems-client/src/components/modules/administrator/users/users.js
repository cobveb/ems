import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import UserContainer from 'containers/modules/administrator/userContainer';


const styles = theme => ({
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})

class Users extends Component {
    state = {
        rows:this.props.initialValues,
        headCells: [
            {
                id: 'id',
                label: constants.USER_TABLE_HEAD_ROW_CODE,
                type: 'text',
            },
            {
                id: 'username',
                label: constants.USER_TABLE_HEAD_ROW_USERNAME,
                type: 'text',
            },
            {
                id: 'surname',
                label: constants.USER_TABLE_HEAD_ROW_SURNAME,
                type: 'text',
            },
            {
                id: 'name',
                label: constants.USER_TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
            {
                id: 'isActive',
                label: constants.USER_TABLE_HEAD_ROW_ACTIVE,
                type: 'boolean',
            },
            {
                id: 'isLocked',
                label: constants.USER_TABLE_HEAD_ROW_LOCKED,
                type: 'boolean',
            },
        ],
        selected: '',
        username: '',
        surname: '',
        name: '',
        isDetailsVisible: false,
        action:'',
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleSearch = (event) => {
        this.setState({[event.target.id]: event.target.value})
    }

    filter = () => {
        let users = this.props.initialValues;

        return users.filter((item) => {
            return item.username.toLowerCase().search(
                this.state.username.toLowerCase()) !== -1 &&
                item.surname.toLowerCase().search(
                this.state.surname.toLowerCase()) !== -1 &&
                item.name.toLowerCase().search(
                this.state.name.toLowerCase()) !== -1
        });
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            let users = this.props.initialValues;
            users = users.filter(user => user.isActive === true)
            this.setState({
                rows: users,
            });
        } else if (this.state.username !== prevState.username ||
            this.state.surname !== prevState.surname ||
            this.state.name !== prevState.name)
        {
            this.setState({
                rows: this.filter(),
            })
        }
    }


    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleDeleteUser = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleClose = (user) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: '',
            rows: this.props.onClose(user),
        }));
    }

    handleConfirmDeleteUser = () =>{
        this.props.onDelete(this.state.selected.id);
        this.setState({
            action: '',
            selected: '',
        });
    }

    handleCancelDeleteUser = () =>{
        this.setState({ action: '' });
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    render(){
        const { classes, ous, isLoading, error } = this.props;
        const { headCells, rows, selected, action, isDetailsVisible } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {action === "delete" &&
                    <ModalDialog
                        message={constants.USER_CONFIRM_DELETE_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmDeleteUser}
                        onClose={this.handleCancelDeleteUser}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <div>
                    { isDetailsVisible ?
                        <UserContainer
                            initialValues={action === "add" ? {} : selected}
                            ous={ous}
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
                                <Typography variant="h6">{constants.SUBMENU_ACCESS_CONTROL_USERS}</Typography>
                                <Divider />
                                <Grid container spacing={1} direction="row">
                                    <Grid item xs={4}>
                                        <SearchField
                                            id="username"
                                            onChange={this.handleSearch}
                                            label={constants.USERS_SEARCH_USERNAME}
                                            placeholder={constants.USERS_SEARCH_USERNAME}
                                            valueType="digits"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <SearchField
                                            id="surname"
                                            onChange={this.handleSearch}
                                            label={constants.USERS_SEARCH_SURNAME}
                                            placeholder={constants.USERS_SEARCH_SURNAME}
                                            valueType="all"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <SearchField
                                            id="name"
                                            onChange={this.handleSearch}
                                            label={constants.USERS_SEARCH_NAME}
                                            placeholder={constants.USERS_SEARCH_NAME}
                                            valueType="all"
                                        />
                                    </Grid>
                                </Grid>
                                <Table
                                    className={classes.tableWrapper}
                                    rows={rows}
                                    headCells={headCells}
                                    onSelect={this.handleSelect}
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
                                    disabled={!selected}
                                    variant="edit"
                                    onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                    data-action="edit"
                                />
                                <Button
                                    label={constants.BUTTON_DELETE}
                                    icon=<Delete className={classes.icon}/>
                                    iconAlign="right"
                                    disabled={!selected}
                                    onClick = {(event) => this.handleDeleteUser(event, 'delete', )}
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

Users.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
};

export default withStyles(styles)(Users);