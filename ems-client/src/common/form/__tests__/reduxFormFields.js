import {renderTextField} from 'common/form';
import * as constants from 'constants/uiNames';
import FormHelperText from '@material-ui/core/FormHelperText';
import { shallow } from 'enzyme'

describe('renderTextInput component', () => {
    it("should render a error message for input text field", () =>{
        const input = { name: 'test', value: '' };
        const label = 'Test';
        const meta = { touched: true, error: constants.FORM_ERROR_MSG_INVALID_EMAIL_ADDRESS }
        const wrapper = shallow(renderTextField({ input, label, meta }))
        expect(wrapper.find(FormHelperText).exists()).toEqual(true)
        expect(wrapper.find(FormHelperText).children().text()).toEqual(constants.FORM_ERROR_MSG_INVALID_EMAIL_ADDRESS)
    })
})
