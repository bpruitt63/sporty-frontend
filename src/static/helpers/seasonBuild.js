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
        teams = reorderTeams(teams, mid);

        /** Switches home/away teams each time teams replay each other */
        if (round % (teams.length - 1) === 0) flipped = !flipped;
        round++;
    };
    const games = formatSeason(season);

    /** Adds bye team if not done at beginning of function */
    if (addBye) teams.push({teamName: 'Bye', color: 'N/A'});
    return {games, teams};
};

/** Reorder teams array to ensure each team plays each team */
function reorderTeams(teams, mid) {
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
    return reordered;
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