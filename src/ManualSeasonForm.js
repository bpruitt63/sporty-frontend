import React, {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner, Button, Form, Row, Col } from 'react-bootstrap';
import { useErrors } from './hooks';
import { validateGames, formatInputs } from './static/helpers';
import NewGameForm from './NewGameForm';
import Errors from './Errors';

function ManualSeasonForm({season, setSeason, gamesToDatabase}) {

    const {orgId} = useParams();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const navigate = useNavigate();

    const bye = parseInt(Object.keys(season.teams).find(key => season.teams[key].teamName === 'Bye'));

    const newGame = {team1Id: '',
                        team2Id: '',
                        gameDate: null,
                        gameTime: null,
                        gameLocation: '',
                        team1Score: null,
                        team2Score: null,
                        notes: ''};

    const handleGameChange = (e) => {
        let {name, value} = e.target;
        name = name.split(' ');
        let games = season.games;
        games = {...games,
                        [name[1]]: {
                            ...games[name[1]],
                            [name[0]]: value
                        }};
        setSeason(d => ({...d, games}));
    };
    
    const changeNumberOfGames = (moreLess) => {
        const games = season.games;
        const keys = Object.keys(season.games);
        moreLess === 'less' ? delete games[keys[keys.length - 1]]
                    : games[keys.length + 1] = newGame;
        setSeason({...season, games});
    };

    const nullScore = (e) => {
        e.preventDefault();
        const {id} = e.target;
        const games = {...season.games}
        games[id] = {...games[id],
                team1Score: null,
                team2Score: null}
        setSeason({...season, games});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiErrors({});

        if (!validateGames(season.games, setErrors)) return false;
        const games = formatInputs(season.games, bye);
        setIsLoading(true);

        try {
            await gamesToDatabase(Object.values(games));
            setSeason({...season, games});
            navigate(`/organization/${orgId}/seasons/${season.seasonId}`);
        } catch (err) {
            getApiErrors(err);
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
            <Errors formErrors={errors}
                    apiErrors={apiErrors} />
            <Form onSubmit={handleSubmit}>
                {Object.keys(season.games).map(g =>
                    <div key={g} className='gameContainer gameContainer-manual'>
                        <NewGameForm g={g}
                                    season={season}
                                    handleGameChange={handleGameChange}
                                    nullScore={nullScore}
                                    bye={bye} />
                    </div>
                    )}
                <Button type='submit'
                        variant='dark'>
                    Save Season
                </Button>
            </Form>
            <Row className='addRemove'>
                <Col xs={6}>
                    <Button onClick={() => changeNumberOfGames('less')}
                            variant='warning'>
                        Remove Last Game
                    </Button>
                </Col>
                <Col>
                    <Button onClick={() => changeNumberOfGames('more')}
                            variant='secondary'>
                        Add Game
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default ManualSeasonForm;