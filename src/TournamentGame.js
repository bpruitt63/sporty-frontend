import React from 'react';
import detail_icon from './static/images/detail_icon.svg';
import edit_icon from './static/images/edit_icon.svg';

function TournamentGame({game, isEditor, setPopupGame, height}) {

    const handlePopup = (edit) => {
        setPopupGame({display: true, edit, game});
    };


    return (
        <>
        {game &&
            <div className={game.gameId === 'dummy' ? `tournamentGame hidden`
                                                    : 'tournamentGame'}
                style={{height: `${height}%`}}>
                <p className='gameTop'>
                    <span className={!game.team1Name ? 'hidden' 
                                    : `gameTeam tournamentGame${game.team1Color}`}>
                        {game.team1Name || 'filler'}
                    </span>
                    <span>
                        {game.team1Score}
                    </span>
                </p>
                <div className='gameMiddle'>
                    <button onClick={game.gameId ? () => handlePopup(false) : null}
                            className={`imgButton${!game.gameId ? ' hidden' : ''}`}>
                        <img src={detail_icon} 
                            alt='More Details'
                            className={`tournamentIcon${!game.gameId ? ' hidden' : ''}`}/>
                    </button>
                    <button onClick={game.gameId && isEditor ? () => handlePopup(true) : null}
                            className={`imgButton${!game.gameId ? ' hidden' : ''}`}>
                        <img src={edit_icon} 
                            alt='Edit'
                            className={`tournamentIcon${!game.gameId || !isEditor ? ' hidden' : ''}`}/>
                    </button>
                </div>
                <p className='gameBottom'>
                    <span className={!game.team2Name ? 'hidden' 
                                    : `gameTeam tournamentGame${game.team2Color}`}>
                        {game.team2Name || 'filler'}
                    </span>
                    <span>
                        {game.team2Score}
                    </span>
                </p>
            </div>}
        </>
    );
};

export default TournamentGame;