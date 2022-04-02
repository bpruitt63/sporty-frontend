import React from 'react';
import {Alert} from 'react-bootstrap';

/** Creates alert text for any API or validation errors from 
 * form submissions
 */

function Errors({formErrors={}, apiErrors={}}) {
    return (
        <div className='Errors'>
            {Object.keys(formErrors).map((key, e) => 
                <Alert key={e} variant='danger'>{formErrors[key]}</Alert>)}
            {Object.keys(apiErrors).map((key, e) => 
                <Alert key={e} variant='warning'>{apiErrors[key]}</Alert>)}
        </div>
    )
};

export default Errors;