import React from 'react';

function TournamentGame({game, isEditor, setPopupGame, height}) {

    const handlePopup = (edit) => {
        setPopupGame({display: true, edit, game});
    };

    return (
        <>
        {game &&
            <div className='tournamentGame' 
                style={{height: `${height}%`}}>
                <p className='gameTeamTop'>{game.team1Name}{' '}{game.team1Score}</p>
                <div className='gameMiddle'>
                {game.gameId &&
                    <button onClick={() => handlePopup(false)}>Details</button>}
                {game.gameId && isEditor &&
                    <button onClick={() => handlePopup(true)}>Edit</button>}
                </div>
                <p className='gameTeamBottom'>{game.team2Name}{' '}{game.team2Score}</p>
            </div>}
        </>
    );
};

export default TournamentGame;