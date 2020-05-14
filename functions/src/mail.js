const nodemailer = require('nodemailer')
const { fetchDB } = require('./utils')
const { join } = require('path')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'notiatmuilab@gmail.com',
    clientId: '565872836833-65pu6hjk8ro591l2a3kp2leun7omqtqm.apps.googleusercontent.com',
    clientSecret: 'D0BlAebCEWqXUa2sIGIi-e-s',
    refreshToken: '1//04L8W328tcK3ACgYIARAAGAQSNwF-L9IrGL_iahZCsKcR6x5DMyXMJkuIVji8DFd268AwAJ3Z6U3Gh7QUkmVSlKPMwMQmN3cA7g4'
  }
})

const sendEmailCheck = (to, name, gender, id) => {
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: to,
    subject: 'MUILAB通知實驗-信箱驗證信',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，感謝您費時填寫招募問卷，請點擊連結以完成信箱驗證：<a href="https://notiaboutness.muilab.org/recruit/mailcheck?id=${id}">驗證連結</a></p>`
  }
  return transporter.sendMail(config)
}

const fetchEmailInfo = async (id, path) => {
  const result = await fetchDB(join(path, id))
  const { email, name, gender } = result
  const info = { email, name, gender }
  return info
}

const sendAcceptMail = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'candidate')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗信箱驗證信',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，感謝您願意參與此研究，<a href="https://notiaboutness.muilab.org/participant/orientation?id=${id}">此網站</a>會引導您完成知情同意流程，請您點擊並按照指引完成所有步驟。</p>`
  }
  return transporter.sendMail(config)
}

const sendDeclineMail = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'candidate')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-報名結果回報',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，非常感謝您對此研究有興趣，但為了維持樣本平衡，我們暫時無法將您納入此實驗。在未來如果需要您的協助，本團隊也將優先邀請您參與研究，感激不盡！</p>`
  }
  return transporter.sendMail(config)
}

const sendInterviewInvitation = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'participant')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-訪談邀約',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，<br/>在檢視您提供的寶貴資訊後，我們希望邀請您進行訪談。這是<a href="https://notiaboutness.muilab.org/participant/interview/invitation?id=${id}">邀請函</a>，期待您的回應。</p>`
  }
  return transporter.sendMail(config)
}

const sendCompensationMail = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'participant')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-報酬領取',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，<br/>您已經完成所有的實驗流程，請依照<a href="https://notiaboutness.muilab.org/participant/compensation/choosemail?id=${id}">報酬領取資訊</a>的流程，提供團隊付款所需的資訊，感激不盡。</p>`
  }
  return transporter.sendMail(config)
}

module.exports = { sendEmailCheck, sendAcceptMail, sendDeclineMail, sendInterviewInvitation, sendCompensationMail }
