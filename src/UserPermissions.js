import React, {useState} from 'react';
import SportyApi from './SportyApi';
import {useErrors} from './hooks';
import Errors from './Errors';

function UserPermissions({targetUser, orgId}) {

    const [isLoading, setIsLoading] = useState(false);
    const initialState = targetUser.organizations[orgId] ? 
                    targetUser.organizations[orgId].adminLevel : 3;
    const [val, setVal] = useState(initialState);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const [message, setMessage] = useState();


    const toast = (msg) => {
        setMessage(msg);
        setTimeout(() => {setMessage('')}, 2500);
    };

    const handleRadio = (val) => {
        setVal(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiErrors({});
        setIsLoading(true);

        if (val === 4){
            try{
                await SportyApi.removeUserOrganization(orgId, targetUser.email);
                toast('User successfully removed from organization');
            } catch (err) {
                getApiErrors(err);
            };
        } else {
            if (orgId in targetUser.organizations){
                try{
                    await SportyApi.updateLocalAdmin(orgId, 
                                targetUser.email, {adminLevel: val});
                    toast('Permissions updated');
                } catch (err) {
                    getApiErrors(err);
                };
            } else {
                try {
                    await SportyApi.addUserOrganization(orgId, 
                                targetUser.email, {adminLevel: val});
                    toast('User successfully added to organization');
                } catch (err) {
                    getApiErrors(err);
                };
            };
        };
        setIsLoading(false);
    };

    if (isLoading) {
        return <p>Loading</p>
    };

    return (
        <div>
            <p>{targetUser.firstName} {targetUser.lastName}</p>
            <Errors apiErrors={apiErrors}/>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    <input type='radio' 
                            name='adminLevel'
                            checked={val === 1}
                            onChange={() => handleRadio(1)} />
                    Organization Admin
                </label>
                <label>
                    <input type='radio' 
                            name='adminLevel'
                            checked={val === 2}
                            onChange={() => handleRadio(2)} />
                    Organization Editor
                </label>
                <label>
                    <input type='radio' 
                            name='adminLevel'
                            checked={val === 3}
                            onChange={() => handleRadio(3)} />
                    No Permissions
                </label>
                <label>
                    <input type='radio' 
                            name='adminLevel'
                            checked={val === 4}
                            onChange={() => handleRadio(4)} />
                    Remove User From Organization
                </label>
                <button type='submit'>Confirm</button>
            </form>
        </div>
    )
};

export default UserPermissions;