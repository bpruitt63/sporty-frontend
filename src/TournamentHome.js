import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, useLocation, Link} from 'react-router-dom';
import { Spinner, Col, Row, Container } from 'react-bootstrap';
import { useErrors } from './hooks';
import Errors from './Errors';
import TournamentDisplay from './TournamentDisplay';
import SportyApi from './SportyApi';

function TournamentHome({user, isMobile}) {

    const {seasonId} = useParams();
    const {orgId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [tournament, setTournament] = useState({});
    const [tournamentData, setTournamentData] = useState({title: '', tournamentFor: null});
    const [apiErrors, getApiErrors] = useErrors();
    const isEditor = (user && user.superAdmin) || (user && user.organizations[orgId] && 
        user.organizations[orgId].adminLevel <= 2);
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        async function getTournament() {
            if (location.state) {
                setTournament(location.state.games);
                setTournamentData({title: location.state.season.title, 
                                    tournamentFor: location.state.season.tournamentFor});
            } else {
                try {
                    const [tournament, seasonData] = await Promise.all([
                        SportyApi.getGames(orgId, seasonId),
                        SportyApi.getSeason(orgId, seasonId)]);
                    if (Array.isArray(tournament)) {
                        navigate(`/organization/${orgId}/seasons/${seasonId}`);
                    } else {
                        setTournament(tournament);
                        setTournamentData({title: seasonData.title, 
                                        tournamentFor: seasonData.tournamentFor});
                    };
                } catch (err) {
                    getApiErrors(err);
                    navigate(`/organization/${orgId}`);
                };
            };
        };
        getTournament(orgId, seasonId);
        setIsLoading(false);
    }, [orgId, seasonId, setTournament, setIsLoading, getApiErrors, location, navigate]);

    const updateGame = async (game, data) => {
        const updatedGame = await SportyApi.editGame({game: data}, game.gameId, orgId, seasonId);
        const updatedTournament = {...tournament};
        updatedTournament[`Round ${updatedGame.tournamentRound}`][`Game ${updatedGame.tournamentGame}`] = updatedGame;
        const nextRound = `Round ${updatedGame.tournamentRound + 1}`;
        if (tournament[nextRound]) {
            if (updatedGame.team1Score !== null) {
                const winner = updatedGame.team1Score > updatedGame.team2Score ?
                                updatedGame.team1Id : updatedGame.team2Id;
                const nextRoundSize = Object.keys(tournament[nextRound]).length;
                const currentRoundSize = Object.keys(tournament[`Round ${updatedGame.tournamentRound}`]).length;
                const nextGame = `Game ${updatedGame.tournamentGame <= nextRoundSize ? updatedGame.tournamentGame
                                : (nextRoundSize + 1) - (updatedGame.tournamentGame - nextRoundSize)}`;
                const nextTeam = currentRoundSize === nextRoundSize * 2
                    ? updatedGame.tournamentGame <= nextRoundSize ? 'team1Id' : 'team2Id'
                    : getNextforPlayInRound(nextRoundSize, currentRoundSize, updatedGame.tournamentGame);
                const dataToSend = {[nextTeam]: winner};
                const updatedNext = await SportyApi.editGame({game: dataToSend}, updatedTournament[nextRound][nextGame].gameId, orgId, seasonId);
                updatedTournament[nextRound][nextGame] = updatedNext;
            };
        };
        setTournament(updatedTournament);
    };

    const getNextforPlayInRound = (nextRoundSize, currentRoundSize, gameNum) => {
        const diff = (nextRoundSize * 2) - currentRoundSize;
        let teamId = 'team2Id';
        if (gameNum > diff && gameNum <= nextRoundSize) {
            teamId = 'team1Id';
        };
        return teamId;
    };


    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    };


    return (
        <Container>
            <Col xs={{span: 10, offset: 1}} 
                md={{span: 6, offset: 3}} 
                className='seasonHead'>
                <Link to={`../organization/${orgId}`}
                        className='returnLink'>
                    Back to organization
                </Link>
                <Row className='seasonTitleRow'>
                    <Col as='h3' xs={12} lg={{span: 8, offset: 2}}>
                        {tournamentData.title}
                    </Col>
                </Row>
            </Col>
            <div>
            <Link to={`../organization/${orgId}/seasons/${tournamentData.tournamentFor}`}
                    className='message'>
                View season
            </Link>
            </div>
            <Errors apiErrors={apiErrors} />
            <TournamentDisplay tournament={tournament} 
                                isEditor={isEditor} 
                                updateGame={updateGame}
                                isMobile={isMobile} />
        </Container>
    );
};

export default TournamentHome;