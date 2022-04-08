import React from 'react';
import {Container} from 'react-bootstrap';

function Attributions({isMobile}) {

    return (
        <div className={isMobile ? 'attributionsM' : 'attributions'}>
            <Container>
                <p>Background Photo by{' '}
                    <a href='https://unsplash.com/@willianjusten?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'
                            target='blank'>
                        Willian Justen de Vasconcellos
                    </a>
                    {' '}on{' '}
                    <a href='https://unsplash.com/s/photos/sports?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'
                            target='blank'>
                        Unsplash
                    </a>
                </p>
            </Container>
        </div>
    );
};

export default Attributions;