import React from 'react';

function GameModalEdit({game, data, handleChange}) {

    return (
        <div>
            {console.log(data)}
            <p>{game.team1Name || 'TBD'}{' '}{game.team1Score}</p>
            <p>{game.readableDate || 'Date TBA'}{' '}{game.readableTime || 'Time TBA'}</p>
            <p>{game.gameLocation || 'Location TBA'}</p>
            <p>Notes: {game.notes}</p>
            <p>{game.team2Name || 'TBD'}{' '}{game.team2Score}</p>
        </div>
    );
};

export default GameModalEdit;