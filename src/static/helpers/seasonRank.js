/** Formats teams array into object 
 * primarily to prepare for getRankings function
 */
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

/** Calculates records and rankings for all teams
 * Returns object of team objects,
 * array of team ids ranked by win percentage
 */
export function getRankings(season, teams) {
    teams = getRecords(season, teams);
    let rankings = setRankings(teams);
    rankings = sortRanking(teams, rankings);
    return {teams, rankings};
};

function getRecords(games, teams){
    for (let game of games) {
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
    return teams;
};

function setRankings(teams){
    const rankings = [];
    for (let key of Object.keys(teams)) {
        if (teams[key].teamName !== 'Bye') {
            teams[key].winPercent = calculateWinPercent(teams[key].record);
            rankings.push(key);
        };
    };
    return rankings;
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

function sortRanking(teams, rankings) {
    rankings = rankings.sort((a, b) => teams[b].winPercent - teams[a].winPercent);
    let ind1 = 0
    while (ind1 < rankings.length - 1){
        let ind2 = ind1 + 1;
        while (rankings[ind2] && teams[rankings[ind1]].winPercent === teams[rankings[ind2]].winPercent) {
            ind2++;
        };
        if (ind2 > ind1 + 1) {
            let ties = rankings.slice(ind1, ind2);
            rankings.splice(ind1, 
                            ind2 - ind1, 
                            ties.length === rankings.length ? tiebreakerByPoints(teams, ties)
                                                        : tiebreakerByWins(teams, ties));
            rankings = rankings.flat();
        };
        ind1 = ind2;
    };
    return rankings;
};

function tiebreakerByWins(teams, rankings) {
    let {tiedTeamGames, tiedTeams} = getTeamsAndGamesWithEqualRecords(teams, rankings);
    tiedTeams = getRecords(Object.values(tiedTeamGames), tiedTeams);
    rankings = setRankings(tiedTeams);
    rankings = sortRanking(tiedTeams, rankings, teams);
    return rankings;
};

function tiebreakerByPoints(teams, rankings) {
    let {tiedTeamGames, tiedTeams} = getTeamsAndGamesWithEqualRecords(teams, rankings);
    let teamPoints = tallyPoints(tiedTeams, tiedTeamGames);
    rankings = tiebreakerSort(rankings, teamPoints);
    return rankings;
};

function tiebreakerSort(rankings, teamPoints) {
    rankings = rankings.sort((a, b) => 
        (teamPoints[b].pointsFor - teamPoints[b].pointsAgainst)
        - (teamPoints[a].pointsFor - teamPoints[a].pointsAgainst));
    return rankings;
};

function tallyPoints(teams, games) {
    const teamPoints = {};
    for (let teamId of Object.keys(teams)) {
        teamPoints[teamId] = {pointsFor: 0,
                            pointsAgainst: 0};
    };
    for (let game of Object.values(games)) {
        teamPoints[game.team1Id].pointsFor += game.team1Score;
        teamPoints[game.team1Id].pointsAgainst += game.team2Score;
        teamPoints[game.team2Id].pointsFor += game.team2Score;
        teamPoints[game.team2Id].pointsAgainst += game.team1Score;
    };
    return teamPoints;
};

function getTeamsAndGamesWithEqualRecords(teams, rankings) {
    const tiedTeamGames = {};
    let tiedTeams = {};
    for (let team of rankings) {
        tiedTeams[team] = {...teams[team],
                            record: [0, 0, 0]};
    };
    for (let team of rankings) {
        for (let game of tiedTeams[team].games) {
            if (game.team1Id in tiedTeams && game.team2Id in tiedTeams) {
                tiedTeamGames[game.gameId] = game;
            };
        };
        tiedTeams[team].games = [];
    };
    return {tiedTeamGames, tiedTeams};
};