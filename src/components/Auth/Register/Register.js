import RegisterClasses from './register.scss'
import React, { useContext, useRef } from 'react'
import { AuthenticationContext } from '../../../context/authentication/authenticationContext'
import {Redirect} from 'react-router'
import {Input} from '../../UI/Input/Input'

export const Register = props => {
  const { state } = useContext(AuthenticationContext)
  const refs = {
    password: useRef(),
    password2: useRef()
  }

  if(state.isAuth) {
    return <Redirect to={'/messages'} />
  }

  return (
    <div className={props.registerFormOpen ? "form__toggle form-toggle_active" : "form__toggle"}>
      <div className="form__open" onClick={props.registerFormOpeningHandler}/>
      <div className="form-toggle">
        <div className="form-panel__header">
          <h1>Регистрация</h1>
        </div>
        <div className="form-panel__error-validation">
          {props.error}
        </div>
        <div className="form-panel__content">
          <form className="form-group" onSubmit={props.handleSubmit}>
            <Input
              placeholder='E-mail'
              className="form-group__username"
              onChange={props.handleInput}
              value={state.mail.value}
              type='text'
              id='register-mail'
              name='mail'
              required='required'
            />
            <Input
              placeholder='Пароль'
              className="form-group__password"
              onChange={(event) => props.handleInput(event, refs)}
              value={state.password.value}
              type='password'
              id='register-password'
              name='password'
              required='required'
              reference={refs.password}
            />
            <Input
              placeholder='Подтвердите пароль'
              className="form-group__password"
              onChange={(event) => props.handleInput(event, refs)}
              value={state.password2.value}
              type='password'
              id='register-password2'
              name='password2'
              required='required'
              reference={refs.password2}
            />
            <div className={!props.isValidForm ? 'form-group__btn-disabled' : "form-group__btn"}>
              <button
                disabled={!props.isValidForm}
                type="submit"
              >Зарегистрироваться</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
