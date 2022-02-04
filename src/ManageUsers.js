import React, {useState} from 'react';
import SportyApi from './SportyApi';
import {useHandleChange, useErrors} from './hooks';
import Errors from './Errors';
import UserPermissions from './UserPermissions';

function ManageUsers({orgId, orgName}) {

    const [foundUser, setFoundUser] = useState();
    const [orgUsers, setOrgUsers] = useState();
    const initialState = {email: ''};
    const [data, handleChange, setData] = useHandleChange(initialState);
    const [errors, setErrors] = useState({});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();

    const getAll = async () => {
        setErrors({});
        setApiErrors({});

        try {
            const users = await SportyApi.getAllUsers(orgId);
            setOrgUsers(users);
        } catch (err) {
            getApiErrors(err);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});

        /** Validates form and sets error */
        if (!data.email || !data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            setErrors({error: "Not a valid email address"})
            setData(initialState);
            return false;
        } else {
            try {
                const user = await SportyApi.getUser(data.email);
                setFoundUser(user);
            } catch (err) {
                getApiErrors(err);
            };
        };
    };

    return (
        <div>
            <Errors formErrors={errors}
                    apiErrors={apiErrors} />
            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>Find User By Email</label>
                <input type='text'
                        name='email'
                        id='email'
                        placeholder="User's Email"
                        value={data.email}
                        onChange={handleChange} />
                <button type='submit'>Get User</button>
            </form>
            {foundUser && 
                <UserPermissions targetUser={foundUser} orgId={orgId}/>}
            {!orgUsers && 
                <button onClick={getAll}>View all {orgName}'s users</button>}
            {orgUsers && orgUsers.map(u =>
                <UserPermissions key={u.email} 
                                targetUser={u}
                                orgId={orgId} />)}
        </div>
    );
};

export default ManageUsers;