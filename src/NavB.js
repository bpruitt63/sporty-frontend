import React, {useState} from 'react';
import {Container, Navbar, NavDropdown, Button} from 'react-bootstrap';
import LoginForm from './LoginForm';

function NavB({user, handleLogin, isMobile}) {

    const [login, setLogin] = useState(false);

    return (
        <div>
        <Navbar bg='dark'
                variant='dark'>
            <Container>
                <Navbar.Brand href='/'>Sporty</Navbar.Brand>
                {!user && login && !isMobile && 
                    <LoginForm handleLogin={handleLogin} isMobile={isMobile}/>}
                {user && 
                    <NavDropdown align='end' title={`${user.firstName} ${user.lastName}`} className='navbarDrop'>
                        {user && user.superAdmin &&
                            <NavDropdown.Item href='/admin'>Admin</NavDropdown.Item>}
                        <NavDropdown.Item href='/profile'>Edit Profile</NavDropdown.Item>
                        <NavDropdown.Item href='/logout'>Log Out</NavDropdown.Item>
                    </NavDropdown>}
                {!user &&
                    <NavDropdown align='end' title='Users' className='navbarDrop'>
                        <NavDropdown.Item>
                            <Button onClick={() => setLogin(!login)}
                                    variant='dropdown-item'>
                                {login ? 'Cancel Log In' : 'Log In'}
                            </Button>
                        </NavDropdown.Item>
                        <NavDropdown.Item href='/register'>Register</NavDropdown.Item>
                    </NavDropdown>}
            </Container>
        </Navbar>
        {!user && login && isMobile && 
                    <LoginForm handleLogin={handleLogin} isMobile={isMobile}/>}
        </div>
    );
};

export default NavB;