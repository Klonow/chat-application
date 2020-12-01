import React from 'react'
import {AlertMessage} from "../UI/AlertMessage/AlertMessage";
import DialogsClasses from './dialogs.scss'

export const Dialogs = props => {
  const {data, messageRecipient} = props
  return (
    <div className="dialog">
      {
        messageRecipient
          ? data.messages.length
          ? data.messages[0].type === 'error'
            ? <AlertMessage message={data.messages[0].errorMessage} />
            : data.messages.map((message, key) => {
              const actionUser = data.user.localId === message.localId
                ? 'sender'
                : 'recipient'

              return <div key={key} className={`dialog-${actionUser}`}>
                <div className={`dialog-${actionUser}__img`}/>
                <div className={`dialog-${actionUser}__message`}>{message.messageText}</div>
              </div>
            })
          : <AlertMessage message='Загрузка' />
          : <AlertMessage message='Выберите, кому хотите написать' />
      }
    </div>
  )
}
