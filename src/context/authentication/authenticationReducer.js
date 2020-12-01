import {
  ADD_VALUE,
  CHANGE_CURRENT_ACTION,
  RESET_ERROR,
  RESET_STATE,
  SET_AUTH_USER,
  SET_ERROR,
  SET_VALID_FORM
} from "../types";

export const authenticationReducer = (state, payload) => {
  switch (payload.type) {
    case ADD_VALUE:
      return {
        ...state, [payload.name]: {
          ...state[payload.name],
          value: payload.value
        }
      }
    case SET_ERROR: return {
      ...state,
      [payload.name]: {
        ...state[payload.name],
        messageError: payload.messageError,
        isValid: true,
        disabledBtn: true
      }
    }
    case RESET_ERROR: return {
      ...state,
      [payload.name]: {
        ...state[payload.name],
        messageError: '',
        isValid: false
      }
    }
    case SET_VALID_FORM:
      return {
        ...state,
        validForm: payload.isValid
      }
    case CHANGE_CURRENT_ACTION:
      return {
        ...state,
        currentAction: payload.name
      }
    case SET_AUTH_USER:
      return {
        ...state,
        isAuth: payload.isAuth
      }
    case RESET_STATE: {
      return {
        ...state,
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
    }
    default: return state
  }
}
