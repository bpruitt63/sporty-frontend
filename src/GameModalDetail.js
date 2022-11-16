import React from 'react';

function GameModalDetail({game}) {

    return (
        <div>
            <p className={`modalGameTop modalGame${game.team1Color}`}>
                <span className='modalTeam'>
                    {game.team1Name || 'Team TBD'}
                </span >
                <span className='modalTeam'>
                    {game.team1Score}
                </span>
            </p>
            <p className='modalDateTime'>
                <span className='modalDateColumn'>
                    {game.readableDate || 'Date TBA'}
                </span>
                <span className='modalDateColumn'>
                    {game.readableTime || 'Time TBA'}
                </span>
            </p>
            <p className='modalLocation'>
                {game.gameLocation || 'Location TBA'}
            </p>
            <p className='modalLocation'>
                Notes: {game.notes}
            </p>
            <p className={`modalGameBottom modalGame${game.team2Color}`}>
                <span className='modalTeam'>
                    {game.team2Name || 'Team TBD'}
                </span>
                <span className='modalTeam'>
                    {game.team2Score}
                </span>
            </p>
        </div>
    );
};

export default GameModalDetail;