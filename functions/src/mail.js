const nodemailer = require('nodemailer')
const { fetchDB } = require('./utils')
const { join } = require('path')
const moment = require('moment-timezone')
const status = require('./status')
const notiDoc = 'https://docs.google.com/document/d/1Bg6TyPAzUXZy9XaIZiNzPyQGroa4nF2Cx3j36Vwix34/edit?usp=sharing'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'notiatmuilab@gmail.com',
    clientId: '565872836833-65pu6hjk8ro591l2a3kp2leun7omqtqm.apps.googleusercontent.com',
    clientSecret: 'D0BlAebCEWqXUa2sIGIi-e-s',
    refreshToken: '1//04V55JMExBUbzCgYIARAAGAQSNwF-L9IrQk2ymPRMDOTbhrT13XxY8a4Y2zJifACcD5dN84WuPC9sKedrjxACt35E0ICKccXXghw'
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
    '感謝您填寫招募問卷，',
    '我們已經將您納入此實驗。',
    `<a href="https://notiaboutness.muilab.org/participant/orientation?id=${id}">此網站</a>會引導您完成知情同意流程，`,
    '請您點擊並按照指引完成所有步驟。'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗 - 知情同意流程',
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
  const { email, name, compensation } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '您已經完成所有的實驗流程，',
    `您的報酬總共有${compensation}元，`,
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
    `請進入<a href="https://notiaboutness.muilab.org/participant/bigfive?id=${id}">此網站</a>進行填寫研究相關量表，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-同意書已收到，請填寫表單',
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
    `<a href="https://notiaboutness.muilab.org/participant/mailinfo?id=${id}">此網站</a>提供了必要的交付細節，`,
    '請在交付後點擊網站上的『通知團隊同意書已經送出』，',
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
    `查收後請進入<a href="https://notiaboutness.muilab.org/participant/mailinfo?id=${id}">此網站</a>進行下一步，`,
    '並在送出文件後點擊網站上的上的『通知團隊同意書已經送出』。',
    '請盡量在一周內送出文件，',
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-同意書回郵已寄出',
    html
  }
  return transporter.sendMail(config)
}

const sendResearchStartMail = async (id) => {
  const { email, name, researchStartDate } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    `您的實驗已經於今日${researchStartDate}開始，`,
    '請記得開始填寫表單。',
    '',
    '此外如果您在填寫時遇到困難的話，',
    `可以參考<a href="${notiDoc}">此文件</a>對問卷內容的說明，`,
    '如果您需要進一步的幫助也歡迎直接回信給我們。',
    '',
    '如果想知道您已完成的表單數量，',
    '或需要App安裝設定與表單填寫的相關資訊，',
    `請進入<a href="https://notiaboutness.muilab.org/participant/score?id=${id}">此網站</a>查詢，`,
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

const sendFitstEsmReminderMail = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們發現您已經完成首次的問卷填寫，',
    '您的投入對我們來說是很重要的。',
    '',
    '您也有可能在填寫問卷時遇到困惑，',
    `如果是這樣請參考<a href="${notiDoc}">此文件</a>對問卷內容的說明，`,
    '如果您需要進一步的幫助也歡迎直接回信給我們。',
    '',
    '如果想知道您已完成的表單數量，',
    '或需要App安裝設定與表單填寫的相關資訊，',
    `請進入<a href="https://notiaboutness.muilab.org/participant/score?id=${id}">此網站</a>查詢，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-填問卷時感到困惑就看一下',
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
    '我們發現您尚未回報同意書的寄出，',
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
  const { email, name, compensation } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '感謝您完成此實驗，',
    `您的報酬總共是${compensation}元`,
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
    `請點入<a href="https://notiaboutness.muilab.org/participant/interview/invitation?id=${id}">邀請函</a>並回應，`,
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
    `請點入<a href="https://notiaboutness.muilab.org/participant/interview/invitation?id=${id}">邀請函</a>並回應，`,
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
    '團隊將在一到兩個工作天內與您聯絡報酬事宜。',
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

const sendResearchExtendNotice = async (id, extendDays) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '您的實驗到目前已滿十四天，，',
    `我們發現您有${extendDays}天沒有填到問卷，`,
    `所以主動幫您把研究給延長了${extendDays}日，`,
    '數量穩定的問卷填寫對此研究是非常重要的，',
    '在接下來的幾日內希望您能盡量填寫問卷，',
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-實驗延長通知',
    html
  }
  return transporter.sendMail(config)
}

const sendApkLink = async (id, apkFileLink) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
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

const sendReceiptMailInfo = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '感謝您選擇了交付領據與支付報酬的方法，',
    '請盡量在一周內交付領據以利後續流程，',
    `<a href="https://notiaboutness.muilab.org/participant/compensation/mailinfo?id=${id}">此網站</a>提供了必要的交付細節，`,
    '請在交付後點擊網站上的『通知團隊領據已經送出』，',
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

const sendReceiptReversedMail = async (id) => {
  const { email, name } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    '我們已經將您的領據與信封寄過去了，',
    `查收後請進入<a href="https://notiaboutness.muilab.org/participant/compensation/mailinfo?id=${id}">此網站</a>進行下一步，`,
    '並在送出文件後點擊網站上的上的『通知團隊領據已經送出』。',
    '請盡量在一周內送出文件，',
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-領據回郵已寄出',
    html
  }
  return transporter.sendMail(config)
}

const sendWeekReminder = async (id, totalEsmCount) => {
  const { email, name, researchStartDate } = await fetchEmailInfo(id, 'participant')
  const html = mailTemplate([
    `${name}先生/小姐您好，`,
    `您的實驗從${researchStartDate}到今天剛好一週了，`,
    `目前您總共填了${totalEsmCount}則問卷，`,
    '我們感謝您提供的每一筆資料。',
    '請盡量每日持續填寫問卷，',
    '數量穩定且多的問卷對此研究會有很大的貢獻，',
    '如果有幾天因故無法填寫問卷，',
    '研究團隊會再就實驗延長的事情與您聯繫。',
    '如果想知道您已完成的每日表單數量，',
    `請進入<a href="https://notiaboutness.muilab.org/participant/score?id=${id}">此網站</a>查詢，`,
    '感激不盡！'
  ])
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗-首週進度提醒',
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
  sendResearchExtendNotice,
  sendResearchStartMail,
  sendConsentMailInfo,
  sendApkLink,
  sendReceiptMailInfo,
  sendReceiptReversedMail,
  sendWeekReminder,
  sendFitstEsmReminderMail
}
