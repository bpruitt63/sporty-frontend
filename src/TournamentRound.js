import React, {useState, useEffect} from 'react';
import TournamentGame from './TournamentGame';

function TournamentRound({round, isEditor, setPopupGame, playInLength=null, spread={alignContent: 'space-around'}}) {

    const [orderedGames, setOrderedGames] = useState(Object.keys(round));
    const dummyGame = {gameId: 'dummy'}

    useEffect(() => {
        function orderGames() {
            const keys = Object.keys(round);
            const goalLength = playInLength && playInLength < keys.length ?
                                playInLength : keys.length;
            let orderedGames = fillGamesArray([1], goalLength);
            if (playInLength) {
                if (playInLength <= orderedGames.length) {
                    let target = orderedGames.length;
                    let current = target + 1;
                    while (orderedGames.length < keys.length) {
                        const targetInd = orderedGames.indexOf(`Game ${target}`);
                        orderedGames.splice(targetInd + 1, 0, `Game ${current}`);
                        target--;
                        current++;
                    };
                    while (orderedGames.length < playInLength * 2) {
                        const targetInd = orderedGames.indexOf(`Game ${target}`);
                        orderedGames.splice(targetInd, 0, null);
                        target--;
                    };
                } else {
                    let dummyRound = fillGamesArray([1], playInLength * 2);
                    for (let i = 0; i < dummyRound.length; i++) {
                        if (+(dummyRound[i].split(' ')[1]) > playInLength * 2 - orderedGames.length) {
                            dummyRound.splice(i, 1);
                            i--;
                        } else if (orderedGames.includes(dummyRound[i])) {
                            dummyRound.splice(i, 0, null);
                            i++;
                        } else {
                            dummyRound[i] = null;
                        };
                    };
                    orderedGames = dummyRound;
                };
            };
            setOrderedGames(orderedGames);
        };
        function fillGamesArray(orderedGames, goalLength) {
            while (orderedGames.length < goalLength) {
                for (let i = 0; i < orderedGames.length; i++) {
                    orderedGames[i] = [orderedGames[i], (2 * orderedGames.length + 1) - orderedGames[i]];
                };
                orderedGames = orderedGames.flat();
            };
            return orderedGames.map(g => g = `Game ${g}`);
        };
        orderGames(round);
    }, [round, setOrderedGames, playInLength]);

    return (
        <div className='tournamentRound'
                style={spread}>
            {orderedGames.map((g, i) =>
                <TournamentGame key={g || `null${i}`} 
                                game={g ? round[g] : dummyGame}
                                isEditor={isEditor}
                                setPopupGame={setPopupGame}
                                height={100 / (orderedGames.length + 1)} />)}
        </div>
    );
};

export default TournamentRound;