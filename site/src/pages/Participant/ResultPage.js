import React from 'react'
import { Header, Message, Segment } from 'semantic-ui-react'
import { ContactComp } from '../Contact'
// import queryString from 'query-string'
// import { useLocation } from 'react-router-dom'

export function WaitPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>實驗團隊將在收到您的同意書後，主動與您聯繫。請密切關注郵箱或垃圾信箱。</Message.Header>
      </Message>
    </div>
  )
}

export function ErrorPage () {
  return (
    <div className="page">
      <Header textAlign="center" as='h2'>感謝您的合作</Header>
      <Message negative>
        <Message.Header>目前頁面出現了某些問題，研究團隊將儘速著手處理。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}
