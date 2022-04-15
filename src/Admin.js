import React from 'react';
import { Navigate } from 'react-router-dom';
import { ButtonGroup, Button, Container } from 'react-bootstrap';
import './static/styles/Admin.css';
import RegisterForm from './RegisterForm';
import EmailSearchForm from './EmailSearchForm';
import OrganizationNameForm from './OrganizationNameForm';
import OrganizationSearch from './OrganizationSearch';
import {useToggle} from './hooks';

function Admin({user, setUser, isMobile}) {

    const initialState = {register: false, userUpdate: false, search: false,
                            newOrg: false};
    const [toggle, isOpen] = useToggle(initialState);

    if (!(user && user.superAdmin)){
        return <Navigate to='/' />;
    };

    return (
        <Container>
            <ButtonGroup vertical={isMobile}>
                <Button onClick={() => toggle('register')}
                        active={isOpen.register}
                        variant='warning'>
                    Create New User
                </Button>
                <Button onClick={() => toggle('userUpdate')}
                        active={isOpen.userUpdate}
                        variant='warning'>
                    Update User
                </Button>
                <Button onClick={() => toggle('search')}
                        active={isOpen.search}
                        variant='warning'>
                    Search Organizations
                </Button>
                <Button onClick={() => toggle('newOrg')}
                        active={isOpen.newOrg}
                        variant='warning'>
                    Create New Organization
                </Button>
            </ButtonGroup>
            {isOpen.register && <RegisterForm user={user} />}
            {isOpen.userUpdate && <EmailSearchForm user={user} />}
            {isOpen.search && <OrganizationSearch />}
            {isOpen.newOrg && <OrganizationNameForm userProp={user}
                                                    setUser={setUser}/>}
        </Container>
    );
};

export default Admin;