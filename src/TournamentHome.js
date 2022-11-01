import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, useLocation, Link} from 'react-router-dom';
import { Spinner, Col, Row } from 'react-bootstrap';
import { useErrors } from './hooks';
import Errors from './Errors';
import TournamentDisplay from './TournamentDisplay';
import SportyApi from './SportyApi';

function TournamentHome() {

    const {seasonId} = useParams();
    const {orgId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [tournament, setTournament] = useState({});
    const [tournamentData, setTournamentData] = useState({title: '', tournamentFor: null});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        async function getTournament() {
            if (location.state) {
                setTournament(location.state.gamesResult);
                setTournamentData({title: location.state.seasonResult.title, 
                                    tournamentFor: location.state.seasonResult.tournamentFor});
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


    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    };


    return (
        <>
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
            <Link to={`../organization/${orgId}/seasons/${tournamentData.tournamentFor}`}
                    className='returnLink'>
                View season
            </Link>
            <Errors apiErrors={apiErrors} />
            <TournamentDisplay tournament={tournament} />
        </>
    );
};

export default TournamentHome;