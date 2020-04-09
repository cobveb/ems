import React from 'react';
import { Field, reduxForm  } from 'redux-form';
import { shallow } from "enzyme";
import renderer from 'react-test-renderer';
import InstitutionForm from 'components/modules/administrator/institutionForm';
import {validate} from 'components/modules/administrator/institutionForm';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as constants from 'constants/uiNames';
import { TextField }  from '@material-ui/core/';
import { reducer as formReducer } from 'redux-form';
import Spinner from 'common/spinner';
import { Button }  from '@material-ui/core/';

describe("InstitutionForm component", () => {

    let submitting, pristine, touched, error, required;
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const handleSubmit = jest.fn();
    const store = mockStore({
        form: formReducer,
    })


    beforeEach(() => {
        pristine=false;
        submitting = false;
        touched = false;
        error = null;
        required = false
    });

    const props = {
        submitting: submitting,
        onSubmit: handleSubmit,
        fields: {
            code:{
                value: '',
                touched: touched,
                error: error,
            },
            shortName:{
                value: '',
                touched: touched,
                error: error,
            },
            name:{
                value: '',
                touched: touched,
                error: error,
            },
            nip:{
                value: '',
                touched: touched,
                error: error,
            },
            regon:{
                value: '',
                touched: touched,
                error: error,
            },
            zipCode:{
                value: '',
                touched: touched,
                error: error,
            },
            phone:{
                value: '',
                touched: touched,
                error: error,
            },
            email:{
                value: 'test',
                touched: touched,
                error: error,
            }
        }
    }

    it("it should renders InstitutionForm component ", () => {
        const wrapper = shallow(<InstitutionForm onSubmit={handleSubmit}/>)
        expect(wrapper).toMatchSnapshot();
    });

    it("it should call handle submit on submit", ()=> {
        const handleSubmit = jest.fn();
        const wrapper = shallow(<InstitutionForm onSubmit={handleSubmit}/>)
        wrapper.simulate('submit')
        expect(handleSubmit).toBeCalled()
    });

   it("it should handle enable submit button", ()=> {
        const wrapper = shallow(<InstitutionForm pristine={true} submitting={false} invalid={false} submitSucceeded={false} />).dive()
        expect(wrapper.find(Button).props().disabled).toEqual(true)
        wrapper.setProps({ pristine: false })
        wrapper.update()

        expect(wrapper.find(Button).props().disabled).toEqual(false)
   });

   it("it should handle spinner on submitting", ()=> {
        const wrapper = shallow(<InstitutionForm pristine={true} submitting={false} />).dive()
        expect(wrapper.find(Spinner).exists()).toEqual(false)
        wrapper.setProps({ submitting: true })
        wrapper.update()
        expect(wrapper.find(Spinner).exists()).toEqual(true)
   });
})