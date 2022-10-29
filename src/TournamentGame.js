import React from 'react';

function TournamentGame({game}) {

    return (
        <div>{console.log(game)}
            <p>{game.tournamentGame}</p>
            <p>{game.team1Name}{' '}{game.team1Score}</p>
            <p>{game.team2Name}{' '}{game.team2Score}</p>
        </div>
    );
};

export default TournamentGame;