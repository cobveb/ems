import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Plan from 'components/modules/coordinator/plans/plan';
import DictionaryApi from 'api/common/dictionaryApi';
import {findSelectFieldPosition} from 'utils';

const responseFin = {
    data: {
        data: [
            {
                "id": 1,
                "planId": 1,
                "name": "Certyfikaty kwalifikowane",
                "quantity": 1,
                "unit": {
                    "code": "szt",
                    "id": 1,
                    "isActive": true,
                    "name": "sztuka",
                },
                "status": "ZA",
                "unitPrice": 19512.20,
                "amountRequestedNet": 19512.20,
                "vat": 1.23,
                "amountRequestedGross": 24000.01,
                "amountAwardedNet": null,
                "amountAwardedGross": null,
                "costType": {
                    "active": true,
                    "id": 101,
                    "name": "Dzierżawa pojemników na odpady",
                    "number": "402-1-17-003",
                },
                "description": "Dodatkowe nowe i przedłużenie",
            },
            {
                "id": 2,
                "planId": 1,
                "name": "Serwis AMMS",
                "quantity": 12,
                "unit": "mc",
                "status": "ZA",
                "unitPrice": 70000.00,
                "amountRequestedNet": 350000.00,
                "vat": 1.23,
                "amountRequestedGross": 430500.00,
                "amountAwardedNet": null,
                "amountAwardedGross": null,
                "costType": "402-01-18-001",
                "description": "nowa umowa od 27.07.2021",
            },
        ],
    },
};

const responseInv = {
    data: {
        data: [
            {
                "id": 3,
                "planId": 2,
                "name": "Modernizacja sieci komputerowej",
                "task": "Modernizacja sieci komputerowej(eCareMed)",
                "status": "ZA",
                "foundingSources": [
                    {
                        "foundingSource": "ue",
                        "amountRequestedNet": 23985.00,
                        "amountRequestedGross": 29501.55,
                        "vat": 1.23,
                        "expensesPlanNet": 0.00,
                        "expensesPlanGross": 0.00,
                    },
                    {
                        "foundingSource": "wlasne",
                        "amountRequestedNet": 1364199.28,
                        "amountRequestedGross": 1677965.11,
                        "vat": 1.23,
                        "expensesPlanNet": 0.00,
                        "expensesPlanGross": 0.00,
                    },
                    {
                        "foundingSource": "inne",
                        "amountRequestedNet": 1364114.28,
                        "amountRequestedGross": 1677860.56,
                        "vat": 1.23,
                        "expensesPlanNet": 0.00,
                        "expensesPlanGross": 0.00,
                    },
                ],
                "category": "cat2",
                "application": null,
                "substantiation": null,
            },
            {
                "id": 4,
                "planId": 2,
                "name": "Modernizacja serwerowni",
                "task": "Modernizacja serwerowni(eCareMed)",
                "status": "ZA",
                "foundingSources": [
                    {
                        "foundingSource": "wlasne",
                        "amountRequestedNet": 902736.36,
                        "amountRequestedGross": 430500.00,
                        "vat": 1.23,
                        "expensesPlanNet": 500000.00,
                        "expensesPlanGross": 500000.00,
                    },
                ],
                "category": "cat1",
                "application": null,
                "substantiation": null,
            },
        ],
    },
};


class PlanContainer extends Component {
    state = {
        positions: [],
        units: [],
        vats: [
            {
                code: 1.08,
                name: "8%",
            },
            {
                code: 1.23,
                name: "23%",
            },
        ]
    }

    handleGetDictionaryUnits(){
       return DictionaryApi.getDictionary('jedMiar')
        .then(response => {
            this.setState({
                units: response.data.data.items,
            })
        })
        .catch(error => {});
    };

    handlePlanPositions = () => {
        if (this.props.initialValues.type.code === 'FIN'){
            this.setState( prevState => {
                let positions = [...prevState.positions];
                positions = responseFin.data.data;
                console.log(positions)
                positions.map(position => (
                    Object.assign(position,
                        {
                            vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                        }
                    )
                ))
                return {positions};
            });
            this.handleGetDictionaryUnits();

        } else if(this.props.initialValues.type.code === 'INW'){
            this.setState( prevState => {
                let positions = [...prevState.positions];
                positions = responseInv.data.data;
                positions.map(position => ((
                    Object.assign(position,
                    {
                        category: position.category = findSelectFieldPosition(this.props.categories, position.category),
                    }),
                    position.foundingSources.map(source => (
                        Object.assign(source,{
                            vat: source.vat = findSelectFieldPosition(this.state.vats, source.vat),
                            foundingSource: source.foundingSource = findSelectFieldPosition(this.props.foundingSources, source.foundingSource),
                        })
                    ))
                )));
                return {positions};
            });
        };
    };

    //TODO: Tutaj zapytania do API PLAN
    render(){
        const {initialValues, changeVisibleDetails, action, changeAction, handleClose, error, clearError, isLoading, loading, ...others} = this.props;
        const {positions, units, vats} = this.state;
        return(
            <Plan
                initialValues={initialValues}
                changeVisibleDetails={changeVisibleDetails}
                action={action}
                error={error}
                isLoading={isLoading}
                onClose={handleClose}
                onTabPositions={this.handlePlanPositions}
                positions={positions}
                units={units}
                vats={vats}
                {...others}
            />
        );
    };
};

PlanContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    changeAction: PropTypes.func,
    handleClose: PropTypes.func,
    error: PropTypes.string,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
}

export default PlanContainer;
