import React, { Component } from 'react'
import { Header, Embed, Segment, Button, Icon, Message } from 'semantic-ui-react'
import { ContactComp } from '../Contact'
import PropTypes from 'prop-types'
import { mobileOpitons } from '../Recruit/formOptions'
import QRCode from 'qrcode.react'
import { internalApkLink, batteryLinkTable, esmTutorial, installYoutubeId } from './constants'

export default class Instruction extends Component {
  render () {
    const { phoneBrand } = this.props
    const brand = mobileOpitons.find(o => o.value === phoneBrand)
    const brandName = !brand ? null : brand.text
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">App安裝教學與使用</Header>
        <Segment attached>
          1.請依照下方影片教學安裝App與使用App，如果有任何不順利的地方，歡迎與研究團隊聯絡，或來訪實驗室，由實驗團隊代勞。<br/>
          2.如果您用手機瀏覽此頁面，可以點擊影片下方的『下載實驗用App』下載App。如果不是，我們也提供了QRCode並已經寄送檔案連結給您。<br/>
          3.實驗將在App設定好後的一天開始進行。
          <Message warning>
            <Message.Header>請完整了解研究流程，這會影響研究參與成功與否。此外，我們也已將安裝檔連結透過Email寄給了您。</Message.Header>
          </Message>
        </Segment>
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
}

Instruction.propTypes = {
  phoneBrand: PropTypes.array
}
