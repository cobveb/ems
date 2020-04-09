import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import LoginForm from 'components/login/loginForm';
import Notification from 'common/notification';
import { TextField, IconButton, CircularProgress } from '@material-ui/core/';
import{ MemoryRouter, Redirect } from "react-router-dom";
import renderer from 'react-test-renderer';

describe('LoginForm', () => {
    let shallow;
    let mount;

    beforeEach(() => {
        shallow = createShallow();
        mount = createMount();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    const promise = Promise.resolve();
    const onToggleLoading = jest.fn();
    const onAuth = jest.fn(()=> promise);
    const loadUserDetail = jest.fn(()=> promise);
    const loadModules = jest.fn(()=> promise);
    const props = {
        isLoading: false,
        onToggleLoading: onToggleLoading,
        onAuth: onAuth,
        loadUserDetail: loadUserDetail,
        loadModules: loadModules,
    }

	it('render correctly LoginForm', () => {
		const wrapper = renderer.create(<MemoryRouter><LoginForm {...props}/></MemoryRouter>).toJSON();
		expect(wrapper).toMatchSnapshot();
	})
	
	it('it should change username value', () =>{

		const wrapper = mount(<MemoryRouter><LoginForm {...props} /></MemoryRouter>);
		const username = wrapper.find("input[type='text']");

		expect(wrapper.find("input[type='text']").props().value).toBe('')
		
		username.simulate('change', { target: { value: 'user' }})

        expect(wrapper.find("input[type='text']").props().value).toBe('user')
        wrapper.unmount();
	})

	it('it should change password value', () =>{

		const wrapper = mount(<MemoryRouter><LoginForm {...props} /></MemoryRouter>);
        const pass = wrapper.find("input[type='password']");

		expect(pass.props().value).toBe('')
		
		pass.simulate('change', { target: { value: 'test' }})

        expect(wrapper.find("input[type='password']").render().val()).toBe('test')
        wrapper.unmount();
	})

	it('It should change visiblity password', () =>{

		const wrapper = mount(<MemoryRouter><LoginForm {...props} /></MemoryRouter>);
		const passwd = wrapper.find("input[type='password']");
		const visiblityButton = wrapper.find(IconButton)
		
		expect(visiblityButton).not.toBeNull()
		expect(wrapper.find("input[type='password']").length).toBe(1)
		expect(passwd.props().type).toEqual('password')

		visiblityButton.simulate('click')

		expect(wrapper.find("input[type='password']").length).toBe(0)
		wrapper.unmount();
	})

	it('it should enable submit button when username and password have a value', () =>{

		const wrapper = mount(<MemoryRouter><LoginForm {...props} /></MemoryRouter>);
		const submitButton = wrapper.find("button[type='submit']")
		const username = wrapper.find("input[type='text']")
		const passwd = wrapper.find("input[type='password']")

		expect(submitButton.props().disabled).toBeTruthy()

		username.simulate('change', { target: { value: 'user' }})
		passwd.simulate('change', { target: { value: 'test' }})

		expect(wrapper.find("button[type='submit']").props().disabled).toBeFalsy()
		wrapper.unmount();
	})

	it('it should show CircularProgress on submit',() =>{
	    const wrapper = mount(<MemoryRouter><LoginForm {...props} isLoading = {true} /></MemoryRouter>);
	    const form = wrapper.find('form').first();

	    form.simulate('submit')

	    expect(wrapper.find(CircularProgress).length).toBe(1)
	    wrapper.unmount();
	})

	it('it should send credentials on submit and get user detail', () =>{
        const params = {
            username: 'user',
            password: 'user'
        };

		const wrapper = mount(<MemoryRouter><LoginForm {...props} /></MemoryRouter>);

        const form = wrapper.find('form').first();
        const username = wrapper.find("input[type='text']")
        const passwd = wrapper.find("input[type='password']")

        username.simulate('change', { target: { value: 'user' }})
        passwd.simulate('change', { target: { value: 'user' }})

        form.simulate('submit')

        expect(onAuth).toBeCalled()
        expect(onAuth).toBeCalledWith(params)
        expect(loadUserDetail).toBeCalled()
        wrapper.unmount();
    })

	it('it should catch error on submit', () =>{
        const promise = Promise.resolve();
        const reject = Promise.reject("Error");
        const onToggleLoading = jest.fn();
        const onAuth = jest.fn(()=> reject);
        const loadUserDetail = jest.fn(()=> promise);
        const loadModules = jest.fn(()=> promise);
        const props1 = {
            isLoading: false,
            onToggleLoading: onToggleLoading,
            onAuth: onAuth,
            loadUserDetail: loadUserDetail,
            loadModules: loadModules,
        }

    	let wrapper = mount(<MemoryRouter><LoginForm  {...props1} /></MemoryRouter>);
        const form = wrapper.find('form').first();

        form.simulate('submit')
        wrapper.update()

        expect(onAuth).toBeCalled()
        expect(onToggleLoading).toBeCalled()
        expect(loadUserDetail).not.toBeCalled()
        expect(loadModules).not.toBeCalled()
    })
})