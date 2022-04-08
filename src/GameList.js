import React from 'react';
import Game from './Game';

function GameList({games, setGames = null, isEditor=false, season={}, setSeason=null}) {

    return (
        <div className='gameList'>
            {games.map(g =>
                <Game key={g.gameId || `game ${games.indexOf(g)}`} 
                    gameProp={g}
                    isEditor={isEditor}
                    season={season}
                    setSeason={setSeason}
                    games={games}
                    setGames={setGames} />)}
        </div>
    );
};

export default GameList;