import React from 'react';
import {Link} from 'react-router-dom';

function MyOrganizations({user}) {

    const organizations = user ? Object.keys(user.organizations) : [];
    const adminLevel = {1: 'Admininstrator', 2: 'Editor', 3: 'No editing permissions'};

    return (
        <>
            {organizations.map(o =>
                <div key={o}>
                    <Link to={`organization/${o}`}>
                        {user.organizations[o].orgName}
                    </Link>
                <span>{adminLevel[user.organizations[o].adminLevel]}</span>
            </div>)}
        </>
    );
};

export default MyOrganizations;