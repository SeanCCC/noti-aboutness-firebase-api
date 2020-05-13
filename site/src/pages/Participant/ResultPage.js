import React from 'react'
import { Header, Message, Dimmer, Loader } from 'semantic-ui-react'
import { ContactComp } from '../Contact'
import PropTypes from 'prop-types'
// import queryString from 'query-string'
// import { useLocation } from 'react-router-dom'

export function WaitPage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>實驗團隊將在收到您的同意書後，主動與您聯繫。請密切關注郵箱或垃圾信箱。</Message.Header>
      </Message>
    </div>
  )
}

export function ReadyPage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>您已完成了所有流程，實驗將於明天開始。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}

export function RunningPage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>實驗正在進行中。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}

export function CompletePage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>您的實驗任務已經完成，團隊將在近期與您聯絡報酬事宜。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}

export function WaitForPayPage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>實驗室將在收到領據後，儘快以您指定的方法付款給您。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}

export function ErrorPage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message negative>
        <Message.Header>目前頁面出現了某些問題，研究團隊將儘速著手處理。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}
export function UnauthPage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>網址錯誤</Header>
      <Message negative>
        <Message.Header>此網址錯誤，請確認網址是否與信件內容一致，如已確認，請聯絡研究團隊。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}

export function LoadingPage ({ text }) {
  return (
    <div className="page">
      <Dimmer active
        inverted>
        <Loader inverted>{text}</Loader>
      </Dimmer>
    </div>
  )
}

LoadingPage.propTypes = {
  text: PropTypes.string
}
