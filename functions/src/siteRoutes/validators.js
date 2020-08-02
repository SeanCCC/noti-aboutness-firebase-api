const { fetchParticipantDetailById } = require('../utils')
const status = require('../status')
const check = require('check-types')

const validator = (bodyValidator = () => true, userValidator = () => true, validStatus) => async (req, res, next) => {
  const payload = req.body
  if (!bodyValidator(payload)) return res.status(400).send('invalid body')
  const { id } = payload
  if (check.not.nonEmptyString(id)) return res.status(400).send('invalid id')
  const result = await fetchParticipantDetailById(id)
  console.log({ result })
  if (result === null || result.status !== validStatus || !userValidator(result)) {
    return res.status(400).send('unauth')
  }
  req.body.userDetail = result
  next()
}

const interviewDone = validator(({ rsvp }) => {
  return check.boolean(rsvp)
}, ({ rsvp }) => {
  return check.undefined(rsvp)
}, status.INTERVIEW_INVITED)

const compensation = validator(({ payMethod, linePayAccount, jkoAccount, bankAccount, bankCode }) => {
  if (payMethod === 'linePay') {
    return check.nonEmptyString(linePayAccount)
  } else if (payMethod === 'jko') {
    return check.nonEmptyString(jkoAccount)
  } else if (payMethod === 'bankTransfer') {
    return check.nonEmptyString(bankAccount) && check.nonEmptyString(bankCode)
  } else return false
}, ({ payDetail }) => {
  return check.undefined(payDetail)
}, status.SET_PAY_METHOD)

const receipt = validator(({ mailMethod }) => {
  return check.nonEmptyString(mailMethod)
}, ({ receiptMailMethod }) => {
  return check.undefined(receiptMailMethod)
}, status.SET_RECEIPT_MAIL_METHOD)

const sendConsent = validator(({ mailMethod }) => {
  return check.nonEmptyString(mailMethod)
}, ({ mailMethod }) => {
  return check.undefined(mailMethod)
}, status.VIDEO_DONE)

const video = validator(undefined, undefined, status.INIT)

const bigfive = validator(({ result }) => {
  return check.array.of.inRange(result, 1, 5) && result.length === 50
}, undefined, status.CONSENT_VALID)

const bind = validator(({ result }) => {
  return check.array.of.inRange(result, 1, 5) && result.length === 50
}, undefined, status.CONSENT_VALID)

module.exports = {
  interviewDone,
  compensation,
  receipt,
  sendConsent,
  video,
  bigfive,
  bind
}
