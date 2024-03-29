import React, {useState, useEffect, useMemo} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { Container, Button, ListGroup, Col, Row, Spinner, Form } from 'react-bootstrap';
import './static/styles/Season.css';
import './static/styles/Game.css';
import {useErrors, useHandleChange} from './hooks';
import {validateGames, formatInputs} from './static/helpers/helpers';
import {getTeams, getRankings} from './static/helpers/seasonRank';
import SportyApi from './SportyApi';
import Errors from './Errors';
import GameList from './GameList';
import SeasonNameForm from './SeasonNameForm';
import ModalComponent from './ModalComponent';
import NewGameForm from './NewGameForm';
import { buildTournament } from './static/helpers/tournament';
import TournamentDisplay from './TournamentDisplay';

function SeasonHome({user, isMobile}) {

    const {seasonId} = useParams();
    const {orgId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [season, setSeason] = useState({seasonId, title: '', games: [], rankings: [], seasonTournament: null});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const [apiErrorsNewGame, getApiErrorsNewGame, setApiErrorsNewGame] = useErrors();
    const [errors, setErrors] = useState({});
    const [games, setGames] = useState();
    const [editForm, setEditForm] = useState(false);
    const [title, handleChange, setTitle] = useHandleChange();
    const [modal, setModal] = useState(false);
    const [addGame, setAddGame] = useState(false);
    const [newGame, setNewGame] = useState();
    const [bye, setBye] = useState();
    const [tournament, setTournament] = useState({});
    const [showTournament, setShowTournament] = useState(false);
    const isEditor = (user && user.superAdmin) || (user && user.organizations[orgId] && 
        user.organizations[orgId].adminLevel <= 2);
    const navigate = useNavigate();

    const newGameObj = useMemo(() => {
                        return {team1Id: '',
                                team2Id: '',
                                gameDate: null,
                                gameTime: null,
                                gameLocation: '',
                                team1Score: null,
                                team2Score: null,
                                notes: ''};
    }, []);


    useEffect(() => {
        async function getSeason() {
            try {
                let [seasonResult, gamesResult, teamsResult] = await Promise.all([
                    SportyApi.getSeason(orgId, seasonId),
                    SportyApi.getGames(orgId, seasonId),
                    SportyApi.getTeams(orgId, seasonId)
                ]);
                if (seasonResult.tournamentFor) {
                    navigate(`/organization/${orgId}/tournaments/${seasonId}`, {state: {games: gamesResult, season: seasonResult}});
                } else {
                    teamsResult = getTeams(teamsResult);
                    const {teams, rankings} = getRankings(gamesResult, teamsResult);
                    setSeason({seasonId: seasonResult.seasonId, 
                                title: seasonResult.title, 
                                games: gamesResult,
                                teams,
                                rankings, 
                                seasonTournament: seasonResult.seasonTournament});
                    setGames(gamesResult);
                    setTitle({seasonTitle: seasonResult.title});
                    setNewGame({games: [newGameObj], teams});
                    setBye(parseInt(Object.keys(teams).find(key => teams[key].teamName === 'Bye')));
                    };
            } catch (e) {
                getApiErrors(e);
                try {
                    let [seasonResult, teamsResult] = await Promise.all([
                        SportyApi.getSeason(orgId, seasonId),
                        SportyApi.getTeams(orgId, seasonId)
                    ]);
                    teamsResult = getTeams(teamsResult);
                    const {teams, rankings} = getRankings([], teamsResult);
                    setSeason({seasonId: seasonResult.seasonId, 
                                title: seasonResult.title, 
                                games: [],
                                teams,
                                rankings, 
                                seasonTournament: seasonResult.seasonTournament});
                    setGames([]);
                    setTitle({seasonTitle: seasonResult.title});
                    setNewGame({games: [newGameObj], teams});
                    setBye(parseInt(Object.keys(teams).find(key => teams[key].teamName === 'Bye')));
                } catch (err) {
                    getApiErrors(err);
                    navigate(`/organization/${orgId}`);
                };
            };
        };
        getSeason(orgId, seasonId);
        setIsLoading(false);
    }, [orgId, seasonId, setSeason, getApiErrors, navigate, setTitle, setNewGame, newGameObj]);


    const deleteModal = (e) => {
        e.preventDefault();
        setModal(!modal);
    };


    const deleteSeason = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await SportyApi.removeSeason(orgId, season.seasonId);
        } catch (err) {
            getApiErrors(err);
        };
        setIsLoading(false);
        navigate(`/organization/${orgId}`);
    };


    const toggleEdit = (e) => {
        e.preventDefault();
        setEditForm(!editForm);
    };


    const toggleAdd = (e) => {
        e.preventDefault();
        if (!addGame) {
            setNewGame({games: [newGameObj], teams: season.teams});
        };
        setAddGame(!addGame);
    };


    const handleGameChange = (e) => {
        let {name, value} = e.target;
        name = name.split(' ');
        let games = newGame.games;
        games = {...games,
                        [name[1]]: {
                            ...games[name[1]],
                            [name[0]]: value
                        }};
        setNewGame(d => ({...d, games}));
    };


    const nullScore = (e) => {
        e.preventDefault();
        const gameData = {0: {...newGame.games[0],
                            team1Score: null,
                            team2Score: null}};
        setNewGame({...newGame, games: gameData});
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrorsNewGame({});

        if (!validateGames(newGame.games, setErrors)) return false;
        let gameToAdd = formatInputs(newGame.games);
        gameToAdd = {games: [gameToAdd[0]]};
        setIsLoading(true);

        try {
            gameToAdd = await SportyApi.addGames(gameToAdd, orgId, seasonId);
            updateState(gameToAdd);
            setAddGame(false);
            setIsLoading(false);
        } catch (err) {
            getApiErrorsNewGame(err);
            setIsLoading(false);
        };
    };


    const updateState = (gameToAdd) => {
        const allGames = [...season.games, gameToAdd[0]];
        const updatedTeam1Games = [...season.teams[gameToAdd[0].team1Id].games, gameToAdd[0]];
        const updatedTeam2Games = [...season.teams[gameToAdd[0].team2Id].games, gameToAdd[0]];
        const updatedTeam1 = {...season.teams[gameToAdd[0].team1Id], 
                                games: updatedTeam1Games};
        const updatedTeam2 = {...season.teams[gameToAdd[0].team2Id], 
                                games: updatedTeam2Games};
        const updatedTeams = {...season.teams, 
                                [gameToAdd[0].team1Id]: updatedTeam1, 
                                [gameToAdd[0].team2Id]: updatedTeam2};
        const updatedSeason = {...season, games: allGames, teams: updatedTeams};
        setSeason(updatedSeason);
        const currentGames = [...games, gameToAdd[0]];
        setGames(currentGames);
    };


    const makeTournament = (e) => {
        e.preventDefault();
        const tournament = buildTournament(season.teams, season.rankings);
        setTournament(tournament);
        setShowTournament(true);
    };


    const saveTournament = async (e) => {
        e.preventDefault();
        setApiErrors({});
        setIsLoading(true);
        try {
            const seasonData = {title: `${season.title} Tournament`, 
                                tournamentFor: season.seasonId};
            const {seasonId} = await SportyApi.addSeason(seasonData, orgId);
            let teamsMinusBye = Object.keys(season.teams).filter(
                                    id => season.teams[id].teamName !== 'Bye');
            const teamNames = [];
            for (let key of teamsMinusBye) {
                teamNames.push({teamName: season.teams[key].teamName, color: season.teams[key].color});
            };
            teamsMinusBye = teamsMinusBye.map(id => ({teamId: +id}));
            const [addedGames] = await Promise.all([
                SportyApi.addGames({games: tournament}, orgId, seasonId),
                SportyApi.addTeams({teamIds: teamsMinusBye, teams: teamNames}, seasonId, orgId)]);
            setIsLoading(false);
            navigate(`/organization/${orgId}/tournaments/${seasonId}`, {state: {games: addedGames, season: seasonData}});
        } catch (err) {
            setApiErrors(err);
            setIsLoading(false);
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
        <Container>
            <Col xs={{span: 10, offset: 1}} 
                md={{span: 6, offset: 3}} 
                className='seasonHead'>
                <Link to={`../organization/${orgId}`}
                        className='returnLink'>
                    Back to organization
                </Link>
                <Row className='seasonTitleRow'>
                    {!editForm &&
                        <Col as='h3' xs={12} lg={{span: 8, offset: 2}}>
                            {season.title}
                        </Col>}
                    {editForm &&
                        <SeasonNameForm data={title}
                                        handleChange={handleChange}
                                        isEdit={editForm}
                                        isMobile={isMobile}
                                        setIsEdit={setEditForm}
                                        season={season}
                                        setSeason={setSeason}
                                        toggleEdit={toggleEdit} />}
                    {isEditor && !editForm &&
                        <Col xs={12} lg={2}>
                            <Button onClick={toggleEdit}
                                    variant='outline-secondary'
                                    size='sm'
                                    className='nameEditButton'>
                                Rename
                            </Button>
                        </Col>}
                </Row>
            </Col>
            <Errors apiErrors={apiErrors} />
            <Col xs={{span: 10, offset: 1}} md={{span: 6, offset: 3}}>
                <ListGroup as='ul' variant='flush' className='teamList'>
                    {season.rankings.map(t =>
                        <ListGroup.Item key={t}
                                        className={`teamRank${season.teams[t].color}`}>
                            <Button onClick={() => setGames(season.teams[t].games)}
                                    variant='link'>
                                    {season.teams[t].teamName}
                            </Button>
                            <span>
                                {season.teams[t].record.join('-')}
                            </span>
                        </ListGroup.Item>)}
                    <ListGroup.Item className='teamRankN/A'>
                        <Button onClick={() => setGames(season.games)}
                                variant='link'>
                                Show all games
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            {!showTournament &&
                <div>
                    {isEditor && !season.seasonTournament &&
                        <Button onClick={makeTournament}
                                variant='dark'
                                className='tournamentButton'>
                            Build Tournament from Current Rankings
                        </Button>}
                    {season.seasonTournament &&
                        <Link to={`../organization/${orgId}/tournaments/${season.seasonTournament}`}
                                className='tournamentButton message'>
                            View tournament
                        </Link>}
                    {games &&
                        <GameList games={games}
                                    setGames={setGames}
                                    isEditor={isEditor}
                                    season={season}
                                    setSeason={setSeason} />}
                    {addGame &&
                        <Form onSubmit={handleSubmit}
                                className='gameContainer'>
                            <Errors apiErrors={apiErrorsNewGame}
                                    formErrors={errors} />
                            <NewGameForm g={'0'}
                                        season={newGame}
                                        handleGameChange={handleGameChange}
                                        nullScore={nullScore}
                                        bye={bye} />
                            <div className='d-grid gap-2'>
                                <Button type='submit'
                                        variant='outline-secondary'>
                                    Save
                                </Button>
                            </div>
                        </Form>}
                    {isEditor &&
                        <Row className='addDelete'>
                            <Col xs={6}>
                                <Button onClick={deleteModal}
                                        variant='danger'>
                                    Delete Season
                                </Button> 
                            </Col>
                            <Col xs={6}>
                                <Button onClick={toggleAdd}
                                        variant={addGame ? 'secondary' : 'dark'}>
                                    {addGame ? 'Cancel Add' : 'Add Game'}    
                                </Button> 
                            </Col>
                        </Row>}
                </div>}
            {modal &&
                <ModalComponent message={`Permanently delete season ${season.title}?`}
                        cancel={deleteModal}
                        confirm={deleteSeason} />}

            {showTournament &&
                <div>
                    <Button onClick={() => setShowTournament(false)}
                            variant='secondary'>
                        Back to Season
                    </Button>
                    <TournamentDisplay tournament={tournament}
                                        isMobile={isMobile} /> 
                    <Button onClick={saveTournament}
                            variant='dark'
                            className='addDelete'>
                        Save Tournament
                    </Button>
                </div>}
        </Container>
    );
};

export default SeasonHome;