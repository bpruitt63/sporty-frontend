import React from 'react';
import {Link} from 'react-router-dom';
import {Container} from 'react-bootstrap';

function Attributions() {

    return (
        <div className='attributions' sticky='bottom'>
            <Container>
                <p>Background Photo by{' '}
                    <Link to={{pathname: 'https://unsplash.com/@willianjusten?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'}}
                            target='blank'>
                        Willian Justen de Vasconcellos
                    </Link>
                    {' '}on{' '}
                    <Link to={{pathname: 'https://unsplash.com/s/photos/sports?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'}}
                            target='blank'>
                        Unsplash
                    </Link>
                </p>
            </Container>
        </div>
    );
};

export default Attributions;