import React, { Component } from 'react'
import { Header, Embed, Segment, Button, Icon } from 'semantic-ui-react'
import { ContactComp } from '../Contact'
import QRCode from 'qrcode.react'

const apkFileLink = 'https://www.youtube.com/'

export default class Instruction extends Component {
  render () {
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">App安裝教學與驗證</Header>
        <Segment attached>
          1.請依照下方影片教學安裝App與進行App功能驗證，如果有任何不順利的地方，歡迎與研究團隊聯絡，或來訪實驗室，由實驗團隊代勞。<br/>
          2.實驗將在驗證完成後的一天開始進行
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
          <Embed
            id='O6Xo21L0ybE'
            // placeholder='/images/image-16by9.png'
            source='youtube'
          />
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}
