import React, {useContext, useEffect, useReducer} from 'react'
import {AuthenticationContext} from './authenticationContext'
import {authenticationReducer} from './authenticationReducer'
import {firebaseContext} from "../firebase/firebaseContext";
import axios from 'axios'
import {ADD_VALUE, CHANGE_CURRENT_ACTION, RESET_ERROR, RESET_STATE, SET_AUTH_USER, SET_ERROR} from "../types";

export const AuthenticationState = ({children}) => {
  const initialState = {
    currentAction: 'login',
    isAuth: false,
    mail: {
      value: '',
      messageError: '',
      isValid: false
    },
    password: {
      value: '',
      messageError: '',
      isValid: false
    },
    password2: {
      value: '',
      messageError: '',
      isValid: false
    }
  }

  useEffect(initializationChat, [])

  const {firebase, setUser, setUsers, data} = useContext(firebaseContext)
  const [state, dispatch] = useReducer(authenticationReducer, initialState)
  const db = firebase.firestore()

  const resetAuthState = () => {
    dispatch({type: RESET_STATE, resetState: initialState})
  }

  function initializationChat() {
    autoLogin()
    setUsers()
    setUser()
  }

  const actions = {
    changeAuthorizationMethod(name) {
      dispatch({ type: CHANGE_CURRENT_ACTION, name })
    },
    setErrorMessage(name, messageError) {
      dispatch({ type: SET_ERROR, name, messageError })
    },
    clearErrorMessage(name) {
      dispatch({ type: RESET_ERROR, name })
    },
    setAuthUser(isAuth) {
      dispatch({type: SET_AUTH_USER, isAuth})
    }
  }

  const autoLogin = () => {
    const expiresIn = (new Date(localStorage.getItem('date')).getTime() - new Date().getTime())

    setTimeout(() => logout(), expiresIn)

    if(localStorage.getItem('localId')) {
      actions.setAuthUser(true)
    }
  }

  const logout = () => {
    if(data.user.localId !== undefined) {
      db.collection("chat").doc('users').set({
        [data.user.localId]: {
          online: false,
        }
      }, {merge: true})
    }

    localStorage.removeItem('localId')
    localStorage.removeItem('date')

    actions.setAuthUser(false)
  }

  const handleInput = (event, refs) => {
    const passwordMinLength = 6
    const {value, name} = event.target

    dispatch({type: ADD_VALUE, value, name})

    if (name === 'password' && value.length < passwordMinLength) {
      actions.setErrorMessage('password', `Пароль должен содержать не менее ${passwordMinLength} символов`)
    } else {
      actions.clearErrorMessage('password')
    }

    if (name === 'mail' && value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null) {
      actions.setErrorMessage('mail', 'Некорректный email')
    } else if (name === 'mail') {
      actions.clearErrorMessage('mail')
    }

    if (state.currentAction === 'register') {
      if (name === 'password2' || name === 'password') {
        if(refs.password2.current.value.length < passwordMinLength) {
          actions.setErrorMessage(
            'password2',
            `Подтверждающий пароль должен быть не менее ${passwordMinLength}`
          )
          return;
        }


        if (refs.password.current.value !== refs.password2.current.value) {
          actions.setErrorMessage('password2', 'Пароли не совпадают')
        } else {
          actions.clearErrorMessage('password2')
        }
      }
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const action = state.currentAction === 'login' ? 'signInWithPassword' : 'signUp'

    const dataUser = {
      email: state.mail.value,
      password: state.password.value,
      returnSecureToken: true
    }

    actions.setErrorMessage('password')

    await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${process.env.REACT_APP_API_KEY}`, dataUser)
      .then(response => {

        localStorage.setItem('localId', JSON.stringify(response.data.localId))
        localStorage.setItem('date', new Date(new Date().getTime() + 3600 * 1000))

        const {localId, expiresIn, idToken} = response.data
        const name = state.mail.value.split('@')[0]

        const dataUser = {
          [localId]: {
            name,
            online: true,
            expiresIn,
            idToken,
            localId
          }
        }

        db.collection("chat").doc('users').set(dataUser, {merge: true})
        initializationChat()
        resetAuthState()
        actions.changeAuthorizationMethod('login')
      }).catch(error => {
        const messageError = error.response.data.error.message

        switch (messageError) {
          case 'EMAIL_EXISTS':
            actions.setErrorMessage('mail', 'Такой E-mail адрес уже существует')
            break;
          case 'EMAIL_NOT_FOUND':
            actions.setErrorMessage('mail', 'Пользователь с таким E-mail не существует')
            break;
          case 'INVALID_PASSWORD':
            actions.setErrorMessage('password', 'Неправильный пароль')
            break;
          default:
            actions.setErrorMessage('Неизвестная ошибка')
        }
      })
  }

  return (
    <AuthenticationContext.Provider
      value={{
        state,
        logout,
        handleInput,
        handleSubmit,
        changeAuthorizationMethod: actions.changeAuthorizationMethod,
        resetAuthState
      }}>
      {children}
    </AuthenticationContext.Provider>
  )
}
