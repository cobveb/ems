import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import { Link } from 'react-router-dom';


const styles = theme => ({
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(35)}px)`,
    },
})

class Users extends Component {
    state = {
        rows:[],
        headCells: [
            {
                id: 'id',
                numeric: false,
                label: constants.USER_TABLE_HEAD_ROW_CODE,
                boolean: false,
            },
            {
                id: 'username',
                numeric: false,
                label: constants.USER_TABLE_HEAD_ROW_USERNAME,
                boolean: false,
            },
            {
                id: 'surname',
                numeric: false,
                label: constants.USER_TABLE_HEAD_ROW_SURNAME,
                boolean: false,
            },
            {
                id: 'name',
                numeric: false,
                label: constants.USER_TABLE_HEAD_ROW_NAME,
                boolean: false,
            },
            {
                id: 'isActive',
                numeric: false,
                label: constants.USER_TABLE_HEAD_ROW_ACTIVE,
                boolean: true,
            },
            {
                id: 'isLocked',
                numeric: false,
                label: constants.USER_TABLE_HEAD_ROW_LOCKED,
                boolean: true,
            },
        ],
        selected: '',
        username: '',
        surname: '',
        name: '',
        actionDelete: false,
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

    handleConfirmDeleteUser = () =>{
        this.setState({ actionDelete: !this.state.actionDelete });
        this.props.onDelete(this.state.selected.id);
    }

    handleCancelDeleteUser = () =>{
        this.setState({ actionDelete: !this.state.actionDelete });
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    render(){
        const { classes, isLoading, error } = this.props;
        const { headCells, rows, selected, actionDelete } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {actionDelete && <ModalDialog message={constants.USER_CONFIRM_DELETE_MESSAGE} variant="confirm" onConfirm={this.handleConfirmDeleteUser} onClose={this.handleCancelDeleteUser}/>}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <div>
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
                                    valueType="digits"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <SearchField
                                    id="name"
                                    onChange={this.handleSearch}
                                    label={constants.USERS_SEARCH_NAME}
                                    placeholder={constants.USERS_SEARCH_NAME}
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
                            component={Link}
                            to={`administrator/users/add/`}
                        />
                        <Button
                            label={constants.BUTTON_EDIT}
                            icon=<Edit className={classes.icon}/>
                            iconAlign="right"
                            disabled={!selected}
                            variant="edit"
                            component={Link}
                            to={`administrator/users/edit/${selected.id}`}
                        />
                        <Button
                            label={constants.BUTTON_DELETE}
                            icon=<Delete className={classes.icon}/>
                            iconAlign="right"
                            disabled={!selected}
                            onClick = {this.handleCancelDeleteUser}
                            variant="delete"
                        />
                    </Grid>
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