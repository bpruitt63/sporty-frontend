import React, {useState, useEffect} from 'react';
import {Form, Button, Col, Spinner} from 'react-bootstrap';
import {useHandleChange, useValidate, useErrors, useToast} from './hooks';
import {useNavigate} from 'react-router-dom';
import SportyApi from './SportyApi';
import Errors from './Errors';

function UserUpdateForm({user, targetEmail='', setUser=null}) {

    const [isLoading, setIsLoading] = useState(false);
    const initialState = {pwd: '', pwd2: '', firstName: '',
                            lastName: '', superAdmin: false};
    const [data, handleChange, setData] = useHandleChange(initialState);
    const [formErrors, validate] = useValidate();
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const [message, toast] = useToast();
    const navigate = useNavigate();

    if (user && !targetEmail) targetEmail = user.email;

    useEffect(() => {
        async function getUserInfo() {

            /** Redirect to home page if not logged in */
            if (!user) {
                navigate('/');
            };

            /** Gets info about logged in user or target user
             * and sets initial form data */
            try {
                const userInfo = targetEmail === user.email ? user 
                                : await SportyApi.getUser(targetEmail);
                setData({firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        superAdmin: userInfo.superAdmin});
            } catch (e) {
                getApiErrors(e);
            };
        };
        getUserInfo(targetEmail);
        setIsLoading(false);
    }, [targetEmail, setData, setIsLoading, getApiErrors, navigate, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiErrors({})

        /** Checks form for errors.
         * If errors, stops form submission and sets errors object
         */
        const isSignUpForm = false;
        const err = validate(data, isSignUpForm);
        if (Object.keys(err).length > 0) {
            setData({...data, pwd: '', pwd2: ''});
            return false;
        } else {
            setIsLoading(true);

            /** Removes second password from data object */
            const dataObj = data;
            delete dataObj.pwd2;
            setData(dataObj);

            /** Submits data to update user info */
            try {
                const updated = await SportyApi.updateUser(targetEmail, data);
                
                /** Updates user and token if user is updating self */
                if (targetEmail === user.email) {
                    setUser({...user, ...updated.user});
                    localStorage.setItem("token", updated.token);
                    SportyApi.setToken(updated.token);
                };
                setIsLoading(false);
                toast('User successfully updated');
            } catch (e) {
                setData({...data, pwd: '', pwd2: ''});
                getApiErrors(e);
                setIsLoading(false);
            };
        };
    };

    const handleCheck = () => {
        setData({
            ...data,
            superAdmin: !data.superAdmin
        });
    };

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    };

    return(
        <div>
            <Errors formErrors={formErrors}
                    apiErrors={apiErrors} />
            {message && <p className='toastMsg'>{message}</p>}
            <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 4}}>
                <Form onSubmit={handleSubmit} className='userForm'>
                    <Form.Control type='password'
                                name='pwd'
                                placeholder='Password'
                                value={data.pwd || ''}
                                onChange={handleChange} />
                    <Form.Control type='password'
                                name='pwd2'
                                placeholder='Retype Password'
                                value={data.pwd2 || ''}
                                onChange={handleChange} />
                    <Form.Control type='text'
                                name='firstName'
                                placeholder='First Name'
                                value={data.firstName}
                                onChange={handleChange} />
                    <Form.Control type='text'
                                name='lastName'
                                placeholder='Last Name'
                                value={data.lastName}
                                onChange={handleChange} />
                    {user && user.superAdmin && user.email !== targetEmail &&
                        <Form.Check type='checkbox'
                                    name='superAdmin'
                                    id='superAdmin'
                                    checked={data.superAdmin}
                                    onChange={handleCheck} 
                                    label='Super Admin'/>}
                    <Button type='submit'
                            variant='dark'
                            className='longFormSubmit'>Submit</Button>
                </Form>
            </Col>
        </div>
    );
};

export default UserUpdateForm;