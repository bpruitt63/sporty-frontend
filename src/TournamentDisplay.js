import React, {useState, useEffect} from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import './static/styles/Tournament.css';
import TournamentRound from './TournamentRound';
import GameModal from './GameModal';

function TournamentDisplay({tournament={}, isEditor=false, updateGame=null, isMobile}) {

    const [orderedRounds, setOrderedRounds] = useState(Object.keys(tournament));
    const [popupGame, setPopupGame] = useState({display: false, edit: false, game: {}});
    const [mobileRound, setMobileRound] = useState(1);
    const [winner, setWinner] = useState(null);
    const [playInRound, setPlayInRound] = useState(null);

    useEffect(() => {
        function orderRounds() {
            const rounds = Object.keys(tournament);
            for (let i = 0; i < rounds.length; i++) rounds[i] = rounds[i].split(' ');
            rounds.sort((a, b) => a[1] - b[1]);
            for (let i = 0; i < rounds.length; i++) rounds[i] = rounds[i].join(' ');
            if (rounds.length) {
                const lastGame = tournament[rounds[rounds.length - 1]]['Game 1'];
                if (lastGame.team1Score) {
                    setWinner(lastGame.team1Score > lastGame.team2Score ? 
                                lastGame.team1Name : lastGame.team2Name);
                };
            };
            if (rounds[0].length !== rounds[1].length * 2) {
                setPlayInRound(rounds[0]);
                setOrderedRounds(rounds.slice(1));
            } else {
                setOrderedRounds(rounds);
            };
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
        <Container className='tournamentContainer'>
            <Row>
                {popupGame.display && 
                    <GameModal game={popupGame.game} 
                                edit={popupGame.edit} 
                                setPopupGame={setPopupGame}
                                isEditor={isEditor}
                                canEditScore={canEditScore}
                                updateGame={updateGame} />}
                {!isMobile ? 
                    <>
                        {playInRound && 
                            <Col className='tournamentCol'>
                                <TournamentRound round={tournament[playInRound]} 
                                                isEditor={isEditor} 
                                                setPopupGame={setPopupGame}/>
                            </Col>}
                        {orderedRounds.map(r => 
                            <Col key={r} className='tournamentCol'>
                                <TournamentRound round={tournament[r]} 
                                                isEditor={isEditor} 
                                                setPopupGame={setPopupGame}/>
                            </Col>)}
                            <Col className='tournamentCol'>
                                <p className='winner'>
                                    {winner || ''}
                                </p>
                            </Col>
                    </>
                    :
                    <>
                        <div className='prevNextButtons'>
                            <Button onClick={() => setMobileRound(mobileRound - 1)}
                                    variant='outline-secondary'
                                    className={mobileRound === 1 ? 'hidden' : ''}>
                                {'< Prev'}
                            </Button>
                            <Button onClick={() => setMobileRound(mobileRound + 1)}
                                    variant='outline-secondary'
                                    className={!tournament[`Round ${mobileRound}`] ? 'hidden' : ''}>
                                {`Next >`}
                            </Button>
                        </div>
                        {tournament[`Round ${mobileRound}`] ?
                            <TournamentRound round={tournament[`Round ${mobileRound}`]}
                                        isEditor={isEditor}
                                        setPopupGame={setPopupGame} />
                            :
                            <p>{winner || ''}</p>}
                    </>
                }
            </Row>
        </Container>
    );
};

export default TournamentDisplay;