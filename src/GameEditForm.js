import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {Spinner, Form, Button, Row, Col} from 'react-bootstrap';
import {useHandleChange, useErrors} from './hooks';
import { validateGames, formatInputs, formatTime, getTeams, getRankings } from './static/helpers';
import Errors from './Errors';
import ModalComponent from './ModalComponent';
import SportyApi from './SportyApi';

function GameEditForm({gameProp, season, setSeason, setEdit, setGame, currentGames, setGames}) {

    const {orgId} = useParams();
    const [data, handleChange, setData] = useHandleChange(gameProp);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const [modal, setModal] = useState(false);

    const bye = parseInt(Object.keys(season.teams).find(key => season.teams[key].teamName === 'Bye'));

    const formatSeasonTeams = (teams) => {
        const formatted = [];
        for (let key of Object.keys(teams)) {
            formatted.push({
                teamId: key,
                color: season.teams[key].color,
                teamName: season.teams[key].teamName
            });
        };
        return formatted;
    };

    const nullScore = (e) => {
        e.preventDefault();
        setData({...data,
                team1Score: null,
                team2Score: null});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});
        let game = {team1Id: parseInt(data.team1Id),
                        team2Id: parseInt(data.team2Id),
                        gameDate: data.gameDate,
                        gameTime: data.gameTime,
                        gameLocation: data.gameLocation,
                        team1Score: data.team1Score,
                        team2Score: data.team2Score,
                        notes: data.notes};

        if (!validateGames({game}, setErrors)) return false;
        game = formatInputs({game}, bye).game;
        setIsLoading(true);

        try {
            const updatedGame = await SportyApi.editGame({game}, data.gameId, orgId, season.seasonId);
            updatedGame.title = data.title;
            const ind = season.games.findIndex(g => g.gameId === data.gameId);
            const games = [...season.games];
            games[ind] = updatedGame;
            const readableTime = formatTime(game.gameTime);
            setGame({...updatedGame, readableTime});
            const updatedSeason = {...season, games};
            let teamsArray = formatSeasonTeams(season.teams);
            teamsArray = getTeams(teamsArray);
            const {teams, rankings} = getRankings(updatedSeason.games, teamsArray);
            setSeason({...updatedSeason, teams, rankings});
            setEdit(false);
        } catch (err) {
            getApiErrors(err);
            setIsLoading(false);
        };
    };

    const deleteGame = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});
        setIsLoading(true);

        try {
            await SportyApi.deleteGame(orgId, season.seasonId, data.gameId);

            const ind = season.games.findIndex(g => g.gameId === data.gameId);
            const games = [...season.games];
            games.splice(ind, 1);
            let teamsArray = formatSeasonTeams(season.teams);
            teamsArray = getTeams(teamsArray);
            const {teams, rankings} = getRankings(games, teamsArray);
            setSeason({...season, games, teams, rankings});

            const currentInd = currentGames.findIndex(g => g.gameId === data.gameId);
            const newCurrentGames = [...currentGames];
            newCurrentGames.splice(currentInd, 1);
            setGames(newCurrentGames);
        } catch (err) {
            getApiErrors(err);
            setIsLoading(false);
        };
    };

    const deleteModal = (e) => {
        e.preventDefault();
        setModal(!modal);
    };

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Row className='gameTime'>
                    <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 1}}>
                        <Form.Control type='date'
                                name='gameDate'
                                value={data.gameDate || ''}
                                onChange={handleChange} />
                    </Col>
                    {parseInt(data.team1Id) !== bye && 
                    parseInt(data.team2Id) !== bye &&
                        <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 1}}>
                            <Form.Control type='time'
                                    name='gameTime'
                                    value={data.gameTime || ''}
                                    onChange={handleChange} />
                        </Col>}
                </Row>
                <Row className='matchup'>
                    <Col xs={12} md={5} 
                        className={data.team1Id ? `matchup${season.teams[data.team1Id].color}` : 'matchupN/A'}>
                        <Col xs={{span: 10, offset: 1}}>
                            <Form.Select value={data.team1Id}
                                    onChange={handleChange}
                                    name={`team1Id`}>
                                <option value={''}>Select Team</option>
                                {Object.keys(season.teams).map(t =>
                                    <option value={t}
                                            key={t}>
                                        {season.teams[t].teamName}
                                    </option>)}
                            </Form.Select>
                            {parseInt(data.team1Id) !== bye && 
                            parseInt(data.team2Id) !== bye &&
                                <Form.Group controlId='team1Score' className='scoreEdit'>
                                    <Form.Label column xs={4}>
                                        Score:{' '}
                                    </Form.Label>
                                        <Col xs={4}>
                                            <Form.Control type='number'
                                                    min='0'
                                                    max='999'
                                                    name={`team1Score`}
                                                    value={data.team1Score !== null ? data.team1Score : ''}
                                                    onChange={handleChange} />
                                        </Col>
                                </Form.Group>}
                        </Col>
                    </Col>
                    <Col xs={12} md={2} className='vs'>
                        vs 
                    </Col>
                    <Col xs={12} md={5} 
                        className={data.team2Id ? `matchup${season.teams[data.team2Id].color}` : 'matchupN/A'}>
                        <Col xs={{span: 10, offset: 1}}>
                            <Form.Select value={data.team2Id}
                                    onChange={handleChange}
                                    name={`team2Id`}>
                                <option value={''}>Select Team</option>
                                {Object.keys(season.teams).map(t =>
                                    <option value={t}
                                            key={t}>
                                        {season.teams[t].teamName}
                                    </option>)}
                            </Form.Select>
                            {parseInt(data.team1Id) !== bye && 
                            parseInt(data.team2Id) !== bye &&
                                <Form.Group controlId='team2Score' 
                                            className='scoreEdit'>
                                    <Form.Label column xs={4}>
                                        Score:{' '}
                                    </Form.Label>
                                        <Col xs={4}>
                                            <Form.Control type='number'
                                                    min='0'
                                                    max='999'
                                                    name={`team2Score`}
                                                    value={data.team2Score !== null ? data.team2Score : ''}
                                                    onChange={handleChange} />
                                        </Col>
                                </Form.Group>}
                        </Col>
                    </Col>
                </Row>
                {parseInt(data.team1Id) !== bye && 
                parseInt(data.team2Id) !== bye &&
                    <Row className='locationRow'>
                        <Col xs={12} md={6}>
                            <Form.Group controlId='gameLocation'>
                                <Form.Label column xs={4}>
                                    Location:{' '}
                                </Form.Label>
                                <Col xs={8}>
                                    <Form.Control type='text'
                                            name={`gameLocation`}
                                            value={data.gameLocation}
                                            onChange={handleChange} />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col xs={{span: 10, offset: 1}} md={{span: 6, offset: 0}}>
                            <Button onClick={nullScore}
                                    variant='outline-secondary'>
                                Remove Score
                            </Button>
                        </Col>
                    </Row>}
                <Form.Group controlId='notes'>
                    <Form.Label>
                        Notes: 
                    </Form.Label>
                    <Col xs={{span: 10, offset: 1}}>
                        <Form.Control as='textarea'
                                    rows={3}
                                    name='notes'
                                    value={data.notes}
                                    onChange={handleChange} />
                    </Col>
                </Form.Group>
                <Row className='backNextButtons'>
                    <Col xs={6}>
                        <Button onClick={gameProp.team1Score ? deleteModal : deleteGame}
                                variant='danger'>
                            Delete Game
                        </Button>
                    </Col>
                    <Col>
                        <Button type='submit'
                                variant='dark'>
                            Save
                        </Button>
                    </Col>
                </Row>
                <Errors apiErrors={apiErrors}
                        formErrors={errors} />
            </Form>
            {modal &&
                <ModalComponent message={'Score already entered for game.  Are you sure you want to delete?'}
                        cancel={deleteModal}
                        confirm={deleteGame} />}
        </div>
    );
};

export default GameEditForm;