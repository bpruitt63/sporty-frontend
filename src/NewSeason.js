import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Spinner, Button} from 'react-bootstrap';
import { useHandleChange, useToggle, useErrors } from './hooks';
import ManualSeasonForm from './ManualSeasonForm';
import SeasonNameForm from './SeasonNameForm';
import SeasonRoundsForm from './SeasonRoundsForm';
import SeasonTeamsForm from './SeasonTeamsForm';
import GameList from './GameList';
import Errors from './Errors';
import SportyApi from './SportyApi';


function NewSeason({orgId=null, cancel}) {

    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const [season, handleChange, setSeason] = useHandleChange({seasonTitle: '',
                                                rounds: '',
                                                numTeams: '',
                                                generateNames: true,
                                                generateGames: true,
                                                teams: []});
    const initialState = {seasonName: true, 
                            seasonTeams: false,
                            seasonRounds: false,
                            manualForm: false,
                            preview: false};
    const toggleState = {...initialState, seasonName: false};
    const [toggle, isOpen] = useToggle(initialState, toggleState);
    const navigate = useNavigate();

    const cancelSeason = async (e) => {
        e.preventDefault();
        if (season.seasonId) {
            await SportyApi.removeSeason(orgId, season.seasonId);
        };
        cancel('newSeason');
    };

    const seasonAndTeams = async () => {
        let teams = Object.values(season.teams);
        try {
            const {seasonId} = await SportyApi.addSeason({title: season.seasonTitle}, orgId);
            const teamsRes = await SportyApi.addTeams({teams}, seasonId, orgId);
            setSeason({...season, seasonId, teams: teamsRes});
            return {seasonId, teamsRes};
        } catch (e) {
            getApiErrors(e);
        };
    };

    const gamesToDatabase = async (games) => {
        let id;
        let teams;
        if (!season.seasonId) {
            try {
                const {seasonId, teamsRes} = await seasonAndTeams();
                id = seasonId;
                teams = teamsRes;
                for (let i = 0; i < games.length; i++) {
                    games[i].team1Id = teams.find(t => t.teamName === games[i].team1Name).teamId;
                    games[i].team2Id = teams.find(t => t.teamName === games[i].team2Name).teamId;
                };
                setSeason({...season, games});
            } catch (e) {
                getApiErrors(e);
            };
        };

        try {
            for (let game of games) {
                delete game.team1Name;
                delete game.team1Color;
                delete game.team2Name;
                delete game.team2Color;
            };
            await SportyApi.addGames({games}, orgId, season.seasonId || id);
            return id;
        } catch (e) {
            getApiErrors(e);
        };
    };

    const saveSeason = async (e) => {
        e.preventDefault();
        setApiErrors({});
        setIsLoading(true);
        try {
            const id = await gamesToDatabase(Object.values(season.games));
            setIsLoading(false);
            navigate(`/organization/${orgId}/seasons/${season.seasonId || id}`);
        } catch (err) {
            setApiErrors(err);
            setIsLoading(false);
        };
    };

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    };

    return (
        <div>
            {!orgId && 
                <p className='message'>
                    Seasons created here will not be saved. To save a season,
                    navigate to your organization's home page.
                </p>}
            <Errors apiErrors={apiErrors} />
            {isOpen.seasonName && 
                <SeasonNameForm data={season}
                                handleChange={handleChange}
                                toggle={toggle} />}
            {isOpen.seasonTeams && 
                <SeasonTeamsForm season={season}
                                handleChange={handleChange}
                                toggle={toggle}
                                setSeason={setSeason} />}
            {isOpen.seasonRounds &&
                <SeasonRoundsForm season={season}
                                handleChange={handleChange}
                                toggle={toggle}
                                setSeason={setSeason}
                                orgId={orgId} />}
            {isOpen.manualForm &&
                <ManualSeasonForm season={season}
                                setSeason={setSeason}
                                gamesToDatabase={gamesToDatabase} />}
            {orgId && !isOpen.preview &&
                <Button onClick={cancelSeason}
                        variant='dark'
                        id='cancelSeasonCreateButton'>
                    Cancel Season Create
                </Button>}
            {orgId && isOpen.preview && !season.seasonId &&
                <Button onClick={saveSeason}
                        variant='dark'
                        id='topSaveButton'>
                    Save Season    
                </Button>}
            {isOpen.preview &&
                <GameList games={Object.values(season.games)} />}
            {orgId && isOpen.preview && !season.seasonId &&
                <Button onClick={saveSeason}
                        variant='dark'
                        className='addDelete'>
                    Save Season    
                </Button>}
        </div>
    );
};

export default NewSeason;