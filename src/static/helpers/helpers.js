/** Form validation for game creation or update */
export function validateGames(games, setErrors, gameRefs=[]) {
    for (let game of Object.keys(games)){
        if (!(games[game].team1Id && games[game].team2Id)) {
            setErrors({error: 'Both teams are required'});
            if (gameRefs.current.length) gameRefs.current[game - 1].children[0].children[1].children[0].children[0].children[0].focus();
            return false;
        } else if (games[game].team1Id === games[game].team2Id) {
            setErrors({error: 'Team cannot play itself'});
            if (gameRefs.current.length) gameRefs.current[game - 1].children[0].children[1].children[0].children[0].children[0].focus();
            return false;
        };
        if (games[game].gameLocation.length > 50) {
            setErrors({error: 'Location cannot exceed 50 characters'});
            if (gameRefs.current.length) gameRefs.current[game - 1].children[0].children[2].children[0].children[0].children[1].children[0].focus();
            return false;
        };
        if (games[game].notes.length > 1000) {
            setErrors({error: 'Notes cannot exceed 1000 characters'});
            if (gameRefs.current.length) gameRefs.current[game - 1].children[0].children[3].children[1].children[0].focus();
            return false;
        };
        if ((games[game].team1Score === null && games[game].team2Score !== null) ||
                (games[game].team2Score === null && games[game].team1Score !== null)) {
                    setErrors({error: 'Both team scores are required if entering score'});
                    if (gameRefs.current.length) gameRefs.current[game - 1].children[0].children[1].children[0].children[0].children[1].children[1].children[0].focus();
                    return false;
        };
    };
    return true;
};

/** Changes form data from game creation or update into required
 * format for SQL inputs
 * Ensures no score is submitted for a bye week
 */
export function formatInputs(games, bye) {
    for (let game of Object.keys(games)) {
        games[game].team1Id = parseInt(games[game].team1Id);
        games[game].team2Id = parseInt(games[game].team2Id);
        if (games[game].gameDate === '') {
            games[game].gameDate = null;
        };
        if (games[game].gameTime === '') {
            games[game].gameTime = null;
        } else if (games[game].gameTime && games[game].gameTime.length !== 8) {
            games[game].gameTime += ':00';
        };
        if (games[game].team1Id === bye || games[game].team2Id === bye) {
            games[game].team1Score = null;
            games[game].team2Score = null;
        };
        if (games[game].team1Score) games[game].team1Score = parseInt(games[game].team1Score);
        if (games[game].team2Score) games[game].team2Score = parseInt(games[game].team2Score);
    };
    return games;
};

/** Changes time from HH24:MM:SS to HH12:MM AM/PM */
export function formatTime(time) {
    if (!time) return null;
    time = time.split(':');
    parseInt(time[0]) < 12 ? time[2] = 'AM' : time[2] = 'PM';
    if (time[0] === '00') {
        time[0] = '12';
    } else if (parseInt(time[0]) > 12) {
        time[0] = (parseInt(time[0]) - 12).toString();
    };
    return (`${time[0]}:${time[1]} ${time[2]}`);
};
