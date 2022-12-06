import {buildSeason} from '../static/helpers/seasonBuild';

const buildTeamsArray = (size) => {
    const teams = [];
    for (let num = 1; num <= size; num++){
        teams.push({teamName: `Team ${num}`, color: 'N/A'});
    };
    return teams;
};

const evenRoundRobin = (games) => {
    const matchupCount = {};
    for (let game of games) {
        const {team1Name, team2Name} = game;
        if (team1Name !== 'Bye' && team2Name !== 'Bye') {
            const matchup = [team1Name, team2Name].sort().join('');
            matchupCount[matchup] = matchupCount[matchup] + 1 || 1;
        };
    };
    const vals = Object.values(matchupCount);
    vals.sort((a, b) => a - b);
    return vals[vals.length - 1] - vals[0] <= 1 ? true : false;
};

const evenHomeAway = (games) => {
    const locationCount = {};
    for (let game of games) {
        const {team1Name, team2Name} = game;
        if (team1Name !== 'Bye' && team2Name !== 'Bye') {
            team1Name in locationCount ? locationCount[team1Name][0]++ 
                                        : locationCount[team1Name] = [1, 0];
            team2Name in locationCount ? locationCount[team2Name][1]++ 
                                        : locationCount[team2Name] = [0, 1];
        };
    };
    const vals = Object.values(locationCount);
    for (let val of vals) {
        if (Math.abs(val[0] - val[1]) > 2) return false;
    };
    return true;
};


test('works', () => {
    const {teams, games} = buildSeason(buildTeamsArray(2), 1);
    expect(teams.length).toEqual(3);
    expect(games.length).toEqual(1);
});

test('no byes if even number of teams', () => {
    let games = buildSeason(buildTeamsArray(4), 6).games;
    expect(games.length).toEqual(12);

    games = buildSeason(buildTeamsArray(8), 6).games;
    expect(games.length).toEqual(24);

    games = buildSeason(buildTeamsArray(2), 20).games;
    expect(games.length).toEqual(20);

    games = buildSeason(buildTeamsArray(30), 3).games;
    expect(games.length).toEqual(45);
});

test('byes if odd number of teams', () => {
    let games = buildSeason(buildTeamsArray(5), 6).games;
    expect(games.length).not.toEqual(15);

    games = buildSeason(buildTeamsArray(9), 6).games;
    expect(games.length).not.toEqual(27);

    games = buildSeason(buildTeamsArray(3), 20).games;
    expect(games.length).not.toEqual(30);

    games = buildSeason(buildTeamsArray(29), 4).games;
    expect(games.length).not.toEqual(58);
});

test('each team plays each team about the same number of times', () => {
    let games = buildSeason(buildTeamsArray(4), 6).games;
    expect(evenRoundRobin(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(8), 6).games;
    expect(evenRoundRobin(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(5), 4).games;
    expect(evenRoundRobin(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(29), 10).games;
    expect(evenRoundRobin(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(30), 10).games;
    expect(evenRoundRobin(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(29), 11).games;
    expect(evenRoundRobin(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(30), 11).games;
    expect(evenRoundRobin(games)).toBeTruthy();
});

test('each team plays about the same amount of home/away games', () => {
    let games = buildSeason(buildTeamsArray(4), 6).games;
    expect(evenHomeAway(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(8), 6).games;
    expect(evenHomeAway(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(5), 4).games;
    expect(evenHomeAway(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(29), 10).games;
    expect(evenHomeAway(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(30), 10).games;
    expect(evenHomeAway(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(29), 11).games;
    expect(evenHomeAway(games)).toBeTruthy();

    games = buildSeason(buildTeamsArray(30), 11).games;
    expect(evenHomeAway(games)).toBeTruthy();
});