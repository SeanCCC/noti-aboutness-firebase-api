import { createStore } from 'redux'

const initState = {
  consentPendingParticipants: [],
  researchPendingParticipants: [],
  researchRunningParticipants: [],
  uploadRecord: {},
  candidates: [],
  researchDoneParticipants: [],
  researchRunningNumber: [],
  consentPendingNumber: [],
  researchPendingNumber: [],
  candidatesNumber: [],
  researchDoneNumber: [],
  highlightList: [],
  highlightKey: null,
  highlightIdx: null,
  doneParticipants: []
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
    case 'UPDATE_DONE_PARTICIPANTS': {
      return {
        ...state,
        ...payload
      }
    }
    case 'SET_NUMBER_HIGHTLIGHT': {
      const { key, idx } = payload
      if (state.highlightKey === key && state.highlightIdx === idx) {
        return {
          ...state,
          hightlightList: [],
          highlightKey: null,
          highlightIdx: null
        }
      }
      const number = state[key][idx]
      const hightlightList = number.payload.map(p => p.uid)
      console.log({ hightlightList })
      return {
        ...state,
        hightlightList,
        highlightKey: key,
        highlightIdx: idx
      }
    }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
