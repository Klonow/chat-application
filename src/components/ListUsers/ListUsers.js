import React, {useContext, useState} from 'react'
import {firebaseContext} from "../../context/firebase/firebaseContext";
import ListUsersClasses from './listUsers.scss'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

export const ListUsers = (props) => {
  const {handlerClickUser, open, setOpen, logout} = props
  const {data} = useContext(firebaseContext)
  const [itemLocalId, setItemLocalId] = useState()

  const exitToAppIconStyle = {
    position: 'absolute',
    left: '40px',
    width: '30px',
    height: '30px',
    padding: '10px',
    cursor: 'pointer',
    transition: 'color 0.3s ease-in-out',
    zIndex: 1
  }

  const toggleClassAndHandleClickUser = (localId, name) => {
    handlerClickUser(localId, name)
    setItemLocalId(localId)
  }

  return (
    <>
      <div className="chat-main__menu-toggle">
        <input type="checkbox" defaultChecked={open} id="menu__toggle" />
        <label className="menu__btn" htmlFor="menu__toggle" onClick={() => setOpen(!open)}>
          <span></span>
        </label>
      </div>

      <ExitToAppIcon
        onClick={() => logout()}
        style={exitToAppIconStyle}
        className={'exit-to-app'}
      />

      <div className="chat__list-users">
        <ul className="list-users">
          {
            data.users.length === 0
              ? <li>Загрузка</li>
              : data.users.length > 1
              ? data.users.map((user, index) => {
                if (user.localId !== data.user.localId) {
                  return (
                    <li
                      key={index}
                      onClick={() => toggleClassAndHandleClickUser(user.localId, user.name)}
                      className={`list-users__item ${user.localId === itemLocalId ? 'list-users-item_active' : ''}`}
                    >
                      <div className="list-users__item-img">
                        <div className={`user-online ${user.online ? 'user-online_online' : 'user-online_offline'}`}/>
                      </div>
                      <span className="list-users__item-user-name">{user.name}</span>
                    </li>
                  )
                }
              })
              : <li>Нет пользователей</li>
          }
        </ul>
      </div>
    </>
  )
}
