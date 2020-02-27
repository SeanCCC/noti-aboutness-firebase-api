const nodemailer = require('nodemailer')

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

const sendEmailCheck = async (email, name, gender, id) => {
  const config = {
    from: 'MUILAB通知實驗研究團隊',
    to: email,
    subject: 'MUILAB通知實驗信箱驗證信',
    html: `<p>${name}${gender === 'male' ? '先生' : '小姐'}您好，感謝您費時填寫招募問卷，請點擊連結以完成信箱驗證：<a href="https://notiaboutness.muilab.org/form/mailcheck?id=${id}">驗證連結</a></p>`
  }
  await transporter.sendMail(config)
}

module.exports = { sendEmailCheck }
