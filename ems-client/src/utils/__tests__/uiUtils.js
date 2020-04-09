import React from 'react';
import {TextMask} from 'utils/uiUtils';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import MaskedInput from 'react-text-mask';
import * as constants from 'constants/uiNames'

describe('uiUtils', () =>{
    let shallow;
    let mount;

    beforeEach(() => {
        shallow = createShallow();
        mount = createMount();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    it('it should set mask in inputComponent', () => {
        const phoneMask = ['+', '4','8',' ','(', /[1-9]/, /\d/,')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

        const wrapper = mount(<TextField
                            name="phone"
                            label={constants.INSTITUTION_CONTACTS_PHONE}
                            placeholder={constants.INSTITUTION_CONTACTS_PHONE}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            value=""
                            InputProps={{
                                inputComponent: TextMask(phoneMask),
                            }}
                      />)
        const maskedInput = wrapper.find(MaskedInput);
        maskedInput.simulate('change', { target: { value: '323333333' }})
        expect(wrapper.find(MaskedInput).exists()).toBe(true)
        expect(wrapper.find(MaskedInput).props().mask).toBe(phoneMask)
    })
})