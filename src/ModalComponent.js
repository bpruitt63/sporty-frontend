import React from 'react';
import {Modal, Button} from 'react-bootstrap';

function ModalComponent({message, cancel, confirm}) {

    return (
        <Modal show centered>
            <Modal.Body>
                <h5>{message}</h5>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={cancel}
                        variant='dark'>
                    Cancel
                </Button>
                <Button onClick={confirm}
                        variant='danger'>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalComponent;