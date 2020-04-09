import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import Institution from 'components/modules/administrator/institution';
import InstitutionForm from 'components/modules/administrator/institutionForm';
import { Typography } from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';
import InstitutionFormContainer from 'containers/modules/administrator/institutionFormContainer';
import { reduxForm } from 'redux-form';


describe("Institution component", () => {
    let shallow;
    let mount;

    beforeEach(() => {
        mount = createMount();
        shallow = createShallow();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const handleSubmit = jest.fn();
    const store = mockStore({})
    const initData = {
        code: test,
    }

    it("it should renders Institution component ", () => {
        const wrapper = shallow(<Institution onSubmit={handleSubmit}/>)
        expect(wrapper).toMatchSnapshot();
    });

    it("it should contains institution menu name ", () => {
        const wrapper = mount(
            <Provider store={store}>
                <Institution onSubmit={handleSubmit}/>
            </Provider>
        )
        expect(wrapper.find(Typography).first().text()).toEqual(constants.SUBMENU_INSTITUTION_DETAIL);
    });

    it("it should call handle submit", () => {
        const submit = jest.fn();

        const wrapper = shallow(<Institution submitSucceeded={submit} initialValues={initData} isLoading={false} />).dive()
        const form = wrapper.find(InstitutionFormContainer)
        form.simulate('submit')
        expect(submit).toBeCalled()
    });

    it("it should handle spinner on api call", ()=> {
        const wrapper = shallow(<Institution initialValues={initData} isLoading={false}/>).dive()
        expect(wrapper.find(Spinner).exists()).toEqual(false)
        wrapper.setProps({ isLoading: true })
        wrapper.update()
        expect(wrapper.find(Spinner).exists()).toEqual(true)
    });

    it("it should handle institution form with init values", ()=> {
        const wrapper = shallow(<Institution initialValues={initData} isLoading={false}/>).dive()
        expect(wrapper.find(InstitutionFormContainer).exists()).toEqual(true)
        expect(wrapper.find(InstitutionFormContainer).props().initialValues).toEqual(initData)
    });

    it("it should contains error dialog on error", ()=> {
            const wrapper = shallow(<Institution initialValues={initData} isLoading={false} error={"Test error"}/>).dive()
            expect(wrapper.find(ModalDialog).exists()).toEqual(true)
            expect(wrapper.find(ModalDialog).props().message).toEqual("Test error")
        });

})
