import React, {useState} from 'react';
import GameEditForm from './GameEditForm';

function Game({gameProp, isEditor, season, setSeason, games, setGames}) {

    const [edit, setEdit] = useState(false);
    const [game, setGame] = useState(gameProp);

    if (game.team1Name === 'Bye' || game.team2Name === 'Bye') {
        return (
            <div>
                {!edit &&
                    <p>
                        {game.team1Name === 'Bye' ? game.team2Name : game.team1Name}
                        {' '}Bye
                    </p>}
                {edit &&
                    <GameEditForm gameProp={game}
                                    season={season}
                                    setSeason={setSeason}
                                    setEdit={setEdit}
                                    setGame={setGame}
                                    currentGames={games}
                                    setGames={setGames} />}
                {isEditor &&
                    <button onClick={() => setEdit(!edit)}>
                        {edit? 'Cancel' : 'Edit'}
                    </button>}
            </div>
            
        );
    };

    return (
        <div>
            {!edit &&
                <div>
                    <p>{game.team1Name} vs {game.team2Name}</p>
                    <p>Date: {game.readableDate || 'TBA'}</p>
                    <p>Time: {game.readableTime || 'TBA'}</p>
                    <p>Location: {game.gameLocation || 'TBA'}</p>
                    {game.team1Score !== null &&
                        <>
                            <p>{game.team1Name}: {game.team1Score} </p>
                            <p>{game.team2Name}: {game.team2Score} </p>
                        </>}
                    <p>Notes: {game.notes}</p>
                </div>}
            {edit &&
                <GameEditForm gameProp={game}
                                season={season}
                                setSeason={setSeason}
                                setEdit={setEdit}
                                setGame={setGame}
                                currentGames={games}
                                setGames={setGames} />}
            {isEditor &&
                <button onClick={() => setEdit(!edit)}>
                    {edit? 'Cancel' : 'Edit'}
                </button>}
        </div>
    );
};

export default Game;