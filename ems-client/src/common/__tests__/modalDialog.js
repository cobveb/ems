import React from 'react';
import { createShallow, createMount  } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import ModalDialog from 'common/modalDialog';
import {DialogAction} from 'common/modalDialogAction';
import { DialogTitle, DialogContent, Typography, Button } from '@material-ui/core/';
import * as constants from 'constants/uiNames';

describe("ModalDialog component", () => {
    let shallow;
    let mount;
    beforeEach(() => {
        shallow = createShallow();
        mount = createMount();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    const confirm = jest.fn();
    const cancel = jest.fn();
    const props = {
        message: 'Dialog Test',
        variant: 'warning',
        onConfirm: confirm,
        onCancel: cancel
    };

    it("it should renders ModalDialog component ", () => {
        const wrapper = shallow(<ModalDialog {...props}/>)
        expect(wrapper).toMatchSnapshot();
    });

    it("it should contains Dialog component ", () => {
        const wrapper = mount(<ModalDialog {...props}/>)
        expect(wrapper.find(DialogTitle).exists()).toEqual(true)
        expect(wrapper.find(DialogTitle).text()).toEqual(constants.MODAL_DIALOG_WARNING)
        const msg = wrapper.find(DialogContent)
        expect(wrapper.find(DialogContent).exists()).toEqual(true)
        expect(msg.text()).toEqual("Dialog Test")
        expect(wrapper.find(Button)).toHaveLength(2)
    });

    it("it should call onClose ", () => {
        ModalDialog.prototype.handleClose = cancel;
        const wrapper = mount(<ModalDialog {...props}/>)
        const action = wrapper.find(DialogAction)
        action.find(Button).at(1).prop('onClick')()
        wrapper.instance().handleClose()
        expect(cancel).toHaveBeenCalledTimes(1);
    });

    it("it should call onConfirm ", () => {
        ModalDialog.prototype.handleConfirm = confirm;
        const wrapper = mount(<ModalDialog {...props}/>)
        const action = wrapper.find(DialogAction)
        action.find(Button).at(0).prop('onClick')()
        wrapper.instance().handleConfirm()
        expect(confirm).toHaveBeenCalledTimes(1);
    });
})