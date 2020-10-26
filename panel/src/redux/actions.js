import status from '../pages/status'
import moment from 'moment-timezone'
import _ from 'lodash'

function createCandidatesNumber (candidates) {
  const mailYetSent = candidates
    .filter((c) => c.lastInvitationSent === undefined)
  const now = moment()
  const mailSent3DCount = candidates
    .filter((p) => {
      const then = moment(p.lastInvitationSent)
      const ms = now.diff(then)
      const hours = moment.duration(ms).asHours()
      return hours > 3 * 24
    })
  const candidatesCount = candidates
  return [
    { value: mailYetSent.length, label: '尚未回應', dangerous: mailYetSent.length > 0, payload: mailYetSent },
    { value: mailSent3DCount.length, label: '送出後已過三日', warning: mailSent3DCount.length > 0, payload: mailSent3DCount },
    { value: candidatesCount.length, label: '總人數', payload: candidatesCount }
  ]
}

export const updateCandidates = payload => {
  const candidates = payload
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
  const consentSent = consentPendingParticipants
    .filter((p) => p.status === status.CONSENT_CHOSEN)
  const now = moment()
  const consentSent3D = consentPendingParticipants
    .filter((p) => {
      const then = moment(p.consentSentTime)
      const ms = now.diff(then)
      const hours = moment.duration(ms).asHours()
      return p.status === status.CONSENT_CHOSEN && hours > 3 * 24
    })
  const consentPending = consentPendingParticipants
  return [
    { value: consentSent3D.length, label: '送出後已過三日', dangerous: consentSent3D.length > 0, payload: consentSent3D },
    { value: consentSent.length, label: '已經送出', warning: consentSent.length > 0, payload: consentSent },
    { value: consentPending.length, label: '總人數', payload: consentPending }
  ]
}

function createResearchPendingNumber (researchPendingParticipants) {
  const yetConfigAppCount = researchPendingParticipants
    .filter((p) => p.status !== status.APP_VALID)
  const researchPending = researchPendingParticipants
  return [
    { value: yetConfigAppCount.length, label: '尚未設定App', payload: yetConfigAppCount },
    { value: researchPending.length, label: '總人數', payload: researchPending }
  ]
}

function createResearchDoneNumber (researchDoneParticipants) {
  const now = moment().tz('Asia/Taipei')
  const yetInviteOrPay = researchDoneParticipants
    .filter((p) => p.status === status.RESEARCH_DONE)
  const notResponding = researchDoneParticipants
    .filter((p) => {
      if (p.status !== status.INTERVIEW_INVITED) return false
      const time = p.interviewInviteRemindTime || p.interviewInviteTime
      const then = moment(time)
      const ms = now.diff(then)
      const hours = moment.duration(ms).asHours()
      return hours > 3 * 24
    })
  const notScheduled = researchDoneParticipants
    .filter((p) => {
      if (p.status !== status.INTERVIEW_ACCEPTED) return false
      return !p.interviewScheduleTime
    })
  const notSendingReceipt = researchDoneParticipants
    .filter((p) => {
      if (p.status !== status.SET_RECEIPT_MAIL_METHOD) return false
      const time = p.receiptReminderSent || p.askPaymentTime
      const then = moment(time)
      const ms = now.diff(then)
      const hours = moment.duration(ms).asHours()
      return hours > 3 * 24
    })
  const notSettingPayMethod = researchDoneParticipants
    .filter((p) => {
      if (p.status !== status.SET_PAY_METHOD) return false
      const time = p.payMethodReminderSent || p.lastStatusChanged
      const then = moment(time)
      const ms = now.diff(then)
      const hours = moment.duration(ms).asHours()
      return hours > 3 * 24
    })
  const yetPay = researchDoneParticipants
    .filter((p) => p.status === status.PAYMENT_REQUIRED)
  return [
    { value: yetInviteOrPay.length, label: '尚未邀請訪談或付款', dangerous: yetInviteOrPay.length > 0, payload: yetInviteOrPay },
    { value: notResponding.length, label: '三天未回覆邀約', warning: notResponding.length > 0, payload: notResponding },
    { value: notScheduled.length, label: '尚未安排訪談', dangerous: notScheduled.length > 0, payload: notScheduled },
    { value: notSendingReceipt.length, label: '領據三天未寄出', warning: notSendingReceipt.length > 0, payload: notSendingReceipt },
    { value: notSettingPayMethod.length, label: '支付方法三天未設定', warning: notSettingPayMethod.length > 0, payload: notSettingPayMethod },
    { value: yetPay.length, label: '尚未支付', dangerous: yetPay.length > 0, payload: yetPay }
  ]
}

export const updateParticipants = payload => {
  const participants = payload
  const consentPendingParticipants =
    participants.filter((d) => [status.INIT, status.VIDEO_DONE, status.CONSENT_CHOSEN, status.CONSENT_SENT].includes(d.status))
  const researchRunningParticipants =
    participants.filter((d) => [status.RESEARCH_RUNNING].includes(d.status))
  const researchDoneParticipants =
    participants.filter((d) => [status.RESEARCH_DONE, status.SET_RECEIPT_MAIL_METHOD,
      status.SET_PAY_METHOD, status.PAYMENT_REQUIRED, status.PAYMENT_DONE,
      status.INTERVIEW_INVITED, status.INTERVIEW_ACCEPTED, status.INTERVIEW_SCHEDULED].includes(d.status))
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

const completeDaily = (esmDistDaily = [], notiDistDaily = [], daysBetween = []) => {
  let _esmDistDaily = [...esmDistDaily]
  let _notiDistDaily = [...notiDistDaily]
  daysBetween.slice(0, -1).forEach(date => {
    if (_esmDistDaily.find(dist => dist.date === date) === undefined) {
      _esmDistDaily.push({ date, amount: 0 })
    }
    if (_notiDistDaily.find(dist => dist.date === date) === undefined) {
      _notiDistDaily.push({ date, amount: 0 })
    }
  })
  _esmDistDaily = _.sortBy(_esmDistDaily, r => new Date(r.date))
  _notiDistDaily = _.sortBy(_notiDistDaily, r => new Date(r.date))
  return { esmDistDaily: _esmDistDaily, notiDistDaily: _notiDistDaily }
}

const completeHourly = (notiDistHourly = [], daysBetween = []) => {
  const hoursInDay = [...Array(24).keys()]
  const distTable = notiDistHourly.reduce((acc, cur) => {
    const { hour, date, amount } = cur
    if (acc[date] === undefined) acc[date] = {}
    acc[date][hour] = amount
    return acc
  }, {})
  const _notiDistHourly = []
  daysBetween.forEach((date) => hoursInDay.forEach(hour => {
    const amount = !distTable[date] ? 0 : !distTable[date][hour] ? 0 : distTable[date][hour]
    _notiDistHourly.push({ date, hour, amount })
  }))
  return _notiDistHourly
}

const completeRecord = (record) => {
  const {
    researchStartDate,
    esmDistDaily,
    notiDistDaily,
    notiDistHourly,
    totalEsmCount,
    totalNotiCount
  } = record
  const today = moment().tz('Asia/Taipei').startOf('day')
  const startDay = moment.tz(researchStartDate, 'YYYY-MM-DD', 'Asia/Taipei')
  const ms = today.diff(startDay)
  const dnum = moment.duration(ms).asDays() + 1
  const daysBetween = [...Array(dnum).keys()].map(
    n => moment(startDay).add(n, 'days').format('YYYY-MM-DD')
  )
  const _dayly =
    completeDaily(esmDistDaily, notiDistDaily, daysBetween)
  const _notiDistHourly = completeHourly(notiDistHourly, daysBetween)
  const meanEsmCount = dnum <= 1 ? null : _.round(totalEsmCount / (dnum - 1), 2)
  const meanNotiCount = dnum <= 1 ? null : _.round(totalNotiCount / (dnum - 1), 2)
  return {
    ...record,
    esmDistDaily: _dayly.esmDistDaily,
    notiDistDaily: _dayly.notiDistDaily,
    notiDistHourly: _notiDistHourly,
    meanEsmCount,
    meanNotiCount
  }
}

function createResearchRunningNumber (uploadRecord) {
  const yesterday = moment().tz('Asia/Taipei').subtract(1, 'days').format('YYYY-MM-DD')
  const noYesterdayNoti = _.filter(uploadRecord, (r) => {
    const { notiDistDaily } = r
    if (!notiDistDaily) return true
    const yesterdayNoti = notiDistDaily.find(d => d.date === yesterday)
    if (!yesterdayNoti) return false
    if (yesterdayNoti.amount === 0) return true
    return false
  })
  const lowEsmCount = _.filter(uploadRecord, (r) => {
    const { meanEsmCount } = r
    if (meanEsmCount === null) return false
    return meanEsmCount < 3
  })
  return [
    { value: noYesterdayNoti.length, label: '昨日無上傳通知', dangerous: noYesterdayNoti.length > 0, payload: noYesterdayNoti },
    { value: lowEsmCount.length, label: 'esm填寫量少', warning: lowEsmCount.length > 0, payload: lowEsmCount }
  ]
}

export const updateUploadRecord = (uploadRecord) => {
  let _uploadRecord = uploadRecord
    .map(completeRecord)
  const researchRunningNumber = createResearchRunningNumber(_uploadRecord)
  _uploadRecord = _uploadRecord.reduce((acu, cur) => {
    acu[cur.uid] = cur
    return acu
  }, {})
  return {
    type: 'UPDATE_UPLOAD_RECORD',
    payload: {
      uploadRecord: _uploadRecord,
      researchRunningNumber
    }
  }
}

export const setNumberHightlight = (key, idx) => {
  return {
    type: 'SET_NUMBER_HIGHTLIGHT',
    payload: { key, idx }
  }
}

export const updateDone = (doneParticipants) => {
  return {
    type: 'UPDATE_DONE_PARTICIPANTS',
    payload: {
      doneParticipants
    }
  }
}
