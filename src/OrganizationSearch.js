import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Form, Col, Button, InputGroup, ListGroup} from 'react-bootstrap';
import Errors from './Errors';
import {useHandleChange, useErrors} from './hooks';
import SportyApi from './SportyApi';

function OrganizationSearch() {

    const [isLoading, setIsLoading] = useState(false);
    const [organizations, setOrganizations] = useState();
    const initialState = {orgName: ''};
    const [data, handleChange] = useHandleChange(initialState);
    const [errors, setErrors] = useState({});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});

        /** Validates form and sets error */
        if (data.orgName.length < 2 || data.orgName.length > 100) {
            setErrors({error: "Search term must be between 2 and 100 characters"});
            return false;
        } else {
            setIsLoading(true);

            /** Searches organizations and sets state with result */
            try {
                const orgs = await SportyApi.searchOrganizations(data.orgName);
                setOrganizations(orgs);
                setIsLoading(false);
            } catch (err) {
                getApiErrors(err);
                setIsLoading(false);
            };
        };
    };

    if (isLoading) {
        return <p>Loading</p>
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
                                Search
                            </Button>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Form>
            {organizations && !organizations.length && 
                <p>No organizations found.  Try a different search term.</p>}
            <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 4}}>
                <ListGroup as='ul' variant='flush'>
                    {organizations && organizations.map(o =>
                        <ListGroup.Item key={o.orgId} className='listItem'>
                            <Link to={`../organization/${o.orgId}`}>{o.orgName}</Link>
                        </ListGroup.Item>)}
                </ListGroup>
            </Col>
        </div>
    );
};

export default OrganizationSearch;