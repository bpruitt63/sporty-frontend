export function buildTournament(teams, rankings, details='single') {
    const {byes, playIns} = getByes(rankings);
    const tournament = buildRounds(byes, playIns);

    let numTeams = 2;
    for (let i = Object.keys(tournament).length; i > 1; i--) {
        const key = `Round ${i}`;
        tournament[key] = buildRound(numTeams);
        numTeams *= 2;
    };
    tournament['Round 1'] = playIns.length ? buildRound(playIns.length) 
                                            : buildRound(numTeams);
    
    let round = 1;
    if (playIns.length) {
        tournament['Round 1'] = populateGames(playIns, tournament['Round 1'], teams);
        for (let tba = 0; tba < playIns.length / 2; tba++) byes.push(null);
        round++;
    };
    tournament[`Round ${round}`] = populateGames(byes, tournament[`Round ${round}`], teams);
    console.log(tournament)
};

function getByes(rankings) {
    let target = 2;
    while (target <= rankings.length) {
        target *= 2;
    };
    const numPlayInGames = rankings.length - (target / 2);
    const firstPlayInIndex = rankings.length - (numPlayInGames * 2);
    const byes = rankings.slice(0, firstPlayInIndex);
    const playIns = rankings.slice(firstPlayInIndex);
    return {byes, playIns}
};

function buildRounds(byes, playIns) {
    const tournament = {};
    let target = 2;
    let round = 1;
    let key = `Round ${round}`;
    while (target <= byes.length + playIns.length) {
        tournament[key] = {};
        round++;
        target *= 2;
        key = `Round ${round}`;
    };
    if (playIns.length >= 1) tournament[key] = {};
    return tournament;
};

function buildRound(numTeams) {
    const round = {};
    let game = 1;
    let key;
    while (game * 2 <= numTeams) {
        key = `Game ${game}`;
        round[key] = {};
        game++;
    };
    return round;
};

function populateGames(rankings, round, teams) {
    for (let i = 0; i < rankings.length / 2; i++) {
        const team1Id = rankings[i];
        const team2Id = rankings[rankings.length - 1 - i];
        const game = i + 1;
        round[`Game ${game}`].team1Id = team1Id;
        round[`Game ${game}`].team2Id = team2Id;
        round[`Game ${game}`].team1Name = teams[team1Id].teamName || 'N/A';
        round[`Game ${game}`].team2Name = teams[team2Id]?.teamName || 'N/A';
        round[`Game ${game}`].team1Color = teams[team1Id].color || 'N/A';
        round[`Game ${game}`].team2Color = teams[team2Id]?.color || 'N/A';
    };
    return round;
};