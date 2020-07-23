import status from '../pages/status'
import moment from 'moment-timezone'
import { firebaseDB } from '../firebaseInit'

function createCandidatesNumber (candidates) {
  const mailYetSent = candidates
    .filter((c) => c.lastInvitationSent === undefined)
    .length
  const now = moment()
  const mailSent3DCount = candidates
    .filter((p) => {
      const then = moment(p.lastInvitationSent)
      const ms = now.diff(then)
      const hours = moment.duration(ms).asHours()
      return hours > 3 * 24
    })
    .length
  const candidatesCount = candidates.length
  return [
    { value: mailYetSent, label: '尚未回應', dangerous: mailYetSent > 0 },
    { value: mailSent3DCount, label: '送出後已過三日', warning: mailSent3DCount > 0 },
    { value: candidatesCount, label: '總人數' }
  ]
}

export const updateCandidates = payload => {
  const { candidates } = payload
  const candidatesNumber = createCandidatesNumber(candidates)
  return {
    type: 'UPDATE_CANDIDATES',
    payload: {
      candidates,
      candidatesNumber
    }
  }
}

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

function createResearchPendingNumber (researchPendingParticipants) {
  const yetConfigAppCount = researchPendingParticipants
    .filter((p) => p.status !== status.APP_VALID)
    .length
  const researchPending = researchPendingParticipants.length
  return [
    { value: yetConfigAppCount, label: '尚未設定App' },
    { value: researchPending, label: '總人數' }
  ]
}

function createResearchDoneNumber (researchDoneParticipants) {
  const yetConfigAppCount = researchDoneParticipants
    .filter((p) => p.status !== status.APP_VALID)
    .length
  const researchDoneCount = researchDoneParticipants.length
  return [
    { value: yetConfigAppCount, label: '尚未設定App' },
    { value: researchDoneCount, label: '總人數' }
  ]
}

export const updateParticipants = payload => {
  const { participants } = payload
  const consentPendingParticipants =
    participants.filter((d) => [status.INIT, status.VIDEO_DONE, status.CONSENT_SENT].includes(d.status))
  const researchRunningParticipants =
    participants.filter((d) => [status.RESEARCH_RUNNING].includes(d.status))
  const researchDoneParticipants =
    participants.filter((d) => [status.RESEARCH_DONE].includes(d.status))
  const researchPendingParticipants =
    participants.filter((d) => [status.CONSENT_VALID, status.BIG_FIVE_DONE, status.APP_VALID].includes(d.status))
  const consentPendingNumber = createPrepareNumber(consentPendingParticipants)
  const researchPendingNumber = createResearchPendingNumber(researchPendingParticipants)
  const researchDoneNumber = createResearchDoneNumber(researchDoneParticipants)
  return {
    type: 'UPDATE_PARTICIPANTS',
    payload: {
      consentPendingParticipants,
      researchPendingParticipants,
      researchRunningParticipants,
      consentPendingNumber,
      researchPendingNumber,
      researchDoneParticipants,
      researchDoneNumber
    }
  }
}

export const updateUploadRecord = (uploadRecord) => {
  return {
    type: 'UPDATE_UPLOAD_RECORD',
    payload: {
      uploadRecord
    }
  }
}
