import React from 'react';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import OrganizationSearch from './OrganizationSearch';
import {useToggle} from './hooks';
import OrganizationNameForm from './OrganizationNameForm';
import MyOrganizations from './MyOrganizations';
import NewSeason from './NewSeason';

function Home({user, setUser, isMobile}) {

    const initialState = {search: true, 
                        newOrg: false, 
                        myOrgs: false,
                        newSeason: false};
    const toggleState = {...initialState, search: false};
    const [toggle, isOpen] = useToggle(initialState, toggleState);

    return (
        <Container>
            <ButtonGroup vertical={isMobile}>
                <Button onClick={() => toggle('search')} 
                        active={isOpen.search}
                        variant='warning'>
                    Search Organizations
                </Button>
                {user && user.organizations && (null in user.organizations === false) &&
                    <Button onClick={() => toggle('myOrgs')}
                            active={isOpen.myOrgs}
                            variant='warning'>
                        My Organizations    
                    </Button>}
                {user && 
                    <Button onClick={() => toggle('newOrg')}
                            active={isOpen.newOrg}
                            variant='warning'>
                       Create New Organization
                    </Button>}
                <Button onClick={() => toggle('newSeason')}
                        active={isOpen.newSeason}
                        variant='warning'>
                    Build Season
                </Button>
            </ButtonGroup>
            {isOpen.myOrgs && <MyOrganizations user={user} />}
            {isOpen.search && <OrganizationSearch />}
            {user && isOpen.newOrg &&
                <OrganizationNameForm userProp={user}
                                        setUser={setUser}/>}
            {isOpen.newSeason && <NewSeason />}
        </Container>
    );
};

export default Home;