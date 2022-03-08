import React from 'react';

function Modal({message, cancel, confirm}) {

    return (
        <div>
            <p>{message}</p>
            <button onClick={cancel}>Cancel</button>
            <button onClick={confirm}>Confirm</button>
        </div>
    );
};

export default Modal;