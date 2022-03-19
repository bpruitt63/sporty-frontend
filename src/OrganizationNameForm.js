import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useHandleChange, useErrors} from './hooks';
import Errors from './Errors';
import SportyApi from './SportyApi';

function OrganizationNameForm({orgId=null, orgName='', setOrg, userProp, setUser, toggle}) {

    const [data, handleChange] = useHandleChange({orgName});
    const [checked, setChecked] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});

        /** Validates form and sets error */
        if (data.orgName.length < 2 || data.orgName.length > 100) {
            setErrors({error: "Name must be between 2 and 100 characters"});
            return false;
        };
        
        if (orgId) {
            /** If existing organization, updates organization name */
            try {
                const org = await SportyApi.updateOrganization(orgId, data);
                setOrg(org);
                toggle('editOrg');
            } catch (err) {
                getApiErrors(err);
            };
        } else {
            /** If new organization, creates organization, adds creator
             * to organization if not super admin and redirects
             * to organization's home page
             */
            try {
                const org = await SportyApi.addOrganization(data);

                if (checked || !userProp.superAdmin) {
                    const {user, token} = await SportyApi.addUserOrganization(
                                            org.orgId, userProp.email, {adminLevel: 1});
                    setUser(user);
                    localStorage.setItem("token", token);
                    SportyApi.setToken(token);
                };

                navigate(`/organization/${org.orgId}`);
            } catch (err) {
                getApiErrors(err);
            };
        };
    };

    const handleCheck = () => {
        setChecked(!checked);
    };

    return (
        <div>
            <Errors formErrors={errors}
                    apiErrors={apiErrors} />
            <form onSubmit={handleSubmit}>
                <label htmlFor='orgName'>
                    {orgId ? 'New Name' : 'Organization Name'}
                </label>
                <input type='text'
                        name='orgName'
                        id='orgName'
                        placeholder='Organization Name'
                        value={data.orgName}
                        onChange={handleChange} />
                {userProp && userProp.superAdmin &&
                    <label >
                        <input type='checkbox'
                            name='userOrg'
                            id='userOrg'
                            checked={checked}
                            onChange={handleCheck} />
                        This is my organization
                    </label>}
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};

export default OrganizationNameForm;