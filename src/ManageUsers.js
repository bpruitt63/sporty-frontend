import React, {useState} from 'react';
import {Form, Button, InputGroup, Col} from 'react-bootstrap';
import SportyApi from './SportyApi';
import {useHandleChange, useErrors} from './hooks';
import Errors from './Errors';
import UserPermissions from './UserPermissions';

function ManageUsers({orgId, orgName}) {

    const [foundUser, setFoundUser] = useState();
    const [orgUsers, setOrgUsers] = useState();
    const initialState = {email: ''};
    const [data, handleChange, setData] = useHandleChange(initialState);
    const [errors, setErrors] = useState({});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();

    const getAll = async () => {
        setErrors({});
        setApiErrors({});

        try {
            const users = await SportyApi.getAllUsers(orgId);
            setOrgUsers(users);
        } catch (err) {
            getApiErrors(err);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});

        /** Validates form and sets error */
        if (!data.email || !data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            setErrors({error: "Not a valid email address"})
            setData(initialState);
            return false;
        } else {
            try {
                const user = await SportyApi.getUser(data.email);
                setFoundUser(user);
            } catch (err) {
                getApiErrors(err);
            };
        };
    };

    return (
        <div>
            <Errors formErrors={errors}
                    apiErrors={apiErrors} />
            <Form onSubmit={handleSubmit}>
                <Col xs={{span: 10, offset: 1}} md={{span: 6, offset: 3}}>
                    <Form.Group controlId='email'>
                        <InputGroup>
                            <Form.Control type='text'
                                    name='email'
                                    placeholder="User's Email"
                                    value={data.email}
                                    onChange={handleChange} />
                            <Button type='submit'
                                    variant='dark'>
                                Get User
                            </Button>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Form>
            {foundUser && 
                <UserPermissions targetUser={foundUser} orgId={orgId}/>}
            {!orgUsers && 
                <Button onClick={getAll}
                        variant='dark'
                        className='viewAllButton'>
                    View all {orgName}'s users
                </Button>}
            {orgUsers && orgUsers.map(u =>
                <UserPermissions key={u.email} 
                                targetUser={u}
                                orgId={orgId} />)}
        </div>
    );
};

export default ManageUsers;