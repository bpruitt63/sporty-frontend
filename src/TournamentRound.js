import React, {useState, useEffect} from 'react';
import TournamentGame from './TournamentGame';

function TournamentRound({round}) {

    const [orderedGames, setOrderedGames] = useState(Object.keys(round));

    useEffect(() => {
        function orderGames() {
            const keys = Object.keys(round);
            if (!isPlayInRound(round)) {
                let orderedGames = [1];
                while (orderedGames.length < keys.length) {
                    for (let i = 0; i < orderedGames.length; i++) {
                        orderedGames[i] = [orderedGames[i], (2 * orderedGames.length + 1) - orderedGames[i]];
                    };
                    orderedGames = orderedGames.flat();
                };
                orderedGames = orderedGames.map(g => g = `Game ${g}`);
                setOrderedGames(orderedGames);
            };
        };
        function isPlayInRound() {
            if (!round['Game 1'].tournamentRound || round['Game 1'].tournamentRound === 1) {
                let check = 2;
                const roundSize = Object.keys(round).length;
                while (check < roundSize) check *= 2;
                if (check !== roundSize) return true;
            };
            return false;
        };
        orderGames(round);
    }, [round, setOrderedGames]);

    return (
        <div>
            {console.log(round)}
            {console.log(orderedGames)}
            {orderedGames.map(g =>
                <TournamentGame key={g} game={round[g]} />)}
                <hr/>
        </div>
    );
};

export default TournamentRound;