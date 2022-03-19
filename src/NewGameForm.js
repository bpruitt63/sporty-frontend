import React from 'react';

function NewGameForm({g, season, handleGameChange, nullScore, bye}) {

    return (
        <div>
            <label htmlFor={`team1Id ${g}`}>
                <select value={season.games[g].team1Id}
                        onChange={handleGameChange}
                        name={`team1Id ${g}`}
                        id={`team1Id ${g}`}>
                    <option value={''}>Select Team</option>
                    {season.teams.map(t =>
                        <option value={t.teamId}
                                key={t.teamId}>
                            {t.teamName}
                        </option>)}
                </select>
            </label>
            <label htmlFor={`team2Id ${g}`}>
                vs
                <select value={season.games[g].team2Id}
                        onChange={handleGameChange}
                        name={`team2Id ${g}`}
                        id={`team2Id ${g}`}>
                    <option value={''}>Select Team</option>
                    {season.teams.map(t =>
                        <option value={t.teamId}
                                key={t.teamId}>
                            {t.teamName}
                        </option>)}
                </select>
            </label>
            <label htmlFor={`gameDate ${g}`}>
                Date
                <input type='date'
                        name={`gameDate ${g}`}
                        id={`gameDate ${g}`}
                        value={season.games[g].gameDate || ''}
                        onChange={handleGameChange} />
            </label>
            {parseInt(season.games[g].team1Id) !== bye && 
             parseInt(season.games[g].team2Id) !== bye &&
                <>
                    <label htmlFor={`gameTime ${g}`}>
                        Time
                        <input type='time'
                                name={`gameTime ${g}`}
                                id={`gameTime ${g}`}
                                value={season.games[g].gameTime || ''}
                                onChange={handleGameChange} />
                    </label>
                    <label htmlFor={`gameLocation ${g}`}>
                        Game Location
                        <input type='text'
                                name={`gameLocation ${g}`}
                                id={`gameLocation ${g}`}
                                placeholder='Location'
                                value={season.games[g].gameLocation}
                                onChange={handleGameChange} />
                    </label>
                    <label htmlFor={`team1Score ${g}`}>
                        {season.games[g].team1Id ? 
                            `${season.teams.find(team => team.teamId === parseInt(season.games[g].team1Id)).teamName} Score`
                            : 'Score 1'}
                        <input type='number'
                                min='0'
                                max='999'
                                name={`team1Score ${g}`}
                                id={`team1Score ${g}`}
                                value={season.games[g].team1Score || ''}
                                onChange={handleGameChange} />
                    </label>
                    <label htmlFor={`team2Score ${g}`}>
                        {season.games[g].team2Id ?
                            `${season.teams.find(team => team.teamId === parseInt(season.games[g].team2Id)).teamName} Score`
                            : 'Score 2'}
                        <input type='number'
                                min='0'
                                max='999'
                                name={`team2Score ${g}`}
                                id={`team2Score ${g}`}
                                value={season.games[g].team2Score || ''}
                                onChange={handleGameChange} />
                    </label>
                    <button id={g} onClick={nullScore}>Remove Score</button>
                </>}
            <label htmlFor={`notes ${g}`}>
                Notes
                <textarea
                        name={`notes ${g}`}
                        id={`notes ${g}`}
                        placeholder='Notes'
                        value={season.games[g].notes}
                        onChange={handleGameChange} />
            </label>
        </div>
    );
};

export default NewGameForm;