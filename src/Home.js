import React from 'react';
import OrganizationSearch from './OrganizationSearch';
import {useToggle} from './hooks';
import OrganizationNameForm from './OrganizationNameForm';
import MyOrganizations from './MyOrganizations';
import {buildSeason} from './static/helpers';

function Home({user}) {

    const toggleState = {search: false, newOrg: false, myOrgs: false};
    const [toggle, isOpen] = useToggle(toggleState);

    return (
        <div>
            <button onClick={() => buildSeason([1, 2, 3, 4, 5, 6, 7], 20)}>test</button>
            <p>Here's where I'll say stuff</p>
            {isOpen.myOrgs && <MyOrganizations user={user} />}
            {user && (null in user.organizations === false) &&
                <button onClick={() => toggle('myOrgs')}>
                    {isOpen.myOrgs ? 'Close' : 'My Organizations'}    
                </button>}
            {isOpen.search && <OrganizationSearch />}
            <button onClick={() => toggle('search')}>
                {isOpen.search ? 'Cancel' : 'Search Organizations'}
            </button>
            {user && isOpen.newOrg &&
                <OrganizationNameForm user={user}/>}
            {user && 
                <button onClick={() => toggle('newOrg')}>
                    {isOpen.newOrg ? 'Cancel' : 'Create New Organization'}
                </button>}
        </div>
    );
};

export default Home;