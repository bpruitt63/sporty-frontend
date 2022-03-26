import React from 'react';
import { ListGroup, Col } from 'react-bootstrap';
import admin_icon from './static/images/admin_icon.png';
import editor_icon from './static/images/editor_icon.png';
import {Link} from 'react-router-dom';

function MyOrganizations({user}) {

    const organizations = user ? Object.keys(user.organizations) : [];
    const adminLevel = {1: {src: admin_icon, alt: 'Administrator'}, 
                        2: {src: editor_icon, alt: 'Editor'}, 
                        3: null};

    return (
        <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 4}}>
            <h3>My Organizations</h3>
            <ListGroup as='ul' variant='flush'>
                {organizations.map(o =>
                    <ListGroup.Item className='listItem' key={o}>
                        <Link to={`organization/${o}`}>
                            {user.organizations[o].orgName}
                        </Link>
                        {adminLevel[user.organizations[o].adminLevel] &&
                            <img className='icon'
                                src={adminLevel[user.organizations[o].adminLevel].src}
                                alt={adminLevel[user.organizations[o].adminLevel].alt}/>}
                    </ListGroup.Item>)}
            </ListGroup>
        </Col>
    );
};

export default MyOrganizations;