import React from 'react';
import TournamentGame from './TournamentGame';

function TournamentRound({round}) {

    return (
        <div>
            {Object.keys(round).map(g =>
                <TournamentGame key={g} game={round[g]} />)}
                <hr/>
        </div>
    );
};

export default TournamentRound;