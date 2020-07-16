import { createStore } from 'redux'

const mockOngoing = [{
  uid: 'ad2sfsas',
  email: 'sean831004@hotmail.com',
  name: 'Sean Chang',
  meanNoti: 3,
  meanForm: 4,
  ExperimentStartDate: '2020/9/9',
  notiDistHourly: [
    { date: '2020/9/9', hour: 0, amount: 0 },
    { date: '2020/9/9', hour: 1, amount: 7 },
    { date: '2020/9/9', hour: 2, amount: 17 },
    { date: '2020/9/9', hour: 3, amount: 15 },
    { date: '2020/9/9', hour: 4, amount: 2 },
    { date: '2020/9/9', hour: 5, amount: 6 },
    { date: '2020/9/9', hour: 6, amount: 9 },
    { date: '2020/9/9', hour: 7, amount: 8 },
    { date: '2020/9/9', hour: 8, amount: 32 },
    { date: '2020/9/9', hour: 9, amount: 2 },
    { date: '2020/9/9', hour: 10, amount: 1 },
    { date: '2020/9/9', hour: 11, amount: 0 },
    { date: '2020/9/9', hour: 12, amount: 15 },
    { date: '2020/9/9', hour: 13, amount: 0 },
    { date: '2020/9/9', hour: 14, amount: 1 },
    { date: '2020/9/9', hour: 15, amount: 15 },
    { date: '2020/9/9', hour: 16, amount: 20 },
    { date: '2020/9/9', hour: 17, amount: 60 },
    { date: '2020/9/9', hour: 18, amount: 1 },
    { date: '2020/9/9', hour: 19, amount: 6 },
    { date: '2020/9/9', hour: 20, amount: 7 },
    { date: '2020/9/9', hour: 21, amount: 22 },
    { date: '2020/9/9', hour: 22, amount: 7 },
    { date: '2020/9/9', hour: 23, amount: 5 },
    { date: '2020/9/10', hour: 0, amount: 6 },
    { date: '2020/9/10', hour: 1, amount: 7 },
    { date: '2020/9/10', hour: 2, amount: 1 },
    { date: '2020/9/10', hour: 3, amount: 15 },
    { date: '2020/9/10', hour: 4, amount: 2 },
    { date: '2020/9/10', hour: 5, amount: 6 },
    { date: '2020/9/10', hour: 6, amount: 9 },
    { date: '2020/9/10', hour: 7, amount: 8 },
    { date: '2020/9/10', hour: 8, amount: 32 },
    { date: '2020/9/10', hour: 9, amount: 2 },
    { date: '2020/9/10', hour: 10, amount: 1 },
    { date: '2020/9/10', hour: 11, amount: 0 },
    { date: '2020/9/10', hour: 12, amount: 15 },
    { date: '2020/9/10', hour: 13, amount: 0 },
    { date: '2020/9/10', hour: 14, amount: 1 },
    { date: '2020/9/10', hour: 15, amount: 15 },
    { date: '2020/9/10', hour: 16, amount: 20 },
    { date: '2020/9/10', hour: 17, amount: 60 },
    { date: '2020/9/10', hour: 18, amount: 1 },
    { date: '2020/9/10', hour: 19, amount: 6 },
    { date: '2020/9/10', hour: 20, amount: 7 },
    { date: '2020/9/10', hour: 21, amount: 22 },
    { date: '2020/9/10', hour: 22, amount: 7 },
    { date: '2020/9/10', hour: 23, amount: 5 },
    { date: '2020/9/11', hour: 0, amount: 6 },
    { date: '2020/9/11', hour: 1, amount: 7 },
    { date: '2020/9/11', hour: 2, amount: 1 },
    { date: '2020/9/11', hour: 3, amount: 15 },
    { date: '2020/9/11', hour: 4, amount: 2 },
    { date: '2020/9/11', hour: 5, amount: 6 },
    { date: '2020/9/11', hour: 6, amount: 9 },
    { date: '2020/9/11', hour: 7, amount: 8 },
    { date: '2020/9/11', hour: 8, amount: 32 },
    { date: '2020/9/11', hour: 9, amount: 2 },
    { date: '2020/9/11', hour: 10, amount: 1 },
    { date: '2020/9/11', hour: 11, amount: 0 },
    { date: '2020/9/11', hour: 12, amount: 15 },
    { date: '2020/9/11', hour: 13, amount: 0 },
    { date: '2020/9/11', hour: 14, amount: 1 },
    { date: '2020/9/11', hour: 15, amount: 15 },
    { date: '2020/9/11', hour: 16, amount: 20 },
    { date: '2020/9/11', hour: 17, amount: 60 },
    { date: '2020/9/11', hour: 18, amount: 1 },
    { date: '2020/9/11', hour: 19, amount: 6 },
    { date: '2020/9/11', hour: 20, amount: 7 },
    { date: '2020/9/11', hour: 21, amount: 22 },
    { date: '2020/9/11', hour: 22, amount: 7 },
    { date: '2020/9/11', hour: 23, amount: 5 }
  ],
  notiDistDaily: [{ date: '2020/9/9', amount: 5 },
    { date: '2020/9/10', amount: 3 },
    { date: '2020/9/11', amount: 2 },
    { date: '2020/9/12', amount: 6 }],
  formDistDaily: [{ date: '2020/9/9', amount: 52 },
    { date: '2020/9/10', amount: 35 },
    { date: '2020/9/11', amount: 65 },
    { date: '2020/9/12', amount: 53 },
    { date: '2020/9/13', amount: 53 },
    { date: '2020/9/14', amount: 53 },
    { date: '2020/9/15', amount: 23 },
    { date: '2020/9/16', amount: 71 },
    { date: '2020/9/17', amount: 66 },
    { date: '2020/9/18', amount: 69 },
    { date: '2020/9/19', amount: 41 },
    { date: '2020/9/20', amount: 33 }],
  lastNoticeDate: ''
}]

const initState = {
  consentPendingParticipants: [],
  researchPendingParticipants: [],
  consentPendingNumber: [],
  researchPendingNumber: [],
  candidates: [],
  candidatesNumber: [],
  researchDoneParticipants: [],
  researchDoneNumber: [],
  researchOngoingParticipants: mockOngoing,
  researchOngoingNumber: []
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
