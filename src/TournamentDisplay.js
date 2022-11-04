import React, {useState, useEffect} from 'react';
import { Col, Row } from 'react-bootstrap';
import TournamentRound from './TournamentRound';
import GameModal from './GameModal';

function TournamentDisplay({tournament={}, isEditor=false, updateGame=null}) {

    const [orderedRounds, setOrderedRounds] = useState(Object.keys(tournament));
    const [popupGame, setPopupGame] = useState({display: false, edit: false, game: {}});

    useEffect(() => {
        function orderRounds() {
            const rounds = Object.keys(tournament);
            for (let i = 0; i < rounds.length; i++) rounds[i] = rounds[i].split(' ');
            rounds.sort((a, b) => a[1] - b[1]);
            for (let i = 0; i < rounds.length; i++) rounds[i] = rounds[i].join(' ');
            setOrderedRounds(rounds);
        };
        orderRounds(tournament);
    }, [tournament, setOrderedRounds]);


    const canEditScore = (game) => {
        const nextRound = `Round ${game.tournamentRound + 1}`;
        if (tournament[nextRound]) {
            const nextRoundSize = Object.keys(tournament[nextRound]).length;
            const nextGame = game.tournamentGame <= nextRoundSize ? game.tournamentGame
                            : (nextRoundSize + 1) - (game.tournamentGame - nextRoundSize);
            if (tournament[nextRound][`Game ${nextGame}`].team1Score) return false;
        };
        return true;
    };


    return (
        <Row>
            {popupGame.display && 
                <GameModal game={popupGame.game} 
                            edit={popupGame.edit} 
                            setPopupGame={setPopupGame}
                            isEditor={isEditor}
                            canEditScore={canEditScore}
                            updateGame={updateGame} />}
            {orderedRounds.map(r => 
                <Col style={{backgroundColor: 'white'}} key={r} xs={1}><TournamentRound key={r} round={tournament[r]} isEditor={isEditor} setPopupGame={setPopupGame} /></Col>)}
        </Row>
    );
};

export default TournamentDisplay;