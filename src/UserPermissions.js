import React, {useState} from 'react';
import { Spinner, Form, Button } from 'react-bootstrap';
import SportyApi from './SportyApi';
import {useErrors, useToast} from './hooks';
import Errors from './Errors';

function UserPermissions({targetUser, orgId}) {

    const [isLoading, setIsLoading] = useState(false);
    const initialState = targetUser.organizations[orgId] ? 
                    targetUser.organizations[orgId].adminLevel : 3;
    const [val, setVal] = useState(initialState);
    const [apiErrors, getApiErrors, setApiErrors] = useErrors();
    const [message, toast] = useToast();


    const handleRadio = (val) => {
        setVal(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiErrors({});
        setIsLoading(true);

        if (val === 4){
            try{
                await SportyApi.removeUserOrganization(orgId, targetUser.email);
                toast('User successfully removed from organization');
            } catch (err) {
                getApiErrors(err);
            };
        } else {
            if (orgId in targetUser.organizations){
                try{
                    await SportyApi.updateLocalAdmin(orgId, 
                                targetUser.email, {adminLevel: val});
                    toast('Permissions updated');
                } catch (err) {
                    getApiErrors(err);
                };
            } else {
                try {
                    await SportyApi.addUserOrganization(orgId, 
                                targetUser.email, {adminLevel: val});
                    toast('User successfully added to organization');
                } catch (err) {
                    getApiErrors(err);
                };
            };
        };
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    };

    return (
        <div className='userPermissionContainer'>
            <h6>{targetUser.firstName} {targetUser.lastName}</h6>
            <Errors apiErrors={apiErrors}/>
            {message && <p className='toastMsg'>{message}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Check type='radio' 
                        id='adminLevel1'
                        label='Organization Admin'
                        checked={val === 1}
                        onChange={() => handleRadio(1)} />
                <Form.Check type='radio' 
                        id='adminLevel2'
                        label='Organization Editor'
                        checked={val === 2}
                        onChange={() => handleRadio(2)} />
                <Form.Check type='radio' 
                        id='adminLevel3'
                        label='No Permissions'
                        checked={val === 3}
                        onChange={() => handleRadio(3)} />
                <Form.Check type='radio' 
                        id='adminLevel4'
                        label='Remove User From Organization'                            checked={val === 4}
                        onChange={() => handleRadio(4)} />
                <Button type='submit'
                        variant='dark'>
                    Confirm
                </Button>
            </Form>
        </div>
    )
};

export default UserPermissions;