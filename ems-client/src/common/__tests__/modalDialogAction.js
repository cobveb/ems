import React from 'react';
import { createShallow, createMount  } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import {DialogAction, InfoAction } from 'common/modalDialogAction';
import { Button } from '@material-ui/core/';
import * as constants from 'constants/uiNames';

describe("ModuleDialogAction DialogAction component", () => {
    let shallow;
    let mount;

    beforeEach(() => {
        shallow = createShallow();
        mount = createMount();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const props = {
        type: 'warning',
        onConfirm: onConfirm,
        onCancel: onCancel
    };

    it("it should renders ModalDialog component ", () => {
        const wrapper = shallow(<DialogAction {...props}/>)
        expect(wrapper).toMatchSnapshot();
    });

    it("it should contain two button ", () => {
        const wrapper = mount(<DialogAction {...props}/>)
        expect(wrapper.find(Button)).toHaveLength(2)
    });

    it("it should call onConfirm ", () => {
        const wrapper = mount(<DialogAction {...props}/>)
        const button = wrapper.find(Button).at(0)
        button.simulate('click')
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("it should call onCancel ", () => {
        const wrapper = mount(<DialogAction {...props}/>)
        const button = wrapper.find(Button).at(1)
        button.simulate('click')
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
})

describe("ModuleDialogAction InfoAction component", () => {
    let shallow;
    let mount;

    beforeEach(() => {
        shallow = createShallow();
        mount = createMount();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    const onClose = jest.fn();
    const props = {
        type: 'info',
        onClose: onClose
    };

    it("it should renders ModalInfo component ", () => {
        const wrapper = shallow(<InfoAction {...props}/>)
        expect(wrapper).toMatchSnapshot();
    });

    it("it should contain OK button ", () => {
        const wrapper = mount(<InfoAction {...props}/>)
        expect(wrapper.find(Button)).toHaveLength(1)
        expect(wrapper.find(Button).text()).toEqual(constants.BUTTON_OK)
    });

    it("it should contain Close button ", () => {
        const wrapper = mount(<InfoAction type={'error'} onClose={onClose}/>)
        expect(wrapper.find(Button)).toHaveLength(1)
        expect(wrapper.find(Button).text()).toEqual(constants.BUTTON_CLOSE)
    });

    it("it should call onClose ", () => {
        const wrapper = mount(<InfoAction {...props}/>)
        const button = wrapper.find(Button)
        button.simulate('click')
        expect(onClose).toHaveBeenCalledTimes(1);
    });
})