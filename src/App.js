import React, {useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import jwt_decode from 'jwt-decode';
import './static/styles/App.css';
import './static/styles/Form.css';
import SportyApi from './SportyApi';
import Routing from './Routing';
import NavB from './NavB';

function App() {

  const [user, setUser] = useState(localStorage.token &&
                        jwt_decode(localStorage.getItem("token")).user);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleLogin = (token) => {
      localStorage.setItem("token", token);
      setUser(jwt_decode(token).user);
      SportyApi.token = token;
  };

  return (
    <div className="App">
      <NavB user={user} 
                handleLogin={handleLogin}
                isMobile={isMobile} />
      <Routing user={user}
                setUser={setUser}
                handleLogin={handleLogin}
                isMobile={isMobile} />
    </div>
  );
};

export default App;