import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useHandleChange, useErrors} from './hooks';
import { validateGames, formatInputs, formatTime, getTeams } from './static/helpers';
import Errors from './Errors';
import Modal from './Modal';
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
            const teamsArray = formatSeasonTeams(season.teams);
            const {teams, rankings} = getTeams(updatedSeason.games, teamsArray);
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
            const teamsArray = formatSeasonTeams(season.teams);
            const {teams, rankings} = getTeams(games, teamsArray);
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
        return <p>Loading</p>
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor={`team1Id`}>
                    <select value={data.team1Id}
                            onChange={handleChange}
                            name={`team1Id`}>
                        <option value={''}>Select Team</option>
                        {Object.keys(season.teams).map(t =>
                            <option value={t}
                                    key={t}>
                                {season.teams[t].teamName}
                            </option>)}
                    </select>
                </label>
                <label htmlFor={`team2Id`}>
                    vs
                    <select value={data.team2Id}
                            onChange={handleChange}
                            name={`team2Id`}>
                        <option value={''}>Select Team</option>
                        {Object.keys(season.teams).map(t =>
                            <option value={t}
                                    key={t}>
                                {season.teams[t].teamName}
                            </option>)}
                    </select>
                </label>
                <label htmlFor='gameDate'>
                    Date: 
                    <input type='date'
                            name={`gameDate`}
                            value={data.gameDate || ''}
                            onChange={handleChange} />
                </label>
                {parseInt(data.team1Id) !== bye && 
                parseInt(data.team2Id) !== bye &&
                    <>
                        <label htmlFor={`gameTime`}>
                            Time: 
                            <input type='time'
                                    name={`gameTime`}
                                    value={data.gameTime || ''}
                                    onChange={handleChange} />
                        </label>
                        <label htmlFor={`gameLocation`}>
                            Location: 
                            <input type='text'
                                    name={`gameLocation`}
                                    value={data.gameLocation}
                                    onChange={handleChange} />
                        </label>
                        <label htmlFor={`team1Score`}>
                        {data.team1Id ? `${season.teams[data.team1Id].teamName} Score` : 'Score 1'}
                            <input type='number'
                                    min='0'
                                    max='999'
                                    name={`team1Score`}
                                    value={data.team1Score !== null ? data.team1Score : ''}
                                    onChange={handleChange} />
                        </label>
                        <label htmlFor={`team2Score`}>
                            {data.team2Id ? `${season.teams[data.team2Id].teamName} Score` : 'Score 2'}
                            <input type='number'
                                    min='0'
                                    max='999'
                                    name={`team2Score`}
                                    value={data.team2Score !== null ? data.team2Score : ''}
                                    onChange={handleChange} />
                        </label>
                        <button onClick={nullScore}>Remove Score</button>
                    </>
                }
                <label htmlFor={`notes`}>
                    Notes: 
                    <textarea
                        name={`notes`}
                        value={data.notes}
                        onChange={handleChange} />
                    </label>
                <button type='submit'>Save</button>
                <button onClick={gameProp.team1Score ? deleteModal : deleteGame}>Delete Game</button>
                <Errors apiErrors={apiErrors}
                        formErrors={errors} />
            </form>
            {modal &&
                <Modal message={'Score already entered for game.  Are you sure you want to delete?'}
                        cancel={deleteModal}
                        confirm={deleteGame} />}
        </div>
    );
};

export default GameEditForm;