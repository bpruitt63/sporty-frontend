import React, {useState} from 'react';
import {Spinner, Col, Row, Form, Button} from 'react-bootstrap';
import { buildSeason } from './static/helpers/seasonBuild';
import { getTeams } from './static/helpers/seasonRank';
import { useErrors } from './hooks';
import Errors from './Errors';
import SportyApi from './SportyApi';

function SeasonRoundsForm({season, handleChange, toggle, setSeason, orgId}) {

    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();

    const newGame = {team1Id: '',
                        team2Id: '',
                        gameDate: null,
                        gameTime: null,
                        gameLocation: '',
                        team1Score: null,
                        team2Score: null,
                        notes: ''};

    const handleSubmitRounds = async (e) => {
        e.preventDefault();
        setApiErrors({});
        setIsLoading(true);
        if (!season.generateGames) {
            let teamsArray = Object.values(season.teams);
            teamsArray.push({teamName: 'Bye', color: 'N/A'});
            const numGames = season.rounds * (Math.floor(teamsArray.length / 2));
            const games = {};
            for (let game = 1; game <= numGames; game++) {
                games[game] = newGame;
            };
            try {
                const {seasonId} = await SportyApi.addSeason(season.seasonTitle, orgId);
                teamsArray = await SportyApi.addTeams({teams: teamsArray}, seasonId, orgId);
                const teams = getTeams(teamsArray);
                setSeason({...season, seasonId, games, teams});
                setIsLoading(false);
                toggle('manualForm');
            } catch (e) {
                getApiErrors(e);
                setIsLoading(false);
            };
        } else {
            const {games, teams} = buildSeason(Object.values(season.teams), season.rounds);
            setSeason({...season, games, teams});
            setIsLoading(false);
            toggle('preview');
        };
    };

    const handleRadio = (val) => {
        setSeason({...season, generateGames: val});
    };

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    };

    return (
        <Col xs={12} lg={{span: 8, offset: 2}} className='teamsFormContainer'>
            <Errors apiErrors={apiErrors} />
            {orgId &&
                <Row>
                    <Col xs={12} md={6}>
                        <Form.Check type='radio' 
                                id='notManual'
                                checked={season.generateGames}
                                onChange={() => handleRadio(true)}
                                label='Automatically Generate Season' />
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Check type='radio' 
                                id='manual'
                                checked={!season.generateGames}
                                onChange={() => handleRadio(false)}
                                label='Manually Enter Season Info' />
                    </Col>
                </Row>}
            <Form onSubmit={handleSubmitRounds}>
                <Form.Group as={Row} controlId='rounds' className='roundsRow'>
                    <Form.Label column xs={12} md={{span: 5, offset: 2}}>
                        Number of Weeks/Rounds
                    </Form.Label>
                    <Col xs={{span: 4, offset: 4}} md={{span: 2, offset: 0}}>
                        <Form.Control type='number'
                                name='rounds'
                                min='1'
                                max='50'
                                value={season.rounds}
                                onChange={handleChange} />
                    </Col>
                </Form.Group>
                <Row className='backNextButtons'>
                    <Col xs={6}>
                        <Button onClick={() => toggle('seasonTeams')}
                                variant='secondary'>
                            Back
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button type='submit'
                                variant='dark'>
                            {orgId ? 'Next' : 'Generate Season'}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Col>
    );
};

export default SeasonRoundsForm;