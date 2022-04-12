import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Form, Col, Button, InputGroup} from 'react-bootstrap';
import {useHandleChange, useErrors} from './hooks';
import Errors from './Errors';
import SportyApi from './SportyApi';

function OrganizationNameForm({orgId=null, orgName='', setOrg, userProp, setUser, toggle}) {

    const [data, handleChange] = useHandleChange({orgName});
    const [checked, setChecked] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});

        /** Validates form and sets error */
        if (data.orgName.length < 2 || data.orgName.length > 100) {
            setErrors({error: "Name must be between 2 and 100 characters"});
            return false;
        };
        
        if (orgId) {
            /** If existing organization, updates organization name */
            try {
                const org = await SportyApi.updateOrganization(orgId, data);
                setOrg(org);
                toggle('editOrg');
            } catch (err) {
                getApiErrors(err);
            };
        } else {
            /** If new organization, creates organization, adds creator
             * to organization if not super admin and redirects
             * to organization's home page
             */
            try {
                const org = await SportyApi.addOrganization(data);

                if (checked || !userProp.superAdmin) {
                    const {user, token} = await SportyApi.addUserOrganization(
                                            org.orgId, userProp.email, {adminLevel: 1});
                    setUser(user);
                    localStorage.setItem("token", token);
                    SportyApi.setToken(token);
                };

                navigate(`/organization/${org.orgId}`);
            } catch (err) {
                getApiErrors(err);
            };
        };
    };

    const handleCheck = () => {
        setChecked(!checked);
    };

    return (
        <div>
            <Errors formErrors={errors}
                    apiErrors={apiErrors} />
            <Form onSubmit={handleSubmit}>
                <Col xs={{span: 10, offset: 1}} md={{span: 6, offset: 3}}>
                    <Form.Group controlId='orgName'>
                        <InputGroup>
                            <Form.Control type='text'
                                        name='orgName'
                                        placeholder='Organization Name'
                                        value={data.orgName}
                                        onChange={handleChange} />
                        <Button type='submit'
                                variant='dark'>
                            Submit
                        </Button>
                        </InputGroup>
                    </Form.Group>
                    {userProp && userProp.superAdmin &&
                        <Form.Group controlId='userOrg'>
                            <Form.Check type='checkbox'
                                        name='userOrg'
                                        checked={checked}
                                        onChange={handleCheck}
                                        label='This is my Organization' />
                        </Form.Group>}
                </Col>
            </Form>
        </div>
    );
};

export default OrganizationNameForm;