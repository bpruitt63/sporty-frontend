import React, {useState} from 'react';
import {useHandleChange, useErrors} from './hooks';
import Errors from './Errors';
import SportyApi from './SportyApi';

function LoginForm({handleLogin}) {

    const initialState = {email: '', pwd: ''}

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, handleChange, setData] = useHandleChange(initialState);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});

        /** Validates login form and sets error if missing fields */
        if (!data.email || !data.pwd) {
            setErrors({error: "Email and Password are required"})
            setData(initialState);
            return false;
        } else {
            setIsLoading(true);

            /** Checks for valid email/password combination.
             * Returns API token and puts into local storage.
             */
            try {
                const token = await SportyApi.login(data);
                handleLogin(token);
                setIsLoading(false);
            } catch (e) {
                getApiErrors(e);
                setData(initialState);
                setIsLoading(false);
            };
        };
    };

    if (isLoading) {
        return <p>Loading</p>
    };

    return (
        <div>
            <Errors formErrors={errors}
                    apiErrors={apiErrors} />
            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>Email</label>
                <input type='text'
                        name='email'
                        id='loginEmail'
                        placeholder='Email'
                        value={data.email}
                        onChange={handleChange} />
                <label htmlFor='pwd'>Password</label>
                <input type='password'
                        name='pwd'
                        id='loginPwd'
                        placeholder='Password'
                        value={data.pwd}
                        onChange={handleChange} />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
};

export default LoginForm;