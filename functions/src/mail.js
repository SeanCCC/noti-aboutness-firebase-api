const nodemailer = require('nodemailer')
const { fetchDB } = require('./utils')
const { join } = require('path')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'notiatmuilab@gmail.com',
    clientId: '217090144295-pt9048452rmom8aq5721oo7ak83cbah0.apps.googleusercontent.com',
    clientSecret: 'ysWBMCIJTlI64Siftk0eBS9H',
    refreshToken: '1//04KDiWhXPct-rCgYIARAAGAQSNwF-L9Ircq9bTxvI28GkSaqEyUGqcIF1t2B_bzLg5NonsQrrO_7_avAK16WcNNEmxhwJLS2heRQ'
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
    subject: 'MUILAB通知實驗-信箱驗證信',
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

const sendPreResearchRemind = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'participant')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-實驗前提醒信',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，<br/>我們發現您在同階段停留了一段時間，如果有任何疑問歡迎您直接聯絡研究團隊，<br/>感激不盡！</p>`
  }
  return transporter.sendMail(config)
}
const sendConsentAcceptMail = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'participant')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-同意書確認信',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，<br/>我們已經確認了您的同意書，<br/>請進入<a href="https://notiaboutness.muilab.org/participant/bigfive?id=${id}">此研究網站</a>進行下一步，<br/>感激不盡！</p>`
  }
  return transporter.sendMail(config)
}

const sendResearchRemind = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'participant')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-實驗中提醒信',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，<br/>我們發現您的實驗狀態異常，請確認App是否有正常運作，並持續投入實驗，<br/>感激不盡！</p>`
  }
  return transporter.sendMail(config)
}

const sendConsentRemind = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'participant')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-同意書提交提醒信',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，<br/>我們發現您尚未完成同意書的寄出回報，希望您盡早寄出並從<a href="https://notiaboutness.muilab.org/participant/instruction?id=${id}">此網站</a>回報，<br/>感激不盡！</p>`
  }
  return transporter.sendMail(config)
}

const askPaymentMail = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'participant')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-報酬收取流程',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，<br/>感謝您完成此實驗，希望依照<a href="https://notiaboutness.muilab.org/participant/compensation/choosemail?id=${id}">此網站</a>步驟領取報酬，<br/>感激不盡！</p>`
  }
  return transporter.sendMail(config)
}

const sendReceiptRemind = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'participant')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-領據提交提醒信',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，<br/>我們發現您尚未完成領據的寄出回報，希望您盡早寄出並從<a href="https://notiaboutness.muilab.org/participant/compensation/choosemail?id=${id}">此網站</a>回報，<br/>感激不盡！</p>`
  }
  return transporter.sendMail(config)
}

const sendPayMethodRemind = async (id) => {
  const { email, name, gender } = await fetchEmailInfo(id, 'participant')
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-報酬領取方法設定提醒信',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，<br/>我們發現您尚未設定報酬的領取方法，希望您盡早從<a href="https://notiaboutness.muilab.org/participant/compensation/choosepay?id=${id}">此網站</a>選擇領取方法，<br/>感激不盡！</p>`
  }
  return transporter.sendMail(config)
}

module.exports = {
  sendEmailCheck,
  sendAcceptMail,
  sendDeclineMail,
  sendInterviewInvitation,
  sendCompensationMail,
  sendPreResearchRemind,
  sendConsentAcceptMail,
  sendResearchRemind,
  sendConsentRemind,
  askPaymentMail,
  sendReceiptRemind,
  sendPayMethodRemind
}
