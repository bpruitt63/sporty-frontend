import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Errors from './Errors';
import {useHandleChange, useErrors} from './hooks';
import SportyApi from './SportyApi';

function OrganizationSearch() {

    const [isLoading, setIsLoading] = useState(false);
    const [organizations, setOrganizations] = useState();
    const initialState = {orgName: ''};
    const [data, handleChange] = useHandleChange(initialState);
    const [errors, setErrors] = useState({});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});

        /** Validates form and sets error */
        if (data.orgName.length < 2 || data.orgName.length > 100) {
            setErrors({error: "Search term must be between 2 and 100 characters"});
            return false;
        } else {
            setIsLoading(true);

            /** Searches organizations and sets state with result */
            try {
                const orgs = await SportyApi.searchOrganizations(data.orgName);
                setOrganizations(orgs);
                setIsLoading(false);
            } catch (err) {
                getApiErrors(err);
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
                <label htmlFor='orgName'>Organization Name</label>
                <input type='text'
                        name='orgName'
                        id='orgName'
                        placeholder='Organization Name'
                        value={data.orgName}
                        onChange={handleChange} />
                <button type='submit'>Search</button>
            </form>
            {organizations && !organizations.length && 
                <p>No organizations found.  Try a different search term.</p>}
            {organizations && organizations.map(o =>
                <Link to={`../organization/${o.orgId}`} 
                        key={o.orgId}>{o.orgName}</Link>)}
        </div>
    );
};

export default OrganizationSearch;