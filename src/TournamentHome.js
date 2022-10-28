import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useErrors } from './hooks';
import Errors from './Errors';
import TournamentDisplay from './TournamentDisplay';
import SportyApi from './SportyApi';

function TournamentHome() {

    const {seasonId} = useParams();
    const {orgId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [tournament, setTournament] = useState({});
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        async function getTournament() {
            if (location.state) {
                setTournament(location.state);
            } else {
                try {
                    const tournament = await SportyApi.getGames(orgId, seasonId);
                    if (Array.isArray(tournament)) {
                        navigate(`/organization/${orgId}/seasons/${seasonId}`);
                    } else {
                        setTournament(tournament);
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
            <Errors apiErrors={apiErrors} />
            <TournamentDisplay tournament={tournament} />
        </>
    );
};

export default TournamentHome;