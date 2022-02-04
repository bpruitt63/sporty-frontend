import React, {useState} from 'react';
import Errors from './Errors';
import UserUpdateForm from './UserUpdateForm';
import {useHandleChange} from './hooks';

function EmailSearchForm({user}) {

    const [targetEmail, setTargetEmail] = useState();
    const initialState = {email: ''};
    const [data, handleChange, setData] = useHandleChange(initialState);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        /** Validates form and sets error */
        if (!data.email || !data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            setErrors({error: "Not a valid email address"})
            setData(initialState);
            return false;
        } else {
            setTargetEmail(data.email);
        };
    };

    return (
        <div>
            <Errors formErrors={errors} />
            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>Enter User's Email</label>
                <input type='text'
                        name='email'
                        id='email'
                        placeholder="User's Email"
                        value={data.email}
                        onChange={handleChange} />
                <button type='submit'>Get User</button>
            </form>
            {targetEmail && <UserUpdateForm user={user}
                            targetEmail={targetEmail} />}
        </div>
    )
};

export default EmailSearchForm;