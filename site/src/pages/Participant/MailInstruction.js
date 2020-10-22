import React, { Fragment } from 'react'
import { Header, Segment, Image } from 'semantic-ui-react'
import LabMap from './LabMap'

const MailInstruction = () => {
  return <Fragment>
    <Segment attached>
      <Header as='h3'
        textAlign="center">文書寄出資訊</Header>
        您需要將同意書郵寄至實驗室，盡量採用掛號的方法。<br/>
        實測4張紙與一個信封不超過50克，限時郵件郵票可貼23元。<br/>
        收件人：張忠喬 先生<br/>
        聯絡電話：0975-068-858<br/>
        地址：30010新竹市東區大學路1001號交通大學電子與資訊研究中心715室<br/>
    </Segment>
    <Segment attached>
      <Header as='h3'
        textAlign="center">回郵資訊</Header>
        我們會將已經填好地址並貼好郵票的的信封與未簽名的同意書都寄送給您，<br/>
        您只需要完全理解並同意知情同意書內容後，<br/>
        在知情同意書上依照上方『』
    </Segment>
    <Segment attached>
      <Header as='h3'
        textAlign="center">同意書親自交付資訊</Header>
        請直接將同意書投入郵箱即可<br/>
        郵箱位址：新竹市東區大學路1001號交通大學電子與資訊研究中心二樓33號信箱<br/>
        門禁時間：防疫期間下午四點後需要刷卡進出，非防疫期間晚上七點後需要刷卡進出
      <Header as='h4'
        textAlign="center">實驗室地圖</Header>
      <LabMap/>
      <Header as='h4'
        textAlign="center">郵箱位置圖</Header>
      <Image fluid
        src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/2FMap.jpg"/>
      <Image fluid
        src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/boxes.jpg"/>
      <Image fluid
        src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/box.jpg"/>
    </Segment>
  </Fragment>
}

export default MailInstruction
