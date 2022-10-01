export function buildTournamentRound(teams, rankings, details) {
    const {byes, playIns} = getByes(rankings);

    // let byes = [];
    // const playIns = [];
    // if (rankings.length < 4) {
    //     if (rankings.length === 3) {
    //         byes.push(rankings.shift());
    //     };
    //     const games = createTournamentGames(rankings, teams);
    //     return {games, byes};
    // };
    // while (rankings.length % 4) {
    //     playIns.push(rankings.pop());
    //     const numTeamsToAdd = playIns.length;
    //     while (numTeamsToAdd) {
    //         playIns.unshift(rankings.pop());
    //         numTeamsToAdd--;
    //     };
    // };
    // if (playIns.length) {
    //     byes = rankings;
    //     rankings = playIns;
    // };
    // const games = createTournamentGames(rankings, teams);
    // return {games, byes};
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

function createTournamentGames(rankings, teams) {
    //TODO everything!
    return rankings;
};