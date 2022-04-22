/** Creates games for season based on provided teams and number of rounds
 * Returns array of game objects and array of team objects
 */
export function buildSeason(teams, numGames) {
    let addBye = true;

    // Ensure even number of teams by adding Bye team if odd number
    if (teams.length % 2 !== 0) {
        teams.unshift({teamName: 'Bye', color: 'N/A'});
        addBye = false;
    };

    let season = {};
    let round = 1;
    let spliceIndex = 0;
    const mid = teams.length / 2;
    let flipped = false;

    /** For assigned number of rounds, creates games or byes for each team
     * Changes home/away assignments each time same teams play each other
     */
    while (round <= numGames){
        season[round] = [];
        for (let i = 0; i < mid; i++){
            season[round].push(flipped ? [teams[i], teams[i + mid]]
                                : [teams[i + mid], teams[i]]);
        };
        if (!flipped && round % 2 === 0) season[round][0].reverse();
        if (flipped && round % 2 !== 0) season[round][0].reverse();

        /** Ensure first team in array doesn't always play first in each round */
        season[round].splice(spliceIndex, 0, season[round].shift());
        spliceIndex + 1 < mid ? spliceIndex++ : spliceIndex = 0;
        
        /** Reorder teams array to ensure each team plays each team */
        const reordered = [...teams];
        for (let j = 1; j < teams.length; j++) {
            if (j === mid){ 
                reordered[1] = teams[j];
            } else if (j === mid - 1) {
                reordered[reordered.length - 1] = teams[j];
            } else if (j < mid){
                reordered[j + 1] = teams[j];
            } else {
                reordered[j - 1] = teams[j];
            };
        };

        /** Switches home/away teams each time teams replay each other */
        if (round % (teams.length - 1) === 0) flipped = !flipped;
        teams = reordered;
        round++;
    };
    const games = formatSeason(season);

    /** Adds bye team if not done at beginning of function */
    if (addBye) teams.push({teamName: 'Bye', color: 'N/A'});
    return {games, teams};
};


/** Formats object of games into array of game objects */
function formatSeason(season) {
    const games = [];
    const keys = Object.keys(season);
    for (let key of keys) {
        for (let game of season[key]) {
            const formatted = {
                team1Name: game[0].teamName,
                team2Name: game[1].teamName,
                team1Color: game[0].color,
                team2Color: game[1].color,
                team1Id: null,
                team2Id: null,
                gameDate: null,
                gameTime: null,
                gameLocation: '',
                team1Score: null,
                team2Score: null,
                notes: ''
            };
            games.push(formatted);
        };
    };
    return games;
};

/** Calculates records and rankings for all teams
 * Returns object of team objects,
 * array of team ids ranked by win percentage
 */
// export function getTeams(season, allTeams) {
//     const teams = {};
//     for (let team of allTeams) {
//         teams[team.teamId] = {teamName: team.teamName,
//                                 color: team.color,
//                                 record: [0, 0, 0],
//                                 games: []};
//     };

//     for (let game of season) {
//         const team1Id = game.team1Id;
//         const team2Id = game.team2Id;
//         if (game.team1Score !== null && game.team2Score !== null) {
//             const winner = calculateWinner(game.team1Score, game.team2Score);
//             if (winner === 'tie') {
//                 teams[team1Id].record[2]++;
//                 teams[team2Id].record[2]++;
//             } else if (winner === 'team1') {
//                 teams[team1Id].record[0]++;
//                 teams[team2Id].record[1]++;
//             } else {
//                 teams[team1Id].record[1]++;
//                 teams[team2Id].record[0]++;
//             };
//         };
//         teams[team1Id].games.push(game);
//         teams[team2Id].games.push(game);
//     };
//     console.log('fdsf')
//     let rankings = [];
//     for (let key of Object.keys(teams)) {
//         if (teams[key].teamName !== 'Bye') {
//             teams[key].winPercent = calculateWinPercent(teams[key].record);
//             rankings.push(key);
//         };
//     };
//     rankings = rankings.sort(function(a, b){return teams[b].winPercent - teams[a].winPercent});
//     return {teams, rankings};
// };

export function getTeams(allTeams) {
    const teams = {};
    for (let team of allTeams) {
        teams[team.teamId] = {teamName: team.teamName,
                                color: team.color,
                                record: [0, 0, 0],
                                games: []};
    };
    return teams;
};

export function getRankings(season, teams) {
    for (let game of season) {
        const team1Id = game.team1Id;
        const team2Id = game.team2Id;
        if (game.team1Score !== null && game.team2Score !== null) {
            const winner = calculateWinner(game.team1Score, game.team2Score);
            if (winner === 'tie') {
                teams[team1Id].record[2]++;
                teams[team2Id].record[2]++;
            } else if (winner === 'team1') {
                teams[team1Id].record[0]++;
                teams[team2Id].record[1]++;
            } else {
                teams[team1Id].record[1]++;
                teams[team2Id].record[0]++;
            };
        };
        teams[team1Id].games.push(game);
        teams[team2Id].games.push(game);
    };
    let rankings = [];
    for (let key of Object.keys(teams)) {
        if (teams[key].teamName !== 'Bye') {
            teams[key].winPercent = calculateWinPercent(teams[key].record);
            rankings.push(key);
        };
    };
    rankings = rankings.sort((a, b) => teams[b].winPercent - teams[a].winPercent);
    return {teams, rankings};
};

function calculateWinner(team1Score, team2Score) {
    if (team1Score === team2Score) return 'tie';
    if (team1Score > team2Score) return 'team1';
    if (team1Score < team2Score) return 'team2';
};

function calculateWinPercent(record) {
    const wins = record[0] + (record[2] / 2);
    const games = record[0] + record[1] + record[2];
    if (!games) return 0.0001;
    return wins / games;
};


/** Form validation for game creation or update */
export function validateGames(games, setErrors) {
    for (let game of Object.keys(games)){
        if (!(games[game].team1Id && games[game].team2Id)) {
            setErrors({error: 'Both teams are required'});
            return false;
        } else if (games[game].team1Id === games[game].team2Id) {
            setErrors({error: 'Team cannot play itself'});
            return false;
        };
        if (games[game].gameLocation.length > 50) {
            setErrors({error: 'Location cannot exceed 50 characters'});
            return false;
        };
        if (games[game].notes.length > 1000) {
            setErrors({error: 'Notes cannot exceed 1000 characters'});
            return false;
        };
        if ((games[game].team1Score === '' && games[game].team2Score !== '') ||
                (games[game].team2Score ==='' && games[game].team2Score !== '')) {
                    setErrors({error: 'Both team scores are required if entering score'});
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
