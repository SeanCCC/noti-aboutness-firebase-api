import React from 'react'
import { Header, Message } from 'semantic-ui-react'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import { ContactComp } from '../Contact'

export function AcceptPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您費時填寫表單</Header>
      <Message positive>
        <Message.Header>您已經完成表單，研究團隊會在數日內透過您填入的電子信箱聯絡您，請密切關注。</Message.Header>
      </Message>
    </div>
  )
}

export function EmailCheckPage () {
  const { email } = queryString.parse(useLocation().search)
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您費時填寫表單</Header>
      <Message positive>
        <Message.Header>您已經完成表單，研究團隊已經寄了一封信箱驗證信至{email}，請您點擊內附的連結。如果沒有找到該信，請檢視垃圾信箱。</Message.Header>
      </Message>
    </div>
  )
}

export function ReturnPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您費時填寫表單</Header>
      <Message negative>
        <Message.Header>由於研究團隊的程式需要安裝在Android手機上，研究團隊無法就您納入參與者，您填寫的資料將不會以任何形式保存。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}

export function ErrorPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您費時填寫表單</Header>
      <Message negative>
        <Message.Header>目前頁面出現了某些問題，研究團隊將儘速著手處理。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}

export function RepeatPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您費時填寫表單</Header>
      <Message negative>
        <Message.Header>您過去已通過信箱驗證或已被納入參與者，表單內容將以過去填寫的為準，如果需要進行修改，請聯絡研究團隊。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}
