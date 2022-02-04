import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import EmailSearchForm from './EmailSearchForm';
import OrganizationNameForm from './OrganizationNameForm';
import OrganizationSearch from './OrganizationSearch';
import {useToggle} from './hooks';

function Admin({user}) {

    const initialState = {register: false, userUpdate: false, search: false,
                            newOrg: false};
    const [toggle, isOpen] = useToggle(initialState);

    if (!(user && user.superAdmin)){
        return <Navigate to='/' />;
    };

    return (
        <div>
            {isOpen.register && <RegisterForm user={user} />}
            <button onClick={() => toggle('register')}>
                {isOpen.register ? "Cancel" : "Create New User"}
            </button>
            {isOpen.userUpdate && <EmailSearchForm user={user} />}
            <button onClick={() => toggle('userUpdate')}>
                {isOpen.userUpdate ? "Cancel" : "Update User"}
            </button>
            {isOpen.search && <OrganizationSearch />}
            <button onClick={() => toggle('search')}>
                {isOpen.search ? 'Cancel' : 'Search Organizations'}
            </button>
            {isOpen.newOrg && <OrganizationNameForm user={user}/>}
            <button onClick={() => toggle('newOrg')}>
                {isOpen.newOrg ? 'Cancel' : 'Create New Organization'}
            </button>
        </div>
    );
};

export default Admin;