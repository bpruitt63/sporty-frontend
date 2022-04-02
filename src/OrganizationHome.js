import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Container, Col, ButtonGroup, Button, ListGroup} from 'react-bootstrap';
import {useToggle, useErrors} from './hooks';
import SportyApi from './SportyApi';
import OrganizationNameForm from './OrganizationNameForm';
import ManageUsers from './ManageUsers';
import NewSeason from './NewSeason';
import Errors from './Errors';
import Modal from './Modal';

function OrganizationHome({user, setUser, isMobile}) {

    const [isLoading, setIsLoading] = useState(true);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const {orgId} = useParams();
    const initialState = {orgId: '', orgName: '', seasons: []};
    const [org, setOrg] = useState(initialState);
    const toggleInitialState = {editOrg: false, 
                            manageUsers: false, 
                            newSeason: false,
                            seasons: false};
    const [toggle, isOpen] = useToggle(toggleInitialState);
    const [modal, setModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState();
    const [isEditor, setIsEditor] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        async function getOrganizationInfo() {
            try {
                const {orgName} = await SportyApi.getOrganization(orgId);
                setOrg({orgId, orgName, seasons: []});
                setIsLoading(false);
            } catch (e) {
                if (e[0] === "Server error, please try again later") {
                    getApiErrors(e);
                    setIsLoading(false);
                } else {
                    navigate('/');
                };
            };
        };
        getOrganizationInfo(orgId);
        setIsAdmin(user.superAdmin || (user.organizations && Object.hasOwn(user.organizations, orgId) && 
            user.organizations[orgId].adminLevel === 1));
        setIsEditor(user.superAdmin || (user.organizations && Object.hasOwn(user.organizations, orgId) && 
            user.organizations[orgId].adminLevel <= 2));
    }, [orgId, navigate, getApiErrors, user]);


    const remove = async (e) => {
        e.preventDefault();
        setApiErrors({});
        setIsLoading(true);

        try {
            setModal(false);
            const {token} = await SportyApi.deleteOrganization(orgId);
            if (orgId in user.organizations) {
                const organizations = {...user.organizations};
                delete organizations[orgId];
                setUser({...user, organizations});
                localStorage.setItem("token", token);
                SportyApi.setToken(token);
            };
            navigate('/');
        } catch (err) {
            getApiErrors(err);
            setModal(false);
            setIsLoading(false);
        };
    };

    const removeModal = (e) => {
        e.preventDefault();
        setModal(!modal);
    };

    const getSeasons = async (e) => {
        e.preventDefault();
        setApiErrors({});

        if (!org.seasons[0]) {
            setIsLoading(true);
            try {
                const seasons = await SportyApi.getSeasons(orgId);
                if (seasons) setOrg({...org, seasons});
            } catch (err) {
                getApiErrors(err);
            };
            setIsLoading(false);
        };
        toggle('seasons');
    };

    const toggleAndRemoveErrors = (section) =>{
        setApiErrors({});
        toggle(section);
    };

    if (isLoading) {
        return <p>Loading</p>
    };

    return (
        <Container>
            <Errors apiErrors={apiErrors} />
            <h3>{org.orgName}</h3>
            {!isOpen.newSeason &&
                <ButtonGroup vertical={isMobile}>
                    <Button onClick={isOpen.seasons ? () => toggleAndRemoveErrors('seasons') : getSeasons}
                            active={isOpen.seasons}
                            variant='warning'>
                        View Seasons
                    </Button>
                    {isEditor &&
                        <Button onClick={() => toggleAndRemoveErrors('newSeason')}
                                variant='warning'>
                            Build Season   
                        </Button>}
                    {isAdmin && 
                        <Button onClick={() => toggleAndRemoveErrors('editOrg')}
                                active={isOpen.editOrg}
                                variant='warning'>
                            Edit Organization
                        </Button>}
                    {isAdmin && 
                        <Button onClick={() => toggleAndRemoveErrors('manageUsers')}
                                active={isOpen.manageUsers}
                                variant='warning'>
                            Manage Users 
                        </Button>}
                </ButtonGroup>}
            {isOpen.seasons && !org.seasons[0] &&
                <p>No seasons found for {org.orgName}</p>}
            <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 4}}>
                <ListGroup as='ul' variant='flush'>
                    {isOpen.seasons && org.seasons[0] &&
                        org.seasons.map(s =>
                            <ListGroup.Item key={s.seasonId} className='listItem'>
                                <Link to={`/organization/${orgId}/seasons/${s.seasonId}`}>
                                    {s.title}
                                </Link>
                            </ListGroup.Item>)}
                </ListGroup>
             </Col>
            {isEditor && isOpen.newSeason &&
                <NewSeason orgId={orgId}
                            cancel={toggle} />}
            {isAdmin && isOpen.editOrg &&
                <>
                <OrganizationNameForm orgId={orgId}
                                        orgName={org.orgName}
                                        setOrg={setOrg}
                                        toggle={toggle} />
                <Button onClick={removeModal}>Delete Organization</Button>                     
                </>}
            {isAdmin && isOpen.manageUsers &&
                <ManageUsers orgId={orgId} orgName={org.orgName} />}
            {modal &&
                <Modal message={`Permanently delete ${org.orgName}?`}
                        cancel={removeModal}
                        confirm={remove} />}
        </Container>
    );
};

export default OrganizationHome;