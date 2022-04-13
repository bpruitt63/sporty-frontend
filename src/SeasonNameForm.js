import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import {Form, Button, InputGroup, Col, Spinner} from 'react-bootstrap';
import { useErrors } from './hooks';
import Errors from './Errors';
import SportyApi from './SportyApi';

function SeasonNameForm({data, handleChange, toggle, isEdit=false, setIsEdit=null, season={}, setSeason=null, toggleEdit}) {

    const [errors, setErrors] = useState({});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const [isLoading, setIsLoading] = useState(false);
    const {orgId, seasonId} = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiErrors({});
        setErrors({});

        if (data.seasonTitle.length < 2 || data.seasonTitle.length > 100) {
            setErrors({error: "Season title must be between 2 and 100 characters"});
            return false;
        };
        
        if (!isEdit) {
            toggle('seasonTeams');
        } else {
            setIsLoading(true);
            try {
                const dataToSend = {title: data.seasonTitle};
                const {title} = await SportyApi.editSeason(orgId, seasonId, dataToSend);
                setSeason({...season, title});
                setIsEdit(false);
            } catch (err) {
                getApiErrors();
                setIsLoading(false);
            };
        };
    };

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    };

    return (
        <div
        className={isEdit ? 'editForm' : 'nameForm'}>
            <Errors apiErrors={apiErrors}
                    formErrors={errors} />
            <Form onSubmit={handleSubmit}>
                <Col xs={{span: 10, offset: 1}} md={isEdit ? {span: 10, offset: 1} : {span: 6, offset: 3}}>
                    <Form.Group controlId='seasonTitle'>
                        <InputGroup>
                            <Form.Control type='text'
                                            name='seasonTitle'
                                            placeholder='Season Title'
                                            value={data.seasonTitle}
                                            onChange={handleChange} />
                            <Button type='submit'
                                    variant='dark'>
                                {isEdit ? 'Save' : 'Next'}
                            </Button>
                            {isEdit &&
                                <Button onClick={toggleEdit}
                                        variant='outline-secondary'>
                                    Cancel    
                                </Button>}
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Form>
        </div>
    );
};

export default SeasonNameForm;