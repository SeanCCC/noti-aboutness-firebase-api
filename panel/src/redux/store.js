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
  hightlightHashTable: {},
  highlightKey: null,
  highlightIdx: null,
  highlightMode: null,
  doneParticipants: [],
  totalPaidNumber: [],
  totalUnpaidNumber: []
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
          hightlightHashTable: {},
          highlightKey: null,
          highlightIdx: null,
          highlightMode: null
        }
      }
      const number = state[key][idx]
      const hightlightHashTable = number.payload
        .reduce((acc, cur) => {
          acc[cur.uid] = true
          return acc
        }, {})
      const highlightMode = number.dangerous ? 'dangerous' : number.warning ? 'warning' : 'active'
      return {
        ...state,
        hightlightHashTable,
        highlightKey: key,
        highlightIdx: idx,
        highlightMode
      }
    }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
