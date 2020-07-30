import { createStore } from 'redux'

const initState = {
  consentPendingParticipants: [],
  researchPendingParticipants: [],
  researchRunningParticipants: [],
  uploadRecord: {},
  researchRunningNumber: [],
  consentPendingNumber: [],
  researchPendingNumber: [],
  candidates: [],
  candidatesNumber: [],
  researchDoneParticipants: [],
  researchDoneNumber: []
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
    case 'UPDATE_UPLOAD_RECORD': {
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
