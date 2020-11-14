const nodemailer = require('nodemailer')
const { fetchDB } = require('./utils')
const { join } = require('path')
const moment = require('moment-timezone')
const status = require('./status')

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

const mailTemplate = (lines) => {
  const phead = '<p>'
  const pend = '</p>'
  const content = lines.join('<br/>').concat('<br/>')
  const farewell = '<br/>研究團隊 敬啟'
  const result = phead + content + farewell + pend
  return result
}

const sendEmailCheck = (to, name, id) => {
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '感謝您費時填寫招募問卷，',
    `請點擊連結以完成信箱驗證：<a href="https://notiaboutness.muilab.org/recruit/mailcheck?id=${id}">驗證連結</a>，`,
    '感激不盡!'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: to,
    subject: 'MUILAB通知實驗-信箱驗證信',
    html
  }
  return transporter.sendMail(config)
}

const fetchEmailInfo = async (id, path) => {
  const result = await fetchDB(join(path, id))
  return result
}

const sendAcceptMail = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'candidate')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '感謝您願意參與此研究，',
    `<a href="https://notiaboutness.muilab.org/participant/orientation?id=${id}">此網站</a>會引導您完成知情同意流程，`,
    '請您點擊並按照指引完成所有步驟。'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗',
    html
  }
  return transporter.sendMail(config)
}

const sendDeclineMail = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'candidate')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '非常感謝您對此研究有興趣，',
    '但為了維持樣本數據平衡，',
    '我們暫時無法將您納入此實驗。',
    '在未來如果需要您的協助，',
    '本團隊也將優先邀請您參與研究，',
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-報名結果回報',
    html
  }
  return transporter.sendMail(config)
}

const sendCompensationMail = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '您已經完成所有的實驗流程，',
    `請依照<a href="https://notiaboutness.muilab.org/participant/compensation/choosemail?id=${id}">報酬領取資訊</a>的流程，`,
    '提供團隊支付報酬所需的資訊，',
    '感激不盡。'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-報酬領取',
    html
  }
  return transporter.sendMail(config)
}

const sendPreResearchRemind = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們發現您在同階段停留了一段時間，',
    '如果有任何疑問歡迎您直接聯絡研究團隊，',
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-實驗前提醒信',
    html
  }
  return transporter.sendMail(config)
}
const sendConsentAcceptMail = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們已經確認了您的同意書，',
    `請進入<a href="https://notiaboutness.muilab.org/participant/bigfive?id=${id}">此研究網站</a>進行填寫研究相關量表，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-同意書確認信',
    html
  }
  return transporter.sendMail(config)
}

const sendConsentMailInfo = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '感謝您選擇了交付同意書的方法，',
    '請盡量在一周內交付同意書',
    `<a href="https://notiaboutness.muilab.org/participant/mailinfo?id=${id}">此研究網站</a>提供了必要的交付細節，`,
    '在交付後點擊網站上的上的『通知團隊信件已經寄出』，',
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-交付細節',
    html
  }
  return transporter.sendMail(config)
}

const sendConsentReversedMail = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們已經將您的同意書與信封寄過去了，',
    `查收後請進入<a href="https://notiaboutness.muilab.org/participant/mailinfo?id=${id}">此研究網站</a>進行下一步，`,
    '並在郵寄後點擊網站上的上的『通知團隊信件已經寄出』。',
    '請盡量在一周內寄出，',
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-回郵已寄出',
    html
  }
  return transporter.sendMail(config)
}

const sendResearchStartMail = async (id) => {
  const { email, name, researchStartDate } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    `您的實驗已經於今日${researchStartDate}開始，`,
    '請記得從今日起開始填寫表單，',
    '如果想知道您已完成的表單數量，',
    `請進入<a href="https://notiaboutness.muilab.org/participant/score?id=${id}">此研究網站</a>，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-實驗開始',
    html
  }
  return transporter.sendMail(config)
}

const sendResearchRemind = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們發現您的實驗狀態異常，',
    '請確認App是否有正常運作，',
    '並持續投入實驗，',
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-實驗中提醒信',
    html
  }
  return transporter.sendMail(config)
}

const sendConsentRemind = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們發現您尚未完成同意書的寄出回報，',
    `希望您盡早寄出並從<a href="https://notiaboutness.muilab.org/participant/instruction?id=${id}">此網站</a>回報，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-同意書提交提醒信',
    html
  }
  return transporter.sendMail(config)
}

const askPaymentMail = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '感謝您完成此實驗，',
    `請依照<a href="https://notiaboutness.muilab.org/participant/compensation/choosemail?id=${id}">此網站</a>的步驟領取報酬，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-報酬收取流程',
    html
  }
  return transporter.sendMail(config)
}

const sendReceiptRemind = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們發現您尚未完成領據的寄出回報，',
    `希望您盡早寄出並從<a href="https://notiaboutness.muilab.org/participant/compensation/choosemail?id=${id}">此網站</a>回報，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-領據提交提醒信',
    html
  }
  return transporter.sendMail(config)
}

const sendPayMethodRemind = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們發現您尚未設定報酬的領取方法，',
    `希望您盡早從<a href="https://notiaboutness.muilab.org/participant/compensation/choosepay?id=${id}">此網站</a>選擇領取方法，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-報酬領取方法設定提醒信',
    html
  }
  return transporter.sendMail(config)
}

const sendPayCompleteMail = async (id, payDate) => {
  const { email, name, payDetail, compensation } = await fetchEmailInfo(id, 'participant')
  const { payMethod } = payDetail
  let payInfo = ''
  if (payMethod === 'bankTransfer') payInfo = `支付方式:轉帳<br/>帳號末五碼:07085<br/>銀行代號:808 玉山銀行<br/>支付時間:${payDate}`
  else if (payMethod === 'jko') payInfo = `支付方式:街手支付<br/>名稱:Sean<br/>街口帳戶末五碼:00841<br/>支付時間:${payDate}`
  else if (payMethod === 'linePay') payInfo = `支付方式:Line pay<br/>名稱:張忠喬 Sean<br/>支付時間:${payDate}`
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    `我們已完成報酬${compensation}元的支付，`,
    '以下是我們的支付資訊：',
    payInfo,
    '若有問題請務必聯絡我們。',
    '您已完成所有實驗步驟，再次感謝您的參與！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-付款完成通知信',
    html
  }
  return transporter.sendMail(config)
}

const sendInterviewInvitation = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '在檢視您提供的寶貴資訊後，',
    '我們希望邀請您進行訪談。',
    '若您願意接受訪談，',
    '研究團隊將提供300元的車馬費。',
    '實驗的報酬也會在訪談當天以現金一併付清。',
    `這是<a href="https://notiaboutness.muilab.org/participant/interview/invitation?id=${id}">邀請函</a>，`,
    '期待您的回應。'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-訪談邀約與報酬領取',
    html
  }
  return transporter.sendMail(config)
}

const sendInterviewInviteReminder = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '由於一直沒收到您的回應，',
    '我們寄出此信提醒您關於訪談邀約的事情。',
    '若您願意接受訪談，',
    '研究團隊將提供300元的車馬費。',
    '實驗的報酬也會在訪談當天以現金一併付清。',
    `這是<a href="https://notiaboutness.muilab.org/participant/interview/invitation?id=${id}">邀請函</a>，`,
    '希望您能在近期回應。'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-訪談邀約提醒',
    html
  }
  return transporter.sendMail(config)
}

const sendInterviewSchedule = async (id, interviewScheduleTime) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const readableTime = moment(interviewScheduleTime).tz('Asia/Taipei').format('YYYY/MM/DD HH:mm')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    `已將您的訪談安排在${readableTime}，`,
    '地點為交通大學電子資訊中心715實驗室，',
    '訪談與支付流程會在90分鐘內結束，',
    '期待與您相見。'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-訪談安排通知',
    html
  }
  return transporter.sendMail(config)
}

const sendInterviewCancel = async (id) => {
  const { email, name, status: _status } = await fetchEmailInfo(id, 'participant')
  let middleText = '我們將直接進入您的付款階段。'
  if (_status === status.INTERVIEW_INVITED) {
    middleText = '由於團隊已收到足夠的訪談資料，我們將直接進入您的付款階段。'
  } else if (_status === status.INTERVIEW_SCHEDULED || _status === status.INTERVIEW_ACCEPTED) {
    middleText = '已取消您的訪談，我們將直接進入您的付款階段。'
  }
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    middleText,
    `請依照<a href="https://notiaboutness.muilab.org/participant/compensation/choosemail?id=${id}">此網站</a>步驟領取報酬，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-訪談取消通知',
    html
  }
  return transporter.sendMail(config)
}

const sendResearchEndNotice = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '您的實驗任務已經完成，',
    '團隊將在近期與您聯絡報酬事宜。',
    '您可以放心移除研究App，',
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-實驗結束通知',
    html
  }
  return transporter.sendMail(config)
}

const sendApkLink = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const apkFileLink = 'https://firebasestorage.googleapis.com/v0/b/noti-aboutness-firebase-48728.appspot.com/o/app-debug-2.0.8-B.apk?alt=media&token=10744971-2d53-4d0f-a9b0-230ad95dd365'
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們是MUILAB的通知研究團隊，',
    `接下來請透過<a href="${apkFileLink}">此連結</a>研究用下載App，`,
    `並依照<a href="https://notiaboutness.muilab.org/participant/instruction?id=${id}">此網站</a>安裝與使用App，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-研究用App下載連結',
    html
  }
  return transporter.sendMail(config)
}

module.exports = {
  sendEmailCheck,
  sendAcceptMail,
  sendDeclineMail,
  sendCompensationMail,
  sendPreResearchRemind,
  sendConsentAcceptMail,
  sendConsentReversedMail,
  sendResearchRemind,
  sendConsentRemind,
  askPaymentMail,
  sendReceiptRemind,
  sendPayMethodRemind,
  sendPayCompleteMail,
  sendInterviewInvitation,
  sendInterviewInviteReminder,
  sendInterviewSchedule,
  sendInterviewCancel,
  sendResearchEndNotice,
  sendResearchStartMail,
  sendConsentMailInfo,
  sendApkLink
}
