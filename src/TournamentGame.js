import React from 'react';

function TournamentGame({game, isEditor, setPopupGame}) {

    const handlePopup = (edit) => {
        setPopupGame({display: true, edit, game});
    };

    return (
        <div>
            <p>{game.tournamentGame}</p>
            <p>{game.team1Name}{' '}{game.team1Score}</p>
            <button onClick={() => handlePopup(false)}>Details</button>
            {isEditor &&
                <button onClick={() => handlePopup(true)}>Edit</button>}
            <p>{game.team2Name}{' '}{game.team2Score}</p>
        </div>
    );
};

export default TournamentGame;