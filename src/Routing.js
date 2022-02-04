import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import RegisterForm from './RegisterForm';
import Logout from './Logout';
import Admin from './Admin';
import UserUpdateForm from './UserUpdateForm';
import OrganizationHome from './OrganizationHome';

function Routing({user, setUser, handleLogin}) {

    return (
        <Routes>
            <Route path='/' element={<Home user={user}/>} />
            <Route path='/register' element={<RegisterForm user={user}
                                                    handleLogin={handleLogin} />} />
            <Route path='/logout' element={<Logout setUser={setUser} />} />
            <Route path='/admin' element={<Admin user={user} />} />
            <Route path='/profile' element={<UserUpdateForm user={user} />} />
            <Route path='/organization/:orgId' element={<OrganizationHome user={user} />} />
            <Route path='*' element={<Navigate to='/'/>} />
        </Routes>
    );
};

export default Routing;