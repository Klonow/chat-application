import React, {useReducer} from "react"
import {firebaseContext} from './firebaseContext'
import firebase from "firebase/app"
import 'firebase/firestore';
import {firebaseReducer} from "./firebaseReducer"
import {ADD_MESSAGE, ADD_MESSAGES, ADD_USER, ADD_USERS, ADD_VALUE_MESSAGE} from '../types'

export const FirebaseState = ({children}) => {
  const firebaseConfig = {
    apiKey: "AIzaSyD0ohlcNsDveKbLmsGO960owVz2LaDkboY",
    authDomain: "chat-app-20b51.firebaseapp.com",
    databaseURL: "https://chat-app-20b51.firebaseio.com",
    projectId: "chat-app-20b51",
    storageBucket: "chat-app-20b51.appspot.com",
    messagingSenderId: "529471513375",
    appId: "1:529471513375:web:2d54822608cb457c26462a"
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  const db = firebase.firestore()

  const initialState = {
    messages: [],
    user: '',
    users: [],
    currentValueMessage: ''
  }

  const [state, dispatch] = useReducer(firebaseReducer, initialState)

  const setUser = () => {
    db.collection("chat").doc("users").get().then((doc) => {
      const data = doc.data()

      Object.keys(data).map(key => {
        const user = data[key]
        if (user.localId === JSON.parse(localStorage.getItem('localId'))) {
          dispatch({type: ADD_USER, user})
        }
      })
    })
  }

  const setUsers = () => {
    db.collection("chat").doc("users")
      .onSnapshot(function (doc) {
        const data = doc.data()

        dispatch({
          type: ADD_USERS,
          users: Object.keys(data).map(key => data[key])
        })
      })
  }

  const setMessages = messages => {
    dispatch({
      type: ADD_MESSAGES,
      messages
    })
  }

  const setValueCurrentMessage = value => {
    dispatch({
      type: ADD_VALUE_MESSAGE,
      value
    })
  }

  const addMessageInFirestore = (clickedUser) => {
    if (!state.currentValueMessage.trim().length) {
      return false
    }

    const document = {
      default: `${state.user.localId}:${clickedUser}`,
      revers: `${clickedUser}:${state.user.localId}`
    }

    const message = {
      messageText: state.currentValueMessage,
      localId: state.user.localId,
      id: state.messages[0].type === 'error' ? 0 : state.messages.length
    }

    const collection = db.collection("messages")

    collection.get().then(querySnapshot => {
      const sendMessagesInFirestore = doc => {
        collection.doc(doc).set({
          [Date.now()]: {
            ...message
          }
        }, {merge: true})
      }

      let _boolean = false

      querySnapshot.forEach(doc => {
        if (doc.id === document.revers || doc.id === document.default) {
          sendMessagesInFirestore(doc.id)
          _boolean = !_boolean
        }
      })

      if (!_boolean) sendMessagesInFirestore(document.default)
    })

    dispatch({type: ADD_MESSAGE, message})
    setValueCurrentMessage('')
  }

  return (
    <firebaseContext.Provider value={{
      firebase,
      data: state,
      setUser,
      setUsers,
      addMessageInFirestore,
      setMessages,
      setValueCurrentMessage
    }}>
      {children}
    </firebaseContext.Provider>
  )
}
