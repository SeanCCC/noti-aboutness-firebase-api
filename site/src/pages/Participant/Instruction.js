import React, { Component } from 'react'
import { Header, Embed, Segment, Button, Icon, Message } from 'semantic-ui-react'
import { ContactComp } from '../Contact'
import QRCode from 'qrcode.react'

const apkFileLink = 'https://firebasestorage.googleapis.com/v0/b/noti-aboutness-firebase-48728.appspot.com/o/app-debug-2.0.8-B.apk?alt=media&token=10744971-2d53-4d0f-a9b0-230ad95dd365'

export default class Instruction extends Component {
  render () {
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">App安裝教學與使用</Header>
        <Segment attached>
          1.請依照下方影片教學安裝App與使用App，如果有任何不順利的地方，歡迎與研究團隊聯絡，或來訪實驗室，由實驗團隊代勞。<br/>
          2.如果您用手機瀏覽此頁面，可以點擊下方的『下載實驗用App』下載App。如果不是，我們也提供了QRCode並已經寄送檔案連結給您。<br/>
          3.實驗將在驗證完成後的一天開始進行。
          <Message warning>
            <Message.Header>請完整了解研究流程，這會影響研究參與成功與否。此外，我們也已將安裝檔連結透過Email寄給了您。</Message.Header>
          </Message>
          <a target="_blank"
            href={apkFileLink}
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
            <QRCode value={apkFileLink} />
          </div>
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">App安裝與使用教學影片</Header>
          <Embed
            id='L-9JJwih-Ck'
            hd
            source='youtube'
            iframe={{
              allowFullScreen: true
            }}
          />
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">關閉Facebook聊天大頭貼功能</Header>
          1. 前往 Messenger，點按左上方的大頭貼照。
          2. 向下捲動並點按聊天大頭貼。
          3. 切換按鍵以關閉。
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">進行電量相關設定</Header>
          TBD
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}
