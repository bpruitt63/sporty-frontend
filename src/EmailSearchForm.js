import React, {useState} from 'react';
import {Col, Button, Form, InputGroup} from 'react-bootstrap';
import Errors from './Errors';
import UserUpdateForm from './UserUpdateForm';
import {useHandleChange} from './hooks';

function EmailSearchForm({user}) {

    const [targetEmail, setTargetEmail] = useState();
    const initialState = {email: ''};
    const [data, handleChange, setData] = useHandleChange(initialState);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        /** Validates form and sets error */
        if (!data.email || !data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            setErrors({error: "Not a valid email address"})
            setData(initialState);
            return false;
        } else {
            setTargetEmail(data.email);
        };
    };

    return (
        <div>
            <Errors formErrors={errors} />
            {!targetEmail &&
                <Form onSubmit={handleSubmit}>
                    <Col xs={{span: 10, offset: 1}} md={{span: 6, offset: 3}}>
                        <Form.Group controlId='email'>
                            <Form.Label className='message'>Enter User's Email</Form.Label>
                            <InputGroup>
                                <Form.Control type='text'
                                            name='email'
                                            placeholder="User's Email"
                                            value={data.email}
                                            onChange={handleChange} />
                                <Button type='submit'
                                        variant='dark'>
                                    Get User
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    
                    
                    </Col>
                </Form>}
            {targetEmail && <UserUpdateForm user={user}
                            targetEmail={targetEmail} />}
        </div>
    )
};

export default EmailSearchForm;