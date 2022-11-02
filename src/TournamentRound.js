import React, {useState, useEffect} from 'react';
import TournamentGame from './TournamentGame';

function TournamentRound({round, isEditor, setPopupGame}) {

    const [orderedGames, setOrderedGames] = useState(Object.keys(round));

    useEffect(() => {
        function orderGames() {
            const isPlayIn = isPlayInRound(round);
            const keys = Object.keys(round);
            const goalLength = isPlayIn ? getGoalLength(keys.length) : keys.length;
            let orderedGames = [1];
            while (orderedGames.length < goalLength) {
                for (let i = 0; i < orderedGames.length; i++) {
                    orderedGames[i] = [orderedGames[i], (2 * orderedGames.length + 1) - orderedGames[i]];
                };
                orderedGames = orderedGames.flat();
            };
            orderedGames = orderedGames.map(g => g = `Game ${g}`);
            if (isPlayIn) {
                let target = orderedGames.length;
                let current = target + 1;
                while (orderedGames.length < keys.length) {
                    const targetInd = orderedGames.indexOf(`Game ${target}`);
                    orderedGames.splice(targetInd + 1, 0, `Game ${current}`)
                    target--;
                    current++;
                };
            };
            setOrderedGames(orderedGames);
        };
        function getGoalLength(goalLength) {
            let goal = 1;
            while (goal * 2 < goalLength) goal *= 2;
            return goal;
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
            {orderedGames.map(g =>
                <TournamentGame key={g} 
                                game={round[g]}
                                isEditor={isEditor}
                                setPopupGame={setPopupGame} />)}
                <hr/>
        </div>
    );
};

export default TournamentRound;