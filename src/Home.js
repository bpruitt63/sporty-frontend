import React from 'react';
import OrganizationSearch from './OrganizationSearch';
import {useToggle} from './hooks';
import OrganizationNameForm from './OrganizationNameForm';
import MyOrganizations from './MyOrganizations';
import NewSeason from './NewSeason';

function Home({user}) {

    const initialState = {search: true, 
                        newOrg: false, 
                        myOrgs: false,
                        newSeason: false};
    const toggleState = {...initialState, search: false};
    const [toggle, isOpen] = useToggle(initialState, toggleState);

    return (
        <div>
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
            {isOpen.newSeason && <NewSeason />}
            <button onClick={() => toggle('newSeason')}>
                {isOpen.newSeason ? 'Cancel Season Create' : 'Build Season'}
            </button>
        </div>
    );
};

export default Home;