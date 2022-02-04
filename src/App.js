import React, {useState} from 'react';
import jwt_decode from 'jwt-decode';
import './App.css';
import SportyApi from './SportyApi';
import Routing from './Routing';
import NavB from './NavB';

function App() {

  const [user, setUser] = useState(localStorage.token &&
                        jwt_decode(localStorage.getItem("token")).user);

  const handleLogin = (token) => {
      localStorage.setItem("token", token);
      setUser(jwt_decode(token).user);
      SportyApi.token = token;
  };

  return (
    <div className="App">
      <NavB user={user} 
                handleLogin={handleLogin} />
      <Routing user={user}
                setUser={setUser}
                handleLogin={handleLogin} />
    </div>
  );
};

export default App;