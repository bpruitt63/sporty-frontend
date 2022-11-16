import React, {useState} from 'react';
import {Modal, Button, Spinner} from 'react-bootstrap';
import {useHandleChange, useErrors} from './hooks';
import Errors from './Errors';
import GameModalDetail from './GameModalDetail';
import GameModalEdit from './GameModalEdit';

function GameModal({game, edit, setPopupGame, isEditor, canEditScore, updateGame}) {

    const initialState = {team1Score: game.team1Score, team2Score: game.team2Score,
                            gameLocation: game.gameLocation || '', gameDate: game.gameDate,
                            gameTime: game.gameTime, notes: game.notes || ''};
    const [data, handleChange, setData] = useHandleChange(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();

    const hideModal = () => setPopupGame({display: false, edit, game});
    const setToEdit = () => setPopupGame({display: true, edit: true, game});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setApiErrors({});
        setErrors({});
        if (!validateGame(data)) {
            setIsLoading(false);
            return false;
        };
        const dataToSubmit = formatInputs(game, data);
        try {
            await updateGame(game, dataToSubmit);
            setPopupGame({display: false, edit: false, game});
        } catch (err) {
            getApiErrors(err);
            setIsLoading(false);
        };
    };

    const validateGame = (gameData) => {
        if (gameData.gameLocation.length > 50) {
            setErrors({error: 'Location cannot exceed 50 characters'});
            return false;
        };
        if (gameData.notes.length > 1000) {
            setErrors({error: 'Notes cannot exceed 1000 characters'});
            return false;
        };
        if ((gameData.team1Score === null && gameData.team2Score !== null) ||
                (gameData.team2Score === null && gameData.team1Score !== null)) {
                    setErrors({error: 'Both team scores are required if entering score'});
                    return false;
        } else if (gameData.team1Score !== null && +gameData.team1Score === +gameData.team2Score) {
            setErrors({error: 'Tournament games cannot end in a tie'});
            return false;
        } else if (((game.team1Score !== null && +game.team1Score !== +gameData.team1Score) ||
                    (game.team2Score !== null && +game.team2Score !== +gameData.team2Score)) &&
                    !canEditScore) {
            setErrors({error: 'Cannot edit score if subsequent game has already been played'});
            return false;
        };
        return true;
    };

    const formatInputs = (game, data) => {
            if (!data.gameDate) {
                data.gameDate = null;
            };
            if (!data.gameTime) {
                data.gameTime = null;
            } else if (data.gameTime?.length !== 8) {
                data.gameTime += ':00';
            };
            if (!game.team1Id || !game.team2Id) {
                data.team1Score = null;
                data.team2Score = null;
            };
            if (data.team1Score) data.team1Score = parseInt(data.team1Score);
            if (data.team2Score) data.team2Score = parseInt(data.team2Score);
        return data;
    };

    const nullScore = (e) => {
        e.preventDefault();
        setErrors({});
        if (!canEditScore) {
            setErrors({error: 'Cannot remove score if subsequent game has already been played'});
            return false;
        };
        setData({...data,
                team1Score: null,
                team2Score: null});
    };

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    };


    return (
        <Modal show centered 
                onHide={hideModal} 
                backdrop={edit ? 'static' : true}>
            <Modal.Body className='noPadding'>
                <Errors apiErrors={apiErrors}
                        formErrors={errors} />
                {edit ?
                    <GameModalEdit game={game} 
                                    data={data} 
                                    handleChange={handleChange} 
                                    canEditScore={canEditScore}
                                    nullScore={nullScore}
                                    handleSubmit={handleSubmit} />
                    :
                    <GameModalDetail game={game} />}
            </Modal.Body>
            <Modal.Footer className='tournamentModalFooter'>
                <Button onClick={hideModal} 
                        variant='dark'>
                    Cancel
                </Button>
                {isEditor &&
                    <Button onClick={edit ? handleSubmit : setToEdit}
                            variant='outline-secondary'>
                        {edit ? 'Save' : 'Edit'}
                    </Button>}
            </Modal.Footer>
        </Modal>
    );
};

export default GameModal;