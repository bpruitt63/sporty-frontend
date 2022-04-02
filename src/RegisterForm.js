import React, {useState} from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import {Col, Form, Button} from 'react-bootstrap';
import {useHandleChange, useValidate, useErrors} from './hooks';
import SportyApi from './SportyApi';
import Errors from './Errors';

function RegisterForm({user, handleLogin}) {

    const [isLoading, setIsLoading] = useState(false);
    const initialState = {email: '', pwd: '', pwd2: '',
                            firstName: '', lastName: '', superAdmin: false};
    const [data, handleChange, setData] = useHandleChange(initialState);
    const [formErrors, validate] = useValidate();
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
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
                    console.log(`Created user ${newUser.email}`)
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
        return <p>Loading</p>
    };

    return(
        <div>
            <Errors formErrors={formErrors}
                    apiErrors={apiErrors} />
            <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 4}}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='email'>
                        <Form.Label className='label'>Email</Form.Label>
                        <Form.Control type='text'
                                    name='email'
                                    placeholder='Email'
                                    value={data.email}
                                    onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId='pwd'>
                        <Form.Label className='label'>Password</Form.Label>
                        <Form.Control type='password'
                                    name='pwd'
                                    placeholder='Password'
                                    value={data.pwd}
                                    onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId='pwd2'>
                        <Form.Label className='label'>Retype Password</Form.Label>
                        <Form.Control type='password'
                                    name='pwd2'
                                    placeholder='Retype Password'
                                    value={data.pwd2}
                                    onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId='firstName'>
                        <Form.Label className='label'>First Name</Form.Label>
                        <Form.Control type='text'
                                    name='firstName'
                                    placeholder='First Name'
                                    value={data.firstName}
                                    onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId='lastName'>
                        <Form.Label className='label'>Last Name</Form.Label>
                        <Form.Control type='text'
                                    name='lastName'
                                    placeholder='Last Name'
                                    value={data.lastName}
                                    onChange={handleChange} />
                    </Form.Group>
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