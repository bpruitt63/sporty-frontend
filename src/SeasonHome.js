import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useErrors, useHandleChange} from './hooks';
import {getTeams, validateGames, formatInputs} from './static/helpers';
import SportyApi from './SportyApi';
import Errors from './Errors';
import GameList from './GameList';
import SeasonNameForm from './SeasonNameForm';
import Modal from './Modal';
import NewGameForm from './NewGameForm';

function SeasonHome({user}) {

    const {seasonId} = useParams();
    const {orgId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [season, setSeason] = useState({seasonId, title: '', games: []});
    const [apiErrors, getApiErrors] = useErrors();
    const [apiErrorsNewGame, getApiErrorsNewGame, setApiErrorsNewGame] = useErrors();
    const [errors, setErrors] = useState({});
    const [games, setGames] = useState();
    const [editForm, setEditForm] = useState(false);
    const [title, handleChange, setTitle] = useHandleChange();
    const [modal, setModal] = useState(false);
    const [addGame, setAddGame] = useState(false);
    const [newGame, setNewGame] = useState();
    const [bye, setBye] = useState();
    const isEditor = user.superAdmin || (user.organizations[orgId] && 
        user.organizations[orgId].adminLevel <= 2);
    const navigate = useNavigate();


    useEffect(() => {
        async function getSeason() {
            try {
                const result = await SportyApi.getGames(orgId, seasonId);
                const {teams, rankings} = getTeams(result);
                setSeason({seasonId: result[0].seasonId, 
                            title: result[0].title, 
                            games: result,
                            teams,
                            rankings});
                setGames(result);
                setTitle({seasonTitle: result[0].title});
                const newGameTeams = [];
                for (let team of Object.entries(teams)) {
                    team = {...team[1], teamId: team[0]};
                    newGameTeams.push(team);
                };
                const newGameObj = {team1Id: '',
                        team2Id: '',
                        gameDate: null,
                        gameTime: null,
                        gameLocation: '',
                        team1Score: null,
                        team2Score: null,
                        notes: ''};
                setNewGame({games: [newGameObj], teams: newGameTeams});
                setBye(Object.keys(teams).find(key => teams[key].teamName === 'Bye'));
                setIsLoading(false);
            } catch (e) {
                getApiErrors(e);
                try {
                    const result = await SportyApi.getSeason(orgId, seasonId);
                    setSeason({seasonId: result.seasonId, title: result.title, games: []});
                    setIsLoading(false);
                } catch (err) {
                    getApiErrors(err);
                    navigate(`/organization/${orgId}`);
                };
            };
        };
        getSeason(orgId, seasonId);
    }, [orgId, seasonId, setSeason, getApiErrors, navigate, setTitle, setNewGame]);


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
            const newGameTeams = [];
            for (let team of Object.entries(season.teams)) {
                const formatted = {...team[1], teamId: team[0]};
                newGameTeams.push(formatted);
            };
            const newGameObj = {team1Id: '',
                    team2Id: '',
                    gameDate: null,
                    gameTime: null,
                    gameLocation: '',
                    team1Score: null,
                    team2Score: null,
                    notes: ''};
            setNewGame({games: [newGameObj], teams: newGameTeams});
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
            setIsLoading(false);
            setAddGame(false);
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


    if (isLoading) {
        return <p>Loading</p>
    };


    if (!season.games[0]) {
        return (
            <div>
                <p>No games found for {season.title}</p>
                {addGame &&
                    <form onSubmit={handleSubmit}>
                        <Errors apiErrors={apiErrorsNewGame}
                                formErrors={errors} />
                        <NewGameForm g={'0'}
                                    season={newGame}
                                    handleGameChange={handleGameChange}
                                    nullScore={nullScore}
                                    bye={bye} />
                        <button type='submit'>Save</button>
                    </form>}
                {isEditor &&
                    <button onClick={toggleAdd}>
                        {addGame ? 'Cancel' : 'Add Game'}    
                    </button>}
                {isEditor &&
                    <button onClick={deleteModal}>Delete Season</button>}
                {modal &&
                <Modal message={`Permanently delete season ${season.title}?`}
                        cancel={deleteModal}
                        confirm={deleteSeason} />}
            </div>
        );
    };


    return (
        <div>
            {!editForm &&
                <p>{season.title}</p>}
            {editForm &&
                <SeasonNameForm data={title}
                                handleChange={handleChange}
                                isEdit={editForm}
                                setIsEdit={setEditForm}
                                season={season}
                                setSeason={setSeason} />}
            <button onClick={toggleEdit}>
                {editForm ? 'Cancel' : 'Edit Season Name'}
            </button>
            <Errors apiErrors={apiErrors} />
            <ul>
                {season.rankings.map(t =>
                    <li key={t}>
                        <button onClick={() => setGames(season.teams[t].games)}>
                                {season.teams[t].teamName}
                        </button>
                        <p>
                            {season.teams[t].record.join('-')}
                        </p>
                    </li>)}
                <li>
                    <button onClick={() => setGames(season.games)}>
                            Show all games
                    </button>
                </li>
            </ul>
            <Link to={`../organization/${orgId}`}>Back to organization</Link>
            {games &&
                <GameList games={games}
                            setGames={setGames}
                            isEditor={isEditor}
                            season={season}
                            setSeason={setSeason} />}
            {addGame &&
                <form onSubmit={handleSubmit}>
                    <Errors apiErrors={apiErrorsNewGame}
                            formErrors={errors} />
                    <NewGameForm g={'0'}
                                season={newGame}
                                handleGameChange={handleGameChange}
                                nullScore={nullScore}
                                bye={bye} />
                    <button type='submit'>Save</button>
                </form>}
            {isEditor &&
                <button onClick={toggleAdd}>
                    {addGame ? 'Cancel' : 'Add Game'}    
                </button>}
            {isEditor && 
                <button onClick={deleteModal}>Delete Season</button>}
            {modal &&
                <Modal message={`Permanently delete season ${season.title}?`}
                        cancel={deleteModal}
                        confirm={deleteSeason} />}
        </div>
    );
};

export default SeasonHome;