import React from 'react';

function TournamentGame({game}) {

    return (
        <div>
            <p>{game.tournamentGame}</p>
            <p>{game.team1Name}{' '}{game.team1Score}</p>
            <p>{game.team2Name}{' '}{game.team2Score}</p>
        </div>
    );
};

export default TournamentGame;