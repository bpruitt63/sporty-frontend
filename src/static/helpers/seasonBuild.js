/** Creates games for season based on provided teams and number of rounds
 * Teams should be array of objects: {teamName, color}
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
    const mid = teams.length / 2;
    let flipped = false;
    let spliceIndex = 0;

    /** Home/away games are equal each time two full round
     * robins are played.  finalRounds is the last round of the last
     * full double round robin; games after finalRounds need to run
     * through the equalizeHomeAway function to ensure nearly 
     * equal home and away games.
     */
    let finalRounds = (teams.length - 1) * 2;
    while (finalRounds + (teams.length - 1) * 2 < numGames) finalRounds += (teams.length - 1) * 2;
    if (finalRounds > numGames) finalRounds = 0;

    /** Builds object used to swap home/away teams as needed
     * after finalRounds
     */
    const homeAwayCounts = {};
    for (let team of teams) {
        if (team.teamName === 'Bye') continue;
        homeAwayCounts[team.teamName] = {home: 0, away: 0};
        for (let team2 of teams) {
            if (team2.teamName === 'Bye') continue;
            homeAwayCounts[team.teamName][team2.teamName] = {home: 0, away: 0};
        };
    };

    /** For assigned number of rounds, creates games or byes for each team
     * Changes home/away assignments each time same teams play each other
     */
    while (round <= numGames) {
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

        /** Populate homeAwayCounts for use in equalizeHomeAway function */
        if (round > finalRounds) {
            for (let game of season[round]) {
                const homeTeam = game[0].teamName;
                const awayTeam = game[1].teamName;
                if (homeTeam === 'Bye' || awayTeam === 'Bye') continue;
                homeAwayCounts[homeTeam].home++;
                homeAwayCounts[awayTeam].away++;
                homeAwayCounts[homeTeam][awayTeam].away++;
                homeAwayCounts[awayTeam][homeTeam].home++;
            };
        };

        round++;
    };

    season = equalizeHomeAway(season, finalRounds, numGames, homeAwayCounts);

    const games = formatSeason(season);

    /** Adds bye team if not done at beginning of function */
    if (addBye) teams.push({teamName: 'Bye', color: 'N/A'});

    return {games, teams};
};

/** Ensures approximately the same number of home and away games
 * in rounds after finalRounds round.
 * Iterates through all games in rounds in question.  If teams in
 * a game already play each other once at home and once away, that overrides
 * this function.  Otherwise, if the home team plays at home more than the
 * away team does, swaps home and away.
 * Repeats process until all teams' home/away schedules are as similar as possible
 */
function equalizeHomeAway(season, finalRounds, numGames, homeAwayCounts) {
    let finished = true;
    for (let roundNum = finalRounds + 1; roundNum <= numGames; roundNum++) {
        for (let gameNum = 0; gameNum < season[roundNum].length; gameNum++) {
            const homeTeam = season[roundNum][gameNum][0].teamName;
            const awayTeam = season[roundNum][gameNum][1].teamName;
            if (homeTeam === 'Bye' || awayTeam === 'Bye') continue;
            if (homeAwayCounts[homeTeam][awayTeam].home !== homeAwayCounts[homeTeam][awayTeam].away) {
                const homeAwayDiff = (homeAwayCounts[homeTeam].home - homeAwayCounts[homeTeam].away)
                                        - (homeAwayCounts[awayTeam].home - homeAwayCounts[awayTeam].away);

                if (Math.abs(homeAwayDiff) > 2) {
                    finished = false;
                    season[roundNum][gameNum].reverse();
                    homeAwayCounts[homeTeam].home--;
                    homeAwayCounts[homeTeam].away++;
                    homeAwayCounts[homeTeam][awayTeam].away--;
                    homeAwayCounts[homeTeam][awayTeam].home++;
                    homeAwayCounts[awayTeam].away--;
                    homeAwayCounts[awayTeam].home++;
                    homeAwayCounts[awayTeam][homeTeam].away++;
                    homeAwayCounts[awayTeam][homeTeam].home--;
                };
            };
        };
    };
    if (finished) return season;
    return equalizeHomeAway(season, finalRounds, numGames, homeAwayCounts);
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