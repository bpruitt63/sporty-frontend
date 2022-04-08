import React, {useState} from 'react';
import {Row, Col, Button} from 'react-bootstrap';
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
        <div className='gameContainer'>
            {!edit && 
                <div>
                    <Row className='gameTime'>
                        <Col xs={12} md={6}>
                            {game.readableDate || 'Date TBA'}
                        </Col>
                        <Col xs={12} md={6}>
                            {game.readableTime || 'Time TBA'}
                        </Col>
                    </Row>
                    <Row className='matchup'>
                        <Col xs={12} md={5} className={`matchup${game.team1Color}`}>
                            {game.team1Name}
                            <p className='score'>{game.team1Score}</p>
                        </Col>
                        <Col xs={12} md={2} className='vs'>
                            vs 
                        </Col>
                        <Col xs={12} md={5} className={`matchup${game.team2Color}`}>
                            {game.team2Name}
                            <p className='score'>{game.team2Score}</p>
                        </Col>
                    </Row>
                    <p className='location'>{game.gameLocation || 'Location TBA'}</p>
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
            <div className='d-grid gap-2'>
                <Button onClick={() => setEdit(!edit)}
                        variant='outline-secondary'>
                    {edit? 'Cancel' : 'Edit'}
                </Button></div>}
        </div>
    );
};

export default Game;