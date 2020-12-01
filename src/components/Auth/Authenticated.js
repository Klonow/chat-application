import React, {useContext, useState} from 'react'
import styles from './authentication.scss'
import {LogIn} from './LogIn/LogIn';
import {Register} from './Register/Register'
import {AuthenticationContext} from '../../context/authentication/authenticationContext'
import {Redirect} from 'react-router'

export const Authenticated = () => {
  const {handleInput, handleSubmit, state, changeAuthorizationMethod, resetAuthState} = useContext(AuthenticationContext)
  const [registerFormOpen, setRegisterFormOpen] = useState(false)

  const validationForms = state.currentAction === 'login'
    ? ['mail', 'password']
    : ['mail', 'password', 'password2']

  const isValidForm = validationForms.every(form => {
    if (state[form].isValid === false && state[form].value.length) {
      return true
    }
    return false
  })


  const checkedErrors = () => {
    return Object.keys(state).map((field, key) => {
      if (state[field].messageError) {
        return <span key={key} className='form-panel-errors'>{state[field].messageError}</span>
      } else {
        return ''
      }
    })
  }

  const registerFormOpeningHandler = () => {
    const currentAction = state.currentAction === "login"

    changeAuthorizationMethod(currentAction ? 'register' : 'login')
    setRegisterFormOpen(currentAction)
    resetAuthState()
  }

  if(state.isAuth) {
    return <Redirect to={'/messages'} />
  }

  return (
    <div className="form">
      <LogIn
        handleSubmit={handleSubmit}
        handleInput={handleInput}
        isValidForm={isValidForm}
        error={checkedErrors()}
      />
      <Register
        registerFormOpen={registerFormOpen}
        registerFormOpeningHandler={registerFormOpeningHandler}
        handleSubmit={handleSubmit}
        handleInput={handleInput}
        isValidForm={isValidForm}
        error={checkedErrors()}
      />
    </div>
  )
}

