import React, {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useErrors } from './hooks';
import { validateGames, formatInputs } from './static/helpers';
import NewGameForm from './NewGameForm';
import Errors from './Errors';

function ManualSeasonForm({season, setSeason, gamesToDatabase}) {

    const {orgId} = useParams();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const navigate = useNavigate();

    const bye = season.teams.find(t => t.teamName === 'Bye').teamId;
    
    const newGame = {team1Id: '',
                        team2Id: '',
                        gameDate: null,
                        gameTime: null,
                        gameLocation: '',
                        team1Score: null,
                        team2Score: null,
                        notes: ''};

    const handleGameChange = (e) => {
        let {name, value} = e.target;
        name = name.split(' ');
        let games = season.games;
        games = {...games,
                        [name[1]]: {
                            ...games[name[1]],
                            [name[0]]: value
                        }};
        setSeason(d => ({...d, games}));
    };
    
    const changeNumberOfGames = (moreLess) => {
        const games = season.games;
        const keys = Object.keys(season.games);
        moreLess === 'less' ? delete games[keys[keys.length - 1]]
                    : games[keys.length + 1] = newGame;
        setSeason({...season, games});
    };

    const nullScore = (e) => {
        e.preventDefault();
        const {id} = e.target;
        const games = {...season.games}
        games[id] = {...games[id],
                team1Score: null,
                team2Score: null}
        setSeason({...season, games});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});

        if (!validateGames(season.games, setErrors)) return false;
        const games = formatInputs(season.games);
        setIsLoading(true);

        try {
            await gamesToDatabase(Object.values(games));
            setSeason({...season, games});
            navigate(`/organization/${orgId}/seasons/${season.seasonId}`);
        } catch (err) {
            getApiErrors(err);
            setIsLoading(false);
        };
    };

    if (isLoading) {
        return <p>Loading</p>
    };

    return (
        <div>
            <Errors formErrors={errors}
                    apiErrors={apiErrors} />
            <form onSubmit={handleSubmit}>
                {Object.keys(season.games).map(g =>
                    <NewGameForm key={g}
                                    g={g}
                                    season={season}
                                    handleGameChange={handleGameChange}
                                    nullScore={nullScore}
                                    bye={bye} />)}
                <button type='submit'>Save Season</button>
            </form>
            <button onClick={() => changeNumberOfGames('more')}>Add Game</button>
            <button onClick={() => changeNumberOfGames('less')}>Remove Last Game</button>
        </div>
    );
};

export default ManualSeasonForm;