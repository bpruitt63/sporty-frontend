export function buildSeason(teams, numGames) {
    if (teams.length % 2 !== 0) teams.unshift('Bye');
    const season = {};
    let round = 1;
    const mid = teams.length / 2;
    while (round <= numGames){
        season[round] = [];
        for (let i = 0; i < mid; i++){
            season[round].push([teams[i], teams[i + mid]]);
        };
        if (round % 2 === 0) season[round][0].reverse();
        season[round].splice((round - 1 > mid ? round - 1 - mid : round - 1),
                                0, season[round].shift());
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
        }
        teams = reordered;
        round++;
    };
    console.log(season)
};


