import React from 'react';

function GameModalDetail({game}) {

    return (
        <div>
            <p>{game.team1Name || 'Team TBD'}{' '}{game.team1Score}</p>
            <p>{game.readableDate || 'Date TBA'}{' '}{game.readableTime || 'Time TBA'}</p>
            <p>{game.gameLocation || 'Location TBA'}</p>
            <p>Notes: {game.notes}</p>
            <p>{game.team2Name || 'Team TBD'}{' '}{game.team2Score}</p>
        </div>
    );
};

export default GameModalDetail;