import React from 'react';

function TournamentDisplay({tournament={}}) {

    return (
        <div>
            {Object.keys(tournament).map(r => 
                <p key={r}>{r}</p>)}
        </div>
    );
};

export default TournamentDisplay;