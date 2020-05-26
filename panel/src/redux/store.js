import { createStore } from 'redux'

const initState = {
  consentPendingParticipants: [],
  researchPendingParticipants: [],
  consentPendingNumber: [],
  researchPendingNumber: [],
  candidates: []
}

const reducer = (state = initState, action) => {
  const { payload, type } = action
  switch (type) {
    case 'UPDATE_CANDIDATES': {
      return {
        ...state,
        ...payload
      }
    }
    case 'UPDATE_PARTICIPANTS': {
      return {
        ...state,
        ...payload
      }
    }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
