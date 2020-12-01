import {ADD_MESSAGE, ADD_MESSAGES, ADD_USER, ADD_USERS, ADD_VALUE_MESSAGE} from "../types";

export const firebaseReducer = (state, payload) => {
  switch (payload.type) {
    case ADD_USER:
      return {
        ...state,
        user: payload.user
      }
    case ADD_USERS: {
      return {
        ...state,
        users: [...payload.users]
      }
    }
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          payload.message
        ]
      }
    case ADD_MESSAGES:
      return {
        ...state,
        messages: [...payload.messages]
      }
    case ADD_VALUE_MESSAGE:
      return {
        ...state,
        currentValueMessage: payload.value
      }
  }
}
