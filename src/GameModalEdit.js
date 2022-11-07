import React, {useState} from 'react';
import {Button, Form, Row, Col} from 'react-bootstrap';

function GameModalEdit({game, data, handleChange, canEditScore, nullScore, handleSubmit}) {

    const [canEditScores] = useState(canEditScore(game));

    

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <p className={`modalGameTop modalGame${game.team1Color}`}>
                    <span className='modalTeam'>
                        {game.team1Name || 'Team TBD'}
                    </span>
                    <span className='modalTeam'>
                        {game.team1Id && game.team2Id && canEditScores &&
                            <Form.Control type='number'
                                            min='0'
                                            max='999'
                                            name={`team1Score`}
                                            value={data.team1Score !== null ? data.team1Score : ''}
                                            onChange={handleChange} />
                        }
                        {!canEditScores && game.team1Score &&
                            `${game.team1Score}`}
                    </span>
                </p>
                <Row className='modalDateTime'>
                    <Col xs={12} sm={7} className='modalDateColumn modalFormSpacing'>
                        <Form.Control type='date'
                                        name='gameDate'
                                        value={data.gameDate || ''}
                                        onChange={handleChange} />
                    </Col>
                    <Col xs={12} sm={5} className='modalDateColumn modalFormSpacing'>
                        <Form.Control type='time'
                                name='gameTime'
                                value={data.gameTime || ''}
                                onChange={handleChange} />
                    </Col> 
                </Row>
                <Form.Group as={Row} controlId='gameLocation' className='modalLocation'>
                    <Form.Label column xs={3}>
                        Location:
                    </Form.Label>
                    <Col xs={9} className='modalFormSpacing'>
                        <Form.Control type='text'
                                        name={`gameLocation`}
                                        value={data.gameLocation || ''}
                                        onChange={handleChange} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='notes' className='modalLocation'>
                    <Form.Label column xs={12} sm={3}>
                        Notes:
                    </Form.Label>
                    <Col xs={12} sm={9} className='modalFormSpacing'>
                        <Form.Control as='textarea'
                            rows={3}
                            name='notes'
                            value={data.notes || ''}
                            onChange={handleChange} />
                    </Col>
                </Form.Group>
                {game.team1Id && game.team2Id && canEditScores &&
                    <Button onClick={nullScore}
                            variant='outline-secondary'
                            className='modalFormSpacing'>
                            Remove Score
                    </Button>}
                <p className={`modalGameBottom modalGame${game.team2Color}`}>
                    <span className='modalTeam'>
                        {game.team2Name || 'Team TBD'}
                    </span>
                    <span className='modalTeam'>
                        {game.team1Id && game.team2Id && canEditScores &&
                            <Form.Control type='number'
                                            min='0'
                                            max='999'
                                            name={`team2Score`}
                                            value={data.team2Score !== null ? data.team2Score : ''}
                                            onChange={handleChange} />
                        }
                        {!canEditScores && game.team2Score &&
                            `${game.team2Score}`}
                    </span>
                </p>
            </Form>
        </div>
    );
};

export default GameModalEdit;