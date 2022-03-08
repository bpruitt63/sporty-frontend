import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useToggle, useErrors} from './hooks';
import SportyApi from './SportyApi';
import OrganizationNameForm from './OrganizationNameForm';
import ManageUsers from './ManageUsers';
import NewSeason from './NewSeason';
import Errors from './Errors';
import Modal from './Modal';

function OrganizationHome({user}) {

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
    const isAdmin = user.superAdmin || (user.organizations[orgId] && 
                                user.organizations[orgId].adminLevel === 1);
    const isEditor = user.superAdmin || (user.organizations[orgId] && 
                                user.organizations[orgId].adminLevel <= 2);
    const navigate = useNavigate();

    useEffect(() => {
        async function getOrganizationInfo() {
            try {
                const {orgName} = await SportyApi.getOranization(orgId);
                setOrg({orgId, orgName, seasons: []});
                setIsLoading(false);
            } catch (e) {
                getApiErrors(e);
                setIsLoading(false);
            };
        };
        getOrganizationInfo(orgId);
    }, [orgId, navigate, getApiErrors]);

    const remove = async (e) => {
        e.preventDefault();
        setApiErrors({});
        setIsLoading(true);

        try {
            setModal(false);
            await SportyApi.deleteOrganization(orgId);
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
            <p>{org.orgName}</p>
            {isOpen.seasons && !org.seasons[0] &&
                <p>No seasons found for {org.orgName}</p>}
            {isOpen.seasons && org.seasons[0] &&
                org.seasons.map(s =>
                    <Link to={`/organization/${orgId}/seasons/${s.seasonId}`} 
                        key={s.seasonId}>{s.title}</Link> )}
            {!isOpen.seasons &&
                <button onClick={getSeasons}>View All Seasons</button>}
            {isOpen.seasons &&
                <button onClick={() => toggle('seasons')}>Close Seasons</button>}
            {isEditor && isOpen.newSeason &&
                <NewSeason orgId={orgId}
                            cancel={toggle} />}
            {isEditor && !isOpen.newSeason &&
                <button onClick={() => toggle('newSeason')}>
                    Build Season   
                </button>}
            {isAdmin && isOpen.editOrg &&
                <>
                <OrganizationNameForm orgId={orgId}
                                        orgName={org.orgName}
                                        setOrg={setOrg} />
                <button onClick={removeModal}>Delete Organization</button>                     
                </>}
            {isAdmin && 
                <button onClick={() => toggle('editOrg')}>
                    {isOpen.editOrg ? 'Cancel' : 'Edit Organization'}
                </button>}
            {isAdmin && isOpen.manageUsers &&
                <ManageUsers orgId={orgId} orgName={org.orgName} />}
            {isAdmin && 
                <button onClick={() => toggle('manageUsers')}>
                    {isOpen.manageUsers ? 'Cancel Manage Users' : 'Manage Users'}    
                </button>}
            {modal &&
                <Modal message={`Permanently delete ${org.orgName}?`}
                        cancel={removeModal}
                        confirm={remove} />}
        </div>
    );
};

export default OrganizationHome;