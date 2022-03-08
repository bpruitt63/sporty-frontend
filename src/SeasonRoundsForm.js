import React, {useState} from 'react';
import { buildSeason } from './static/helpers';
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
            let teams = Object.values(season.teams);
            teams.push({teamName: 'Bye', color: 'N/A'});
            const numGames = season.rounds * (Math.floor(teams.length / 2));
            const games = {};
            for (let game = 1; game <= numGames; game++) {
                games[game] = newGame;
            };
            try {
                const {seasonId} = await SportyApi.addSeason(season.seasonTitle, orgId);
                teams = await SportyApi.addTeams({teams}, seasonId, orgId);
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
        return <p>Loading</p>
    };

    return (
        <>
            <Errors apiErrors={apiErrors} />
            {orgId &&
                <div>
                    <label>
                        <input type='radio' 
                                name='manual'
                                checked={season.generateGames}
                                onChange={() => handleRadio(true)} />
                        Automatically Generate Season
                    </label>
                    <label>
                        <input type='radio' 
                                name='manual'
                                checked={!season.generateGames}
                                onChange={() => handleRadio(false)} />
                        Manually Enter Season Info
                    </label>
                </div>}
            <form onSubmit={handleSubmitRounds}>
                <label htmlFor='rounds'>Number of Weeks/Rounds</label>
                <input type='number'
                        name='rounds'
                        id='rounds'
                        min='1'
                        max='100'
                        value={season.rounds}
                        onChange={handleChange} />
                <button type='submit'>
                    {orgId ? 'Next' : 'Generate Season'}
                </button>
                <button onClick={() => toggle('seasonTeams')}>
                    Back
                </button>
            </form>
        </>
    );
};

export default SeasonRoundsForm;