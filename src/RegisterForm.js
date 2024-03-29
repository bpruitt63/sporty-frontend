import React, {useState} from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import {Col, Form, Button, Spinner} from 'react-bootstrap';
import {useHandleChange, useValidate, useErrors, useToast} from './hooks';
import SportyApi from './SportyApi';
import Errors from './Errors';

function RegisterForm({user, handleLogin}) {

    const [isLoading, setIsLoading] = useState(false);
    const initialState = {email: '', pwd: '', pwd2: '',
                            firstName: '', lastName: '', superAdmin: false};
    const [data, handleChange, setData] = useHandleChange(initialState);
    const [formErrors, validate] = useValidate();
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const [message, toast] = useToast();
    const navigate = useNavigate();

    /** Redirects to home if already logged in and not super admin */
    if (user && !user.superAdmin) {
        return <Navigate to='/' />
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiErrors({});

        /** Checks form for errors.
         * If errors, stops form submission and sets errors object
         */
        const isSignUpForm = true;
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

            /** Submit new user to database.
             * Get API token.
             * Logs in new user by putting username/token into state and local storage
             * Redirects to home if not admin
             */
            try {
                if (user && user.superAdmin) {
                    const newUser = await SportyApi.create(data);
                    setIsLoading(false);
                    setData(initialState);
                    toast(`Created user ${newUser.email}`, 3500);
                } else {
                    const token = await SportyApi.register(data);
                    handleLogin(token);
                    navigate('/');
                };
            } catch (err) {
                setData({...data, pwd: '', pwd2: ''});
                getApiErrors(err);
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
                    <Form.Control type='text'
                                name='email'
                                placeholder='Email'
                                value={data.email}
                                onChange={handleChange} />
                    <Form.Control type='password'
                                name='pwd'
                                placeholder='Password'
                                value={data.pwd}
                                onChange={handleChange} />
                    <Form.Control type='password'
                                name='pwd2'
                                placeholder='Retype Password'
                                value={data.pwd2}
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
                    {user && user.superAdmin && 
                        <Form.Check type='checkbox'
                                    name='superAdmin'
                                    id='superAdmin'
                                    checked={data.superAdmin}
                                    onChange={handleCheck}
                                    label='Super Admin' />}
                    <Button type='submit'
                            variant='dark'
                            className='longFormSubmit'>
                        Submit
                    </Button>
                </Form>
            </Col>
        </div>
    );
};

export default RegisterForm;