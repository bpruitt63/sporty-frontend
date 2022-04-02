import React, {useState} from 'react';
import {Container, Navbar, NavDropdown, Button} from 'react-bootstrap';
import LoginForm from './LoginForm';

function NavB({user, handleLogin}) {

    const [login, setLogin] = useState(false);

    return (
        <Navbar bg='dark'
                variant='dark'>
            <Container>
                <Navbar.Brand href='/'>Sporty</Navbar.Brand>
                {login && 
                    <LoginForm handleLogin={handleLogin} />}
                {user && 
                    <NavDropdown title={`${user.firstName} ${user.lastName}`}>
                        {user && user.superAdmin &&
                            <NavDropdown.Item href='/admin'>Admin</NavDropdown.Item>}
                        <NavDropdown.Item href='/profile'>Edit Profile</NavDropdown.Item>
                        <NavDropdown.Item href='/logout'>Log Out</NavDropdown.Item>
                    </NavDropdown>}
                {/* {!user &&
                    <Button onClick={() => setLogin(!login)}
                            variant='link'>
                        {login ? 'Cancel Log In' : 'Log In'}
                    </Button>} */}
                {!user &&
                    <NavDropdown title='Users'>
                        <NavDropdown.Item>
                            <Button onClick={() => setLogin(!login)}
                                    variant='link'>
                                {login ? 'Cancel Log In' : 'Log In'}
                            </Button>
                        </NavDropdown.Item>
                        <NavDropdown.Item href='/register'>Register</NavDropdown.Item>
                    </NavDropdown>}
            </Container>
        </Navbar>
    );
};

export default NavB;