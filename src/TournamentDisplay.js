import React, {useState, useEffect} from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import './static/styles/Tournament.css';
import TournamentRound from './TournamentRound';
import GameModal from './GameModal';

function TournamentDisplay({tournament={}, isEditor=false, updateGame=null, isMobile, winner=null, setWinner=null}) {

    const [orderedRounds, setOrderedRounds] = useState(Object.keys(tournament));
    const [popupGame, setPopupGame] = useState({display: false, edit: false, game: {}});
    const [mobileRound, setMobileRound] = useState(1);
    const [playInRound, setPlayInRound] = useState(null);

    useEffect(() => {
        function orderRounds() {
            const rounds = Object.keys(tournament);
            for (let i = 0; i < rounds.length; i++) rounds[i] = rounds[i].split(' ');
            rounds.sort((a, b) => a[1] - b[1]);
            for (let i = 0; i < rounds.length; i++) rounds[i] = rounds[i].join(' ');
            if (rounds.length) {
                const lastGame = tournament[rounds[rounds.length - 1]]['Game 1'];
                if (setWinner && lastGame.team1Score !== null) {
                    setWinner({teamName : lastGame.team1Score > lastGame.team2Score ? 
                                lastGame.team1Name : lastGame.team2Name,
                            color: lastGame.team1Score > lastGame.team2Score ? 
                            lastGame.team1Color : lastGame.team2Color});
                };
            };
            if (!tournament['Round 2']) {
                setOrderedRounds(rounds);
            } else if (Object.keys(tournament[rounds[0]])?.length !== Object.keys(tournament[rounds[1]])?.length * 2) {
                setPlayInRound(rounds[0]);
                setOrderedRounds(rounds.slice(1));
            } else {
                setOrderedRounds(rounds);
            };
        };
        orderRounds(tournament);
    }, [tournament, setOrderedRounds, setWinner]);


    const canEditScore = (game) => {
        const nextRound = `Round ${game.tournamentRound + 1}`;
        if (tournament[nextRound]) {
            const nextRoundSize = Object.keys(tournament[nextRound]).length;
            const nextGame = game.tournamentGame <= nextRoundSize ? game.tournamentGame
                            : (nextRoundSize + 1) - (game.tournamentGame - nextRoundSize);
            if (tournament[nextRound][`Game ${nextGame}`].team1Score !== null) return false;
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
                            <Col className='tournamentCol'
                                    style={{maxWidth: `${100 / (orderedRounds.length + 1)}%`}}>
                                <TournamentRound round={tournament[playInRound]} 
                                                isEditor={isEditor} 
                                                setPopupGame={setPopupGame}
                                                playInLength={orderedRounds[0] ? 
                                                                Object.keys(tournament[orderedRounds[0]]).length 
                                                                : null} />
                            </Col>}
                        {orderedRounds.map(r => 
                            <Col key={r} className='tournamentCol'
                                            style={{maxWidth: `${100 / (orderedRounds.length + 1)}%`}}>
                                <TournamentRound round={tournament[r]} 
                                                isEditor={isEditor} 
                                                setPopupGame={setPopupGame}
                                                playInLength={null} />
                            </Col>)}
                            <Col className='tournamentCol'
                                    style={{maxWidth: `${100 / (orderedRounds.length + 1)}%`}}>
                                <p className='winner'>
                                    <span className={`gameTeam${winner?.color ? ` tournamentGame${winner.color}` : ''}`}>
                                        {winner?.teamName || ''}
                                    </span>
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
                            <p className='winner'>
                                <span className={`gameTeam${winner?.color ? ` tournamentGame${winner.color}` : ''}`}>
                                    {winner?.teamName || ''}
                                </span>
                            </p>}
                    </>
                }
            </Row>
        </Container>
    );
};

export default TournamentDisplay;