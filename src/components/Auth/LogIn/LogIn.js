import React, { useContext } from 'react'
import { AuthenticationContext } from '../../../context/authentication/authenticationContext'
import {Redirect} from 'react-router'
import LoginClasses from './login.scss'
import {Input} from '../../UI/Input/Input'

export const LogIn = props => {
  const { state } = useContext(AuthenticationContext)

  if(state.isAuth) {
    return <Redirect to={'/messages'} />
  }

  return (
    <div className="form__panel">
      <div className="form-panel">
        <div className="form-panel__header">
          <h1>ВХОД В АККАУНТ</h1>
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
              id='login-mail'
              name='mail'
              required='required'
            />
            <Input
              placeholder='Пароль'
              className="form-group__password"
              onChange={props.handleInput}
              value={state.password.value}
              type='password'
              id='login-password'
              name='password'
              required='required'
            />
            <div className={!props.isValidForm ? 'form-group__btn form-group__btn-disabled' : "form-group__btn"}>
              <button
                disabled={!props.isValidForm}
                type="submit"
              >Войти</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
