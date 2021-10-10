import React, { Fragment, useState } from 'react';
import {Switch,Route} from 'react-router-dom';

import UsersState from './context/UsersState';

import Navbar from './UI/Navbar';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import Alert from './UI/Alert';

import './App.css';

function App() {

  const [alert, setAlert] = useState(null);

  const showAlert = (message, status)=> {
    setAlert({
      msg: message,
      status: status
    });
    setTimeout(()=> {
      setAlert(null);
    },1500)
  }

  return (
    <Fragment>
      <Navbar showAlert={showAlert} />
      <Alert alert={alert} />
      <UsersState>
      <Switch>

        <Route exact path="/">
          <Profile />
        </Route>

        <Route exact path="/register">
          <Register showAlert={showAlert} />
        </Route>

        <Route exact path="/login">
          <Login showAlert={showAlert} />
        </Route>

      </Switch>
      </UsersState>
    </Fragment>
  );
}

export default App;
