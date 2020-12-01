import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthenticationState } from './context/authentication/authenticationState'
import {FirebaseState} from './context/firebase/firebaseState'

ReactDOM.render(
  <FirebaseState>
    <AuthenticationState>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthenticationState>
  </FirebaseState>,
  document.getElementById('root')
);
