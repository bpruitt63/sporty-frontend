import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useToggle} from './hooks';
import SportyApi from './SportyApi';
import OrganizationNameForm from './OrganizationNameForm';
import ManageUsers from './ManageUsers';

function OrganizationHome({user}) {

    const [isLoading, setIsLoading] = useState(true);
    const {orgId} = useParams();
    const initialState = {orgId: '', orgName: ''};
    const [org, setOrg] = useState(initialState);
    const toggleState = {editOrg: false, manageUsers: false};
    const [toggle, isOpen] = useToggle(toggleState);
    const isAdmin = user.superAdmin || (user.organizations[orgId] && 
                                user.organizations[orgId].adminLevel === 1);
    const isEditor = user.organizations[orgId] && 
                                user.organizations[orgId].adminLevel === 2;
    const navigate = useNavigate();

    useEffect(() => {
        async function getOrganizationInfo() {
            const result = await SportyApi.getOranization(orgId);
            if (!result) navigate('/');
            setOrg(result);
        };
        getOrganizationInfo(orgId);
        setIsLoading(false);
    }, [orgId, navigate]);

    const remove = async (e) => {
        e.preventDefault();

        /** TODO ADD MODAL */

        await SportyApi.deleteOrganization(orgId);
        navigate('/');
    };

    if (isLoading) {
        return <p>Loading</p>
    };

    return (
        <div>
            <p>{org.orgName}</p>
            {isAdmin && isOpen.editOrg &&
                <>
                <OrganizationNameForm orgId={orgId}
                                        orgName={org.orgName}
                                        setOrg={setOrg} />
                <button onClick={remove}>Delete Organization</button>                     
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
        </div>
    );
};

export default OrganizationHome;