import React from 'react';
import {Container, Navbar, NavDropdown} from 'react-bootstrap';
import LoginForm from './LoginForm';

function NavB({user, handleLogin}) {

    return (
        <Navbar bg='secondary'>
            <Container>
                <Navbar.Brand href='/'>Sporty</Navbar.Brand>
                <LoginForm handleLogin={handleLogin} />
                {user && 
                    <NavDropdown title={`${user.firstName} ${user.lastName}`}>
                        {user && user.superAdmin &&
                            <NavDropdown.Item href='/admin'>Admin</NavDropdown.Item>}
                        <NavDropdown.Item href='/profile'>Edit Profile</NavDropdown.Item>
                        <NavDropdown.Item href='/logout'>Log Out</NavDropdown.Item>
                    </NavDropdown>}
                {!user && 
                    <NavDropdown autoClose={false} title='Log In'>
                        <NavDropdown.Item>
                            <LoginForm handleLogin={handleLogin} />
                        </NavDropdown.Item>
                        <NavDropdown.Item href='/register'>Register</NavDropdown.Item>
                    </NavDropdown>}
            </Container>
        </Navbar>
    );
};

export default NavB;