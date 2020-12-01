import React, {useContext, useState} from 'react'
import ChatClasses from './chat.scss'
import {AuthenticationContext} from '../../context/authentication/authenticationContext'
import {firebaseContext} from '../../context/firebase/firebaseContext'
import {Redirect} from 'react-router'
import {ListUsers} from '../ListUsers/ListUsers'
import {ChatRoom} from '../ChatRoom/ChatRoom'

export const Chat = () => {
  const {firebase, data, addMessageInFirestore, setMessages, setValueCurrentMessage} = useContext(firebaseContext)
  const {state, logout} = useContext(AuthenticationContext)
  const db = firebase.firestore();
  const [messageRecipient, setMessageRecipient] = useState({})
  const [openListUser, setOpenListUser] = useState(true)

  if (!state.isAuth) {
    return <Redirect to={'/login'}/>
  }

  const handlerClickUser = (localId, name, event) => {
    setMessageRecipient({localId, name})
    setMessages([])

    const collection = db.collection("messages")

    const document = {
      default: `${data.user.localId}:${localId}`,
      revers: `${localId}:${data.user.localId}`
    }

    const documents = [document.revers, document.default]

    for (let index = 0; index < documents.length; index++) {
      const iterableDocument = documents[index]

      collection.doc(iterableDocument).onSnapshot(doc => {
        const message = doc.data()

        if (message) {
          return setMessages(
            Object.keys(message)
              .map(key => message[key])
              .sort((a, b) => a.id - b.id)
          )
        } else if (index === documents.length--) {
          setMessages([{type: 'error', errorMessage: 'Нет сообщений'}])
        }
      })
    }
  }

  return (
    <div className="chat">
      <div className={`chat-main ${openListUser ? 'chat-list-user_active' : ''}`}>
        <ListUsers
          handlerClickUser={handlerClickUser}
          open={openListUser}
          setOpen={setOpenListUser}
          logout={logout}
        />
        <ChatRoom
          messageRecipient={messageRecipient}
          setMessage={setValueCurrentMessage}
          addMessage={addMessageInFirestore}
          state={data}
        />
      </div>
    </div>
  )
}
