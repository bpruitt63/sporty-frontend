import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {useHandleChange} from './hooks';
import GameModalDetail from './GameModalDetail';
import GameModalEdit from './GameModalEdit';

function GameModal({game, edit, setPopupGame, isEditor}) {

    const initialState = {team1Score: game.team1Score, team2Score: game.team2Score,
                            gameLocation: game.gameLocation, gameDate: game.gameDate,
                            gameTime: game.gameTime};
    const [data, handleChange] = useHandleChange(initialState);

    const hideModal = () => setPopupGame({display: false, edit, game});
    const setToEdit = () => setPopupGame({display: true, edit: true, game});

    const handleSubmit = () => console.log(game);

    return (
        <Modal show centered 
                onHide={hideModal} 
                backdrop={edit ? 'static' : true}>
            <Modal.Body>
                {edit ?
                    <GameModalEdit game={game} data={data} handleChange={handleChange} />
                    :
                    <GameModalDetail game={game} />}
            </Modal.Body>
            <Modal.Footer>
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