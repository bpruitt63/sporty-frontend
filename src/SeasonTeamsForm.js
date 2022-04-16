import React, {useState} from 'react';
import {Form, Button, Col, Row} from 'react-bootstrap';
import Errors from './Errors';

function SeasonTeamsForm({season, handleChange, toggle, setSeason}) {

    const [errors, setErrors] = useState({});
    const [isOpen, setIsOpen] = useState(!season.generateNames || false);

    const handleNameChange = (e) => {
        let {name, value} = e.target;
        name = name.split(' ');
        let teams = season.teams;
        teams = {...teams,
                        [name[0]]: {
                            ...teams[name[0]],
                            [name[1]]: value
                        }};
        setSeason(d => ({...d, teams}));
    };

    const handleRadio = (val) => {
        setSeason({...season, generateNames: val});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (!season.numTeams) {
            setErrors({error: 'Number of teams is required'});
            return false;
        };

        const teams = {};
        for (let team = 1; team <= season.numTeams; team++) {
            teams[team] = ({teamName: season.generateNames ? `Team ${team}` : '',
                            color: 'N/A'});
        };
        setSeason({...season, teams});

        if (season.generateNames) {
            toggle('seasonRounds');
        } else {
            setIsOpen(true);
        };
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const teamsArray = Object.values(season.teams);
        if (!validateTeams(teamsArray)) return false;
        toggle('seasonRounds');
    };

    const validateTeams = (teams) => {
        const names = [];
        for (let team of teams) {
            if (!team.teamName) {
                setErrors({error: 'All teams must have a name'});
                return false;
            };
            if (team.teamName.length < 4 || team.teamName.length > 50) {
                setErrors({error: 'Team names must be between 4 and 50 characters'});
                return false;
            };
            names.push(team.teamName);
        };
        const teamCheck = new Set(names);
        if (names.length !== teamCheck.size) {
            setErrors({error: 'Multiple teams cannot have the same name'});
            return false;
        };
        return true;
    };

    return (
        <div>
            <Col xs={12} lg={{span: 8, offset: 2}}>
                <Errors formErrors={errors}/>
                <Form onSubmit={handleSubmit} className='teamsFormContainer'>
                    <Form.Group as={Row} controlId='numTeams'>
                        <Form.Label column xs={8} md={6}
                                    className='numberLabel'>
                            Number of Teams
                        </Form.Label>
                        <Col xs={3} md={2}>
                            <Form.Control type='number'
                                    name='numTeams'
                                    min='2'
                                    max='30'
                                    value={season.numTeams}
                                    onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Check type='radio' 
                            id='generateNamesF'
                            label='Name Teams'
                            checked={season.generateNames === false}
                            onChange={() => handleRadio(false)} />
                    <Form.Check type='radio' 
                            id='generateNamesT'
                            label='Use Numbers for Team Names'
                            checked={season.generateNames === true}
                            onChange={() => handleRadio(true)} />
                    <Row className='backNextButtons'>
                        <Col xs={6}>
                            <Button onClick={() => toggle('seasonName')}
                                    variant='secondary'>
                                Back
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button type='submit'
                                    variant='dark'>
                                {isOpen ? 'Change' : 'Next'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
            {isOpen && 
                <Col xs={12} lg={{span: 8, offset: 2}}>
                    <p className='message'>Enter Team Names</p>
                    <Form onSubmit={handleNameSubmit} className='teamsFormContainer'>
                        {Object.keys(season.teams).map(t =>
                            <Row key={t} className='teamsFormRow'>
                                <Form.Group controlId={`${t} teamName`}>
                                    <Col xs={4} md={2} className='teamsFormCol'>
                                        <Form.Label>
                                            Team Name
                                        </Form.Label>
                                    </Col>
                                    <Col xs={7} md={6} className='teamsFormCol'>
                                        <Form.Control type='text'
                                                name={`${t} teamName`}
                                                placeholder={`Team ${t}`}
                                                value={season.teams[t].teamName}
                                                onChange={handleNameChange}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group controlId={`${t} color`}>
                                    <Col xs={4} md={2} className='teamsFormCol'>
                                        <Form.Label>
                                            Team Color
                                        </Form.Label>
                                    </Col>
                                    <Col xs={7} md={6} className='teamsFormCol'>
                                        <Form.Select value={season.teams[t].color}
                                                onChange={handleNameChange}
                                                name={`${t} color`}>
                                            <option value='N/A'>N/A</option>
                                            <option value='black'>Black</option>
                                            <option value='white'>White</option>
                                            <option value='gray'>Gray</option>
                                            <option value='red'>Red</option>
                                            <option value='orange'>Orange</option>
                                            <option value='yellow'>Yellow</option>
                                            <option value='blue'>Blue</option>
                                            <option value='green'>Green</option>
                                            <option value='purple'>Purple</option>
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                            </Row>)} 
                        <Button type='submit'
                                variant='dark'>
                            Submit Teams
                        </Button>   
                    </Form>
                </Col>}
        </div>
    );
};

export default SeasonTeamsForm;