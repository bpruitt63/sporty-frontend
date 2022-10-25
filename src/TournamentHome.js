import React, {useEffect} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import TournamentDisplay from './TournamentDisplay';

function TournamentHome() {

    const location = useLocation();

    // useEffect(() => {
    //     async function getTournament() {
    //         try {
    //             let [gamesResult, teamsResult] = await Promise.all([
    //                 SportyApi.getGames(orgId, seasonId),
    //                 SportyApi.getTeams(orgId, seasonId)
    //             ]);
    //             if (gamesResult && gamesResult['Round 1']) {
    //                 navigate(`/organization/${orgId}/tournaments/${seasonId}`, {state: gamesResult});
    //             };
    //             teamsResult = getTeams(teamsResult);
    //             const {teams, rankings} = getRankings(gamesResult, teamsResult);
    //             setSeason({seasonId: gamesResult[0].seasonId, 
    //                         title: gamesResult[0].title, 
    //                         games: gamesResult,
    //                         teams,
    //                         rankings});
    //             setGames(gamesResult);
    //             setTitle({seasonTitle: gamesResult[0].title});
    //             setNewGame({games: [newGameObj], teams});
    //             setBye(parseInt(Object.keys(teams).find(key => teams[key].teamName === 'Bye')));
    //             setIsLoading(false);
    //         } catch (e) {
    //             getApiErrors(e);
    //             try {
    //                 let [seasonResult, teamsResult] = await Promise.all([
    //                     SportyApi.getSeason(orgId, seasonId),
    //                     SportyApi.getTeams(orgId, seasonId)
    //                 ]);
    //                 teamsResult = getTeams(teamsResult);
    //                 const {teams, rankings} = getRankings([], teamsResult);
    //                 setSeason({seasonId: seasonResult.seasonId, 
    //                             title: seasonResult.title, 
    //                             games: [],
    //                             teams,
    //                             rankings});
    //                 setGames([]);
    //                 setTitle({seasonTitle: seasonResult.title});
    //                 setNewGame({games: [newGameObj], teams});
    //                 setBye(parseInt(Object.keys(teams).find(key => teams[key].teamName === 'Bye')));
    //                 setIsLoading(false);
    //             } catch (err) {
    //                 getApiErrors(err);
    //                 navigate(`/organization/${orgId}`);
    //             };
    //         };
    //     };
    //     getSeason(orgId, seasonId);
    // }, [orgId, seasonId, setSeason, getApiErrors, navigate, setTitle, setNewGame, newGameObj]);

    return (
        <>
        {console.log(location.state)}
        <TournamentDisplay />
        </>
    );
};

export default TournamentHome;