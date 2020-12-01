import React from 'react'
import {Dialogs} from "../Dialogs/Dialogs"
import SendIcon from '@material-ui/icons/Send'

export const ChatRoom = props => {
  const {messageRecipient, setMessage, state, addMessage} = props

  const sendIconStyle = {
    color: '#6F729A',
    fontSize: '40px',
    cursor: state.currentValueMessage.length ? 'pointer' : 'no-drop'
  }

  return (
    <div className="chat__room">
      <Dialogs data={state} messageRecipient={messageRecipient.localId}/>
      {
        messageRecipient.localId
          ? <div className="chat-send-message">
            <input
              value={state.currentValueMessage}
              onChange={(event) => setMessage(event.target.value)}
              onKeyPress={(event) => event.key === 'Enter' ? addMessage(messageRecipient.localId) : null}
              placeholder="Сообщение..."
              type="text"
              className="chat-send-message__input"
            />
            <SendIcon
              style={sendIconStyle}
              onClick={() => addMessage(messageRecipient.localId)}
            />
          </div>
          : null
      }
    </div>
  )
}
