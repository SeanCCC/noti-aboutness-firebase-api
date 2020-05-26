import status from '../pages/status'
import moment from 'moment-timezone'

export const updateCandidates = payload => ({
  type: 'UPDATE_CANDIDATES',
  payload
})

function createPrepareNumber (consentPendingParticipants) {
  const consentSentCount = consentPendingParticipants
    .filter((p) => p.status === status.CONSENT_SENT)
    .length
  const now = moment()
  const consentSent3DCount = consentPendingParticipants
    .filter((p) => {
      const then = moment(p.consentSentTime)
      const ms = now.diff(then)
      const hours = moment.duration(ms).asHours()
      return p.status === status.CONSENT_SENT && hours > 3 * 24
    })
    .length
  const consentPending = consentPendingParticipants.length
  return [
    { value: consentSent3DCount, label: '送出後已過三日', dangerous: consentSent3DCount > 0 },
    { value: consentSentCount, label: '已經送出', warning: consentSentCount > 0 },
    { value: consentPending, label: '總人數' }
  ]
}

function createrResearchPendingNumber (researchPendingParticipants) {
  const yetConfigAppCount = researchPendingParticipants
    .filter((p) => p.status !== status.APP_VALID)
    .length
  const researchPending = researchPendingParticipants.length
  return [
    { value: yetConfigAppCount, label: '尚未設定App' },
    { value: researchPending, label: '總人數' }
  ]
}

export const updateParticipants = payload => {
  const { participants } = payload
  const consentPendingParticipants =
      participants.filter((d) => [status.INIT, status.VIDEO_DONE, status.CONSENT_SENT].includes(d.status))
  const researchPendingParticipants =
      participants.filter((d) => [status.CONSENT_VALID, status.BIG_FIVE_DONE, status.APP_VALID].includes(d.status))
  const consentPendingNumber = createPrepareNumber(consentPendingParticipants)
  const researchPendingNumber = createrResearchPendingNumber(researchPendingParticipants)
  return {
    type: 'UPDATE_PARTICIPANTS',
    payload: {
      consentPendingParticipants,
      researchPendingParticipants,
      consentPendingNumber,
      researchPendingNumber
    }
  }
}
