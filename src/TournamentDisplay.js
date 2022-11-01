import React, {useState, useEffect} from 'react';
import { Col, Row } from 'react-bootstrap';
import TournamentRound from './TournamentRound';

function TournamentDisplay({tournament={}}) {

    const [orderedRounds, setOrderedRounds] = useState(Object.keys(tournament));

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


    return (
        <Row>
            {orderedRounds.map(r => 
                <Col style={{backgroundColor: 'white'}} key={r} xs={1}><TournamentRound key={r} round={tournament[r]} /></Col>)}
        </Row>
    );
};

export default TournamentDisplay;