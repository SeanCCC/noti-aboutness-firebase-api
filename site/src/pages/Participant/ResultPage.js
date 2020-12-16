import React from 'react'
import { Header, Message, Dimmer, Loader, Segment } from 'semantic-ui-react'
import { ContactComp } from '../Contact'
import PropTypes from 'prop-types'
import LabMap from './LabMap'

export function WaitPage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>實驗團隊將在收到您的同意書後，在一到兩個工作天內與您聯繫。請密切關注郵箱或垃圾信箱。</Message.Header>
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
        <Message.Header>您的實驗任務已經完成，團隊將在一到兩個工作天內與您聯絡報酬事宜。</Message.Header>
      </Message>
      <ContactComp/>
    </div>
  )
}

export function MailBackPage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>您的實驗任務已經完成，團隊將在一到兩個工作天內與您聯絡報酬事宜。</Message.Header>
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
        <Message.Header>實驗室將在收到領據後，會在七日內以您指定的方法付款給您。</Message.Header>
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

export function InterviewAcceptPage () {
  return <div className="page">
    <Header textAlign="center"
      as='h2'>感謝您接受邀請</Header>
    <Message positive>
      <Message.Header>您已接受訪談邀約，研究團隊將在一到兩個工作天內與您聯繫。</Message.Header>
    </Message>
    <Segment attached>
      <Header as='h3'
        textAlign="center">實驗室位置</Header>
        地址：新竹市東區大學路1001號交通大學電子與資訊研究中心715室<br/>
      <LabMap/>
    </Segment >
    <ContactComp/>
  </div>
}

export function InterviewSchedulePage ({ scheduleTime }) {
  return <div className="page">
    <Header textAlign="center"
      as='h2'>感謝您接受邀請</Header>
    <Message positive>
      <Message.Header>您的訪談時間在{scheduleTime}，若須更改時間請提早聯絡研究團隊。</Message.Header>
    </Message>
    <Segment attached>
      <Header as='h3'
        textAlign="center">實驗室位置</Header>
        地址：新竹市東區大學路1001號交通大學電子與資訊研究中心715室<br/>
      <LabMap/>
    </Segment >
    <ContactComp/>
  </div>
}

InterviewSchedulePage.propTypes = {
  scheduleTime: PropTypes.string
}

export function ResearchDonePage () {
  return <div className="page">
    <Header textAlign="center"
      as='h2'>感謝您的參與</Header>
    <Message positive>
      <Message.Header>您的所有研究流程已經完成，感謝您的參與，未來研究若有繼續招人，也希望您能推薦給朋友。</Message.Header>
    </Message>
    <ContactComp/>
  </div>
}

export function ReserveWaitMessage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>請等待我們寄出回郵信封</Header>
      <Message positive>
        <Message.Header>研究團隊將在一到兩個工作日內寄出回郵信件，寄出後將會通知您並提供必要的資訊。</Message.Header>
      </Message>
    </div>
  )
}
