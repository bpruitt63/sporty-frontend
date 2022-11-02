import React from 'react';

function TournamentGame({game, isEditor, setPopupGame}) {

    const handlePopup = (type) => {
        setPopupGame({display: true, type, game});
    };

    return (
        <div>
            <p>{game.tournamentGame}</p>
            <p>{game.team1Name}{' '}{game.team1Score}</p>
            <button onClick={() => handlePopup('details')}>Details</button>
            {isEditor &&
                <button onClick={() => handlePopup('edit')}>Edit</button>}
            <p>{game.team2Name}{' '}{game.team2Score}</p>
        </div>
    );
};

export default TournamentGame;