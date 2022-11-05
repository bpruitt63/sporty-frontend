import React from 'react';

function TournamentGame({game, isEditor, setPopupGame}) {

    const handlePopup = (edit) => {
        setPopupGame({display: true, edit, game});
    };

    return (
        <>
        {game &&
            <div>
                <p>{game.tournamentGame}</p>
                <p>{game.team1Name}{' '}{game.team1Score}</p>
                {game.gameId &&
                    <button onClick={() => handlePopup(false)}>Details</button>}
                {game.gameId && isEditor &&
                    <button onClick={() => handlePopup(true)}>Edit</button>}
                <p>{game.team2Name}{' '}{game.team2Score}</p>
            </div>}
        </>
    );
};

export default TournamentGame;