import React, {useState} from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
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
            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>Email</label>
                <input type='text'
                        name='email'
                        id='email'
                        placeholder='Email'
                        value={data.email}
                        onChange={handleChange} />
                <label htmlFor='pwd'>Password</label>
                <input type='password'
                        name='pwd'
                        id='pwd'
                        placeholder='Password'
                        value={data.pwd}
                        onChange={handleChange} />
                <label htmlFor='pwd2'>Retype Password</label>
                <input type='password'
                        name='pwd2'
                        id='pwd2'
                        placeholder='Retype Password'
                        value={data.pwd2}
                        onChange={handleChange} />
                <label htmlFor='firstName'>First Name</label>
                <input type='text'
                        name='firstName'
                        id='firstName'
                        placeholder='First Name'
                        value={data.firstName}
                        onChange={handleChange} />
                <label htmlFor='lastName'>Last Name</label>
                <input type='text'
                        name='lastName'
                        id='lastName'
                        placeholder='Last Name'
                        value={data.lastName}
                        onChange={handleChange} />
                {user && user.superAdmin && 
                    <label >
                        <input type='checkbox'
                            name='superAdmin'
                            id='superAdmin'
                            checked={data.superAdmin}
                            onChange={handleCheck} />
                        Super Admin
                    </label>}
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};

export default RegisterForm;