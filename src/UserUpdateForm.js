import React, {useState, useEffect} from 'react';
import {useHandleChange, useValidate, useErrors} from './hooks';
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
                if (targetEmail === user.email) {
                    setUser({...user, ...updated});
                };
                setIsLoading(false);
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
        return <p>Loading</p>
    };

    return(
        <div>
            <Errors formErrors={formErrors}
                    apiErrors={apiErrors} />
            <form onSubmit={handleSubmit}>
                <label htmlFor='pwd'>Password</label>
                <input type='password'
                        name='pwd'
                        id='pwd'
                        placeholder='Password'
                        value={data.pwd || ''}
                        onChange={handleChange} />
                <label htmlFor='pwd2'>Retype Password</label>
                <input type='password'
                        name='pwd2'
                        id='pwd2'
                        placeholder='Retype Password'
                        value={data.pwd2 || ''}
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
                {user && user.superAdmin && user.email !== targetEmail &&
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

export default UserUpdateForm;