import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import {Spinner, ModalDialog} from 'common/';
import { SearchField, Button, Table, SelectField } from 'common/gui';
import { Edit } from '@material-ui/icons/';
import ParameterFormContainer from 'containers/modules/administrator/parameterFormContainer';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    icon: {
        marginLeft: theme.spacing(1),
    },
    tableWrapper: {
            minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})

class Parameters extends Component {
    state = {
        headCells: [
            {
                id: 'category',
                label: constants.PARAMETERS_TABLE_HEAD_ROW_CATEGORY,
                type: 'text',
            },
            {
                id: 'section',
                label: constants.PARAMETERS_TABLE_HEAD_ROW_SECTION,
                type: 'text',
            },
            {
                id: 'code',
                label: constants.PARAMETERS_TABLE_HEAD_ROW_CODE,
                type: 'text',
            },
            {
                id: 'name',
                label: constants.PARAMETERS_TABLE_HEAD_ROW_NAME,
                type: 'text'
            },
            {
                id: 'value',
                label: constants.PARAMETERS_TABLE_HEAD_ROW_VALUE,
                type: 'text',
            },

        ],
        selected: {},
        sectionSearch: '',
        codeSearch: '',
        filteredData: [],
        openDetails: false
    }

    filter = (event) => {
        let parameters = this.props.initialValues[0].parameters;
        return parameters.filter((item) => {
            return (
                    item.name.toLowerCase().search(
                        this.state.codeSearch.toLowerCase()) !== -1 ||
                    item.code.toLowerCase().search(
                        this.state.codeSearch.toLowerCase()) !== -1
                ) &&
            item.category.toLowerCase().search(
                this.props.initialValues[0].categorySearch.toLowerCase()) !== -1 &&
            item.section.toLowerCase().search(
                this.state.sectionSearch.toLowerCase()) !== -1
        });

    }

    handleChangeSearch = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            selected:{},
        })

        if(event.target.name === "categorySearch"){
            this.props.changeCategory(event.target.value);
            this.setState({sectionSearch: ''});
        }
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    handleOpenDetails = () =>{
        this.setState({openDetails: true})
    }

    handleCloseDetails = () =>{
        this.setState({openDetails: false})
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            if(this.props.initialValues[0].categorySearch !== prevProps.initialValues[0].categorySearch){
                this.setState({
                    filteredData : this.filter(),
                })
            } else {
                this.setState({
                    filteredData : this.filter(),
                });
            }
        } else if ( this.state.sectionSearch !== prevState.sectionSearch ||
            this.state.codeSearch !== prevState.codeSearch ) {
                this.setState({
                    filteredData : this.filter(),
                })
        } else if (this.props.initialValues[0].parameters !== prevProps.initialValues[0].parameters) {
            this.setState({
                filteredData : this.filter(),
            })
        }
    }

    componentDidMount(){
        this.setState({
            filteredData: this.filter(),
        })
    }

    handleSubmit = (data) => {
        return this.props.onSubmit(data, this.handleCloseDetails)
    }

    render(){
        const { classes, isLoading, error, initialValues } = this.props;
        const { filteredData, selected, headCells, sectionSearch, openDetails } = this.state;

        return(
            <>
                <ParameterFormContainer
                    initialValues={Object.keys(selected).length !== 0 ? selected : {}}
                    open={openDetails}
                    onClose={this.handleCloseDetails}
                    onSubmit={this.handleSubmit}
                />
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <div className={classes.root}>
                    <Grid
                        container
                        direction="column"
                        spacing={0}
                    >
                        <Typography variant="h6">{constants.SUBMENU_CONFIGURATIONS_PARAMETERS}</Typography>
                        <Divider />
                        <Grid container spacing={1} direction="row">
                            <Grid item xs={4}>
                                <SelectField
                                    name="categorySearch"
                                    onChange={this.handleChangeSearch}
                                    label={constants.PARAMETERS_SEARCH_CATEGORY}
                                    options={initialValues[0].categories}
                                    value={initialValues[0].categorySearch}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <SelectField
                                    name="sectionSearch"
                                    onChange={this.handleChangeSearch}
                                    label={constants.PARAMETERS_SEARCH_SECTION}
                                    options={initialValues[0].sections}
                                    value={sectionSearch}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <SearchField
                                    name="codeSearch"
                                    onChange={this.handleChangeSearch}
                                    label={constants.PARAMETERS_SEARCH_CODE}
                                    placeholder={constants.PARAMETERS_SEARCH_CODE}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Table
                                rows={filteredData}
                                headCells={headCells}
                                onSelect={this.handleSelect}
                                className={classes.tableWrapper}
                                defaultOrderBy="category"
                            />
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-end"
                        >
                            <Button
                                label={constants.BUTTON_EDIT}
                                icon=<Edit className={classes.icon}/>
                                iconAlign="right"
                                variant="edit"
                                disabled={(Object.keys(selected).length === 0)}
                                onClick={this.handleOpenDetails}
                            />
                        </Grid>
                    </Grid>
                </div>
            </>
        )
    }
}

Parameters.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

export default withStyles(styles)(Parameters);