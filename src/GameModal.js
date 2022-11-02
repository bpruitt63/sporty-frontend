import React from 'react';
import {Modal} from 'react-bootstrap';

function GameModal({game, type, setPopupGame}) {

    const hideModal = () => setPopupGame({display: false, type, game});

    return (
        <Modal show centered onHide={hideModal}>
            <p>{type}</p>
            <button onClick={hideModal}>
                Cancel
            </button>
        </Modal>
    );
};

export default GameModal;