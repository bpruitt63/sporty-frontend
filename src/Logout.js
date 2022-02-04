import {Navigate} from 'react-router-dom';
import { useEffect } from 'react';
import SportyApi from './SportyApi';

function Logout({setUser}) {

    /** Removes token from local storage and API */
    useEffect(() => {
        localStorage.removeItem("token");
        SportyApi.token = '';
        setUser(null);
    }, [setUser]);
    

    return <Navigate to='/' />
};

export default Logout;