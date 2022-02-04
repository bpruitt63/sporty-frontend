import React from 'react';
import { NavLink } from 'react-router-dom';
import LoginForm from './LoginForm';

function NavB({user, handleLogin}) {

    return (
        <div>
            <NavLink to='/'>Sporty</NavLink>
            <span>Search goes here</span>
            {user && <>
                    <NavLink to='/profile'>{`${user.firstName} ${user.lastName}`}</NavLink>
                    <NavLink to='/logout'>Log Out</NavLink>
                </>}
            {!user && <>
                    <LoginForm handleLogin={handleLogin} />
                    <NavLink to='/register'>Register</NavLink>
                </>}
            {user && user.superAdmin &&
                <NavLink to='/admin'>Admin</NavLink>}
        </div>
    );
};

export default NavB;