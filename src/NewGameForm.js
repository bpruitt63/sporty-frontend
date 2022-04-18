import React from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';

function NewGameForm({g, season, handleGameChange, nullScore, bye}) {

    return (
        <div>
            <Row className='gameTime'>
                <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 1}}>
                    <Form.Control type='date'
                            name={`gameDate ${g}`}
                            id={`gameDate ${g}`}
                            value={season.games[g].gameDate || ''}
                            onChange={handleGameChange} />
                </Col>
                {parseInt(season.games[g].team1Id) !== bye && 
                parseInt(season.games[g].team2Id) !== bye &&
                    <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 1}}>
                        <Form.Control type='time'
                                name={`gameTime ${g}`}
                                id={`gameTime ${g}`}
                                value={season.games[g].gameTime || ''}
                                onChange={handleGameChange} />
                    </Col>}
            </Row>
            <Row className='matchup'>
                <Col xs={12} md={5} 
                    className={season.games[g].team1Id ? `matchup${season.teams[season.games[g].team1Id].color}` : 'matchupN/A'}>
                    <Col xs={{span: 10, offset: 1}}>
                        <Form.Select value={season.games[g].team1Id}
                                onChange={handleGameChange}
                                name={`team1Id ${g}`}
                                id={`team1Id ${g}`}>
                            <option value={''}>Select Team</option>
                            {Object.keys(season.teams).map(t =>
                                <option value={t}
                                        key={t}>
                                    {season.teams[t].teamName}
                                </option>)}
                        </Form.Select>
                        {parseInt(season.games[g].team1Id) !== bye && 
                        parseInt(season.games[g].team2Id) !== bye &&
                            <Form.Group controlId={`team1Score ${g}`} 
                                        className='scoreEdit'>
                                <Form.Label column xs={4}>
                                    Score:{' '}
                                </Form.Label>
                                <Col xs={4}>
                                    <Form.Control type='number'
                                                min='0'
                                                max='999'
                                                name={`team1Score ${g}`}
                                                value={season.games[g].team1Score || ''}
                                                onChange={handleGameChange} />
                                </Col>
                            </Form.Group>}
                    </Col>
                </Col>
                <Col xs={12} md={2} className='vs'>
                    vs 
                </Col>
                <Col xs={12} md={5} 
                    className={season.games[g].team2Id ? `matchup${season.teams[season.games[g].team2Id].color}` : 'matchupN/A'}>
                    <Col xs={{span: 10, offset: 1}}>
                        <Form.Select value={season.games[g].team2Id}
                                onChange={handleGameChange}
                                name={`team2Id ${g}`}
                                id={`team2Id ${g}`}>
                            <option value={''}>Select Team</option>
                            {Object.keys(season.teams).map(t =>
                                <option value={t}
                                        key={t}>
                                    {season.teams[t].teamName}
                                </option>)}
                        </Form.Select>
                        {parseInt(season.games[g].team1Id) !== bye && 
                        parseInt(season.games[g].team2Id) !== bye &&
                            <Form.Group controlId={`team2Score ${g}`} 
                                        className='scoreEdit'>
                                <Form.Label column xs={4}>
                                    Score:{' '}
                                </Form.Label>
                                <Col xs={4}>
                                    <Form.Control type='number'
                                                min='0'
                                                max='999'
                                                name={`team2Score ${g}`}
                                                value={season.games[g].team2Score || ''}
                                                onChange={handleGameChange} />
                                </Col>
                            </Form.Group>}
                    </Col>
                </Col>
            </Row>
            {parseInt(season.games[g].team1Id) !== bye && 
             parseInt(season.games[g].team2Id) !== bye &&
                <Row className='locationRow'>
                    <Col xs={12} md={6}>
                        <Form.Group controlId={`gameLocation ${g}`}>
                            <Form.Label column xs={4}>
                                Location:{' '}
                            </Form.Label>
                            <Col xs={8}>
                                <Form.Control type='text'
                                            name={`gameLocation ${g}`}
                                            placeholder='Location'
                                            value={season.games[g].gameLocation}
                                            onChange={handleGameChange} />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col xs={{span: 10, offset: 1}} md={{span: 6, offset: 0}}>
                        <Button onClick={nullScore}
                                variant='outline-secondary'
                                id={g}>
                            Remove Score
                        </Button>
                    </Col>
                </Row>}
            <Form.Group controlId={`notes ${g}`}>
                <Form.Label>
                    Notes: 
                </Form.Label>
                <Col xs={{span: 10, offset: 1}} className='newGameNotes'>
                    <Form.Control as='textarea'
                            name={`notes ${g}`}
                            rows={3}
                            placeholder='Notes'
                            value={season.games[g].notes}
                            onChange={handleGameChange} />
                </Col>
            </Form.Group>
        </div>
    );
};

export default NewGameForm;