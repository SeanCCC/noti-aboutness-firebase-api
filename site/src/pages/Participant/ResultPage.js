import React from 'react'
import { Header, Message, Dimmer, Loader, Segment, Embed, Button, Icon } from 'semantic-ui-react'
import { ContactComp } from '../Contact'
import PropTypes from 'prop-types'
import { mobileOpitons } from '../Recruit/formOptions'
import QRCode from 'qrcode.react'
import { internalApkLink, batteryLinkTable, esmTutorial, installYoutubeId } from './constants'

export function WaitPage () {
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>實驗團隊將在收到您的同意書後，在一到兩個工作天內與您聯繫。請密切關注郵箱或垃圾信箱。</Message.Header>
      </Message>
      <Segment attached>
        <Header as='h3'
          textAlign="center">收件資訊</Header>
        收件人：張忠喬 先生<br/>
        收件人手機：0975-068-858<br/>
        收件地址：30010 新竹市東區大學路1001號國立陽明交通大學電子與資訊研究中心715室<br/>
      </Segment >
    </div>
  )
}

const ReadyPage = ({ phoneBrand }) => {
  const brand = mobileOpitons.find(o => o.value === phoneBrand)
  const brandName = !brand ? null : brand.text
  return (
    <div className="page">
      <Header textAlign="center"
        as='h2'>感謝您的合作</Header>
      <Message positive>
        <Message.Header>您已完成了所有流程，實驗將於明天開始。如果您需要回顧安裝與設定的資訊，下方有提供。</Message.Header>
      </Message>
      <Segment attached>
        <Header as='h3'
          textAlign="center">App安裝與使用教學影片</Header>
        <Embed
          id={installYoutubeId}
          hd
          source='youtube'
          iframe={{
            allowFullScreen: true
          }}
        />
      </Segment>
      <Segment attached>
        <a target="_blank"
          href={internalApkLink}
          rel='noreferrer noopener'>
          <Button fluid
            primary
            className="short-padded">
            <Icon name='file pdf'/>
            下載實驗用App
          </Button>
        </a>
        <div className='align-center short-padded'>
              實驗App下載用QRCode
          <QRCode value={internalApkLink} />
        </div>
      </Segment>
      <Segment attached>
        <Header as='h3'
          textAlign="center">關閉Facebook聊天大頭貼功能</Header>
          1. 前往 Messenger，點按左上方的大頭貼照。
          2. 向下捲動並點按聊天大頭貼。
          3. 切換按鍵以關閉。
      </Segment>
      {!brandName || !batteryLinkTable[phoneBrand] ? (
        <Segment attached>
          <Header as='h3'
            textAlign="center">關於電量設定</Header>
            如果有開啟低電量模式，請於研究期間關閉<br/>
        </Segment>
      ) : (<Segment attached>
        <Header as='h3'
          textAlign="center">{brandName}的電量設定</Header>
            請關閉低電量設定，並查看下方文件，依照教學進行設定。<br/>
        <a target="_blank"
          href={batteryLinkTable[phoneBrand]}
          rel='noreferrer noopener'>
          <Button
            fluid
            primary >
            <Icon name='linkify'/>
          如何進行電量設定
          </Button>
        </a>
      </Segment>)}
      <Segment attached>
        <Header as='h3'
          textAlign="center">問卷相關補充說明</Header>
        <a target="_blank"
          href={esmTutorial}
          rel='noreferrer noopener'>
          <Button
            fluid
            primary >
            <Icon name='linkify'/>
          查看補充說明
          </Button>
        </a>
      </Segment>
      <Header textAlign="center"
        as='h3'>遇到困難請聯絡『研究計畫聯絡人』</Header>
      <ContactComp/>
    </div>
  )
}

ReadyPage.propTypes = {
  phoneBrand: PropTypes.array
}

export { ReadyPage }

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

export function ResearchDonePage () {
  return <div className="page">
    <Header textAlign="center"
      as='h2'>感謝您的參與</Header>
    <Message positive>
      <Message.Header>您的所有研究流程已經完成，感謝您的參與，也希望您能將此研究推薦給朋友。</Message.Header>
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
