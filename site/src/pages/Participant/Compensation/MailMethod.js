import React, { Component } from 'react'
import { Header, Segment, Checkbox, Button, Message, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../../Contact'
import LabMap from '../LabMap'

export default class MailMethod extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mailMethod: null,
      submitted: false
    }
    this.onNextStep = this.onNextStep.bind(this)
    this.setMailMethod = this.setMailMethod.bind(this)
  }

  onNextStep () {
    const { nextStep } = this.props
    const { mailMethod } = this.state
    this.setState({ submitted: true })
    if (mailMethod === null) return
    nextStep({ mailMethod })
  }

  setMailMethod (value) {
    this.setState({ mailMethod: value })
  }

  render () {
    const { submitted, mailMethod } = this.state

    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">領取報酬</Header>
        <Segment attached>
          <Header as='h3'
            textAlign="center">說明</Header>
        1.實驗團隊將在收到領據之後的一週內支付報酬給您。<br/>
        2.請印出並且簽署我們在信中附上的領據，然後交付至實驗室信箱或郵寄到實驗室，實驗室的位置在下方有詳細說明。<br/>
        3.如果選擇郵寄，請盡可能以掛號方式寄出，這可以確保信件一定會到達，以避免您不必要的困擾。<br/>
        4.選擇郵寄時，如果因故無法使用掛號，請使用限時平信。<br/>
        5.所有影印、郵務方面支出，均已經包含在報酬中。<br/>
        6.請在選取交件方式點選『選擇收款途徑』（在下方）<br/>
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">領據寄出資訊</Header>
        您需要將領據郵寄至實驗室，盡量採用掛號的方法。<br/>
        實測4張紙與一個信封不超過50克，限時郵件郵票可貼23元。<br/>
        收件人：張忠喬 先生<br/>
        聯絡電話：0975-068-858<br/>
        地址：新竹市東區大學路1001號交通大學電子與資訊研究中心715室<br/>
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">領據親自交付資訊</Header>
        請直接將領據投入郵箱即可<br/>
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
        <Segment attached>
          <Header as='h3'
            textAlign="center">交件方式選擇</Header>
          <Checkbox
            label='領據由本人交付至實驗室信箱。'
            onChange={() => { this.setMailMethod('selfDeliver') }}
            checked={mailMethod === 'selfDeliver'}
          />
          <Checkbox
            label='領據以掛號方式寄出。'
            onChange={() => { this.setMailMethod('registeredMail') }}
            checked={mailMethod === 'registeredMail'}
          />
          <Checkbox
            label='領據以限時平信方式寄出。'
            onChange={() => { this.setMailMethod('ordinaryMail') }}
            checked={mailMethod === 'ordinaryMail'}
          />
          {submitted && mailMethod === null
            ? <Message negative>
              <Message.Header>請選擇交件方式</Message.Header>
            </Message>
            : null}
        </Segment>
        <Segment attached>
          <Button fluid
            primary
            onClick={this.onNextStep} >選擇收款途徑</Button>
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

MailMethod.propTypes = {
  id: PropTypes.string,
  nextStep: PropTypes.func
}
