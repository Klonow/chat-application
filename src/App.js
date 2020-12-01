import React from 'react';
import './App.scss';
import {Authenticated} from "./components/Auth/Authenticated";
import { Redirect, Route, Switch } from "react-router";
import {Chat} from "./components/Chat/Chat";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/login' exact component={() => <Authenticated /> } />
        <Route path='/messages' component = {() => <Chat />} />
        <Redirect from="/" to="/login" />
        <Redirect to='/' />
      </Switch>
    </div>
  );
}

export default App;
