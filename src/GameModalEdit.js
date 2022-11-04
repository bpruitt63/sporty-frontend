import React, {useState} from 'react';
import {Button} from 'react-bootstrap';

function GameModalEdit({game, data, handleChange, canEditScore, nullScore}) {

    const [canEditScores] = useState(canEditScore(game));

    

    return (
        <div>
            <form onSubmit={() => console.log(data)}>
                <p>
                    {game.team1Name || 'Team TBD'}
                        <span>{game.team1Id && game.team2Id && canEditScores &&
                            <input type='number'
                                    min='0'
                                    max='999'
                                    name={`team1Score`}
                                    value={data.team1Score !== null ? data.team1Score : ''}
                                    onChange={handleChange} />
                        }</span>
                </p>
                <input type='date'
                        name='gameDate'
                        value={data.gameDate || ''}
                        onChange={handleChange} />
                <input type='time'
                        name='gameTime'
                        value={data.gameTime || ''}
                        onChange={handleChange} />
                <label htmlFor='gameLocation'>Location</label>
                <input type='text'
                        name={`gameLocation`}
                        value={data.gameLocation || ''}
                        onChange={handleChange} />
                <label htmlFor='notes'>Notes</label>
                <textarea
                        rows={3}
                        name='notes'
                        value={data.notes || ''}
                        onChange={handleChange} />
                {game.team1Id && game.team2Id && canEditScores &&
                    <Button onClick={nullScore}
                            variant='outline-secondary'>
                            Remove Score
                    </Button>}
                <p>
                    {game.team2Name || 'Team TBD'}
                        <span>{game.team1Id && game.team2Id && canEditScores &&
                            <input type='number'
                                    min='0'
                                    max='999'
                                    name={`team2Score`}
                                    value={data.team2Score !== null ? data.team2Score : ''}
                                    onChange={handleChange} />
                        }</span>
                </p>
            </form>
        </div>
    );
};

export default GameModalEdit;