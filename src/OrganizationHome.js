import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {ButtonGroup, Button} from 'react-bootstrap';
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

    if (isLoading) {
        return <p>Loading</p>
    };

    return (
        <div>
            <Errors apiErrors={apiErrors} />
            <h3>{org.orgName}</h3>
            {!isOpen.newSeason &&
                <ButtonGroup vertical={isMobile}>
                    <Button onClick={isOpen.seasons ? () => toggle('seasons') : getSeasons}
                            active={isOpen.seasons}>
                        View Seasons
                    </Button>
                    {isEditor &&
                        <Button onClick={() => toggle('newSeason')}>
                            Build Season   
                        </Button>}
                    {isAdmin && 
                        <Button onClick={() => toggle('editOrg')}
                                active={isOpen.editOrg}>
                            Edit Organization
                        </Button>}
                    {isAdmin && 
                        <Button onClick={() => toggle('manageUsers')}
                                active={isOpen.manageUsers}>
                            Manage Users 
                        </Button>}
                </ButtonGroup>}
            {isOpen.seasons && !org.seasons[0] &&
                <p>No seasons found for {org.orgName}</p>}
            {isOpen.seasons && org.seasons[0] &&
                org.seasons.map(s =>
                    <Link to={`/organization/${orgId}/seasons/${s.seasonId}`} 
                        key={s.seasonId}>{s.title}</Link> )}
            {isEditor && isOpen.newSeason &&
                <NewSeason orgId={orgId}
                            cancel={toggle} />}
            
            {isAdmin && isOpen.editOrg &&
                <>
                <OrganizationNameForm orgId={orgId}
                                        orgName={org.orgName}
                                        setOrg={setOrg}
                                        toggle={toggle} />
                <button onClick={removeModal}>Delete Organization</button>                     
                </>}
            
            {isAdmin && isOpen.manageUsers &&
                <ManageUsers orgId={orgId} orgName={org.orgName} />}
            
            {modal &&
                <Modal message={`Permanently delete ${org.orgName}?`}
                        cancel={removeModal}
                        confirm={remove} />}
        </div>
    );
};

export default OrganizationHome;