import React, { Component } from 'react'
import { Header, Segment, Checkbox, Button, Icon, Message, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../Contact'
import LabMap from './LabMap'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

const consentFileLink = 'https://www.youtube.com/'

export default class MailInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mailMethod: null,
      submitted: false,
      loading: false
    }
    this.toggle = this.toggle.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  toggle (value) {
    this.setState({ mailMethod: value })
  }

  async onSubmit () {
    this.setState({ submitted: true })
    const { mailMethod } = this.state
    const { nextStep } = this.props
    if (mailMethod === null) return
    this.setState({ loading: true })
    await nextStep({ mailMethod })
    this.setState({ loading: false })
  }

  render () {
    const { mailMethod, submitted, loading } = this.state
    return (
      <div className="page">
        <Header as='h2' textAlign="center">簽署與寄出同意書</Header>
        <Segment attached>
          <Header as='h3' textAlign="center">說明</Header>
        1.請印出並且簽署研究者參與同意書，然後交付至實驗室或寄到實驗室，實驗室的位置在下方有詳細說明。<br/>
        2.請盡可能以掛號方式寄出，這可以確保信件一定會到達，以避免您不必要的困擾。<br/>
        3.所有影印、郵務方面支出，均已經包含在報酬中。<br/>
        4.請在選取交件方式後點選『我已寄出或交付同意書』（在最下方）
          <a target="_blank" href={consentFileLink} rel='noreferrer noopener'>
            <Button fluid primary>
              <Icon name='file pdf'/>
            下載參與者研究說明書
            </Button>
          </a>
        </Segment>
        <Segment attached>
          <Header as='h3' textAlign="center">同意書寄出資訊</Header>
        收件人：張忠喬 先生<br/>
        聯絡電話：0975-068-858<br/>
        地址：新竹市東區大學路1001號交通大學電子與資訊研究中心715室<br/>
        </Segment>
        <Segment attached>
          <Header as='h3' textAlign="center">同意書交付資訊</Header>
        請直接將同意書投入郵箱即可<br/>
        郵箱位址：新竹市東區大學路1001號交通大學電子與資訊研究中心二樓33號信箱<br/>
        門禁時間：防疫期間下午四點後需要刷卡進出，非防疫期間晚上七點後需要刷卡進出
          <Header as='h4' textAlign="center">實驗室地圖</Header>
          <LabMap/>
          <Header as='h4' textAlign="center">郵箱位置圖</Header>

          <Image fluid src="https://firebasestorage.googleapis.com/v0/b/noti-aboutness-firebase-48728.appspot.com/o/2FMap.jpg?alt=media&token=8f04c53c-8db0-4ad8-abd4-7329ac1c9fd8"/>
          <Image fluid src="https://firebasestorage.googleapis.com/v0/b/noti-aboutness-firebase-48728.appspot.com/o/boxes.jpg?alt=media&token=7a5a80f8-07ca-48c0-b1a8-cdc63720cbe1"/>
          <Image fluid src="https://firebasestorage.googleapis.com/v0/b/noti-aboutness-firebase-48728.appspot.com/o/box.jpg?alt=media&token=eb324a29-6b78-46dc-8a5e-9f2023a64a1d"/>

        </Segment>
        <Segment attached>
          <Header as='h3' textAlign="center">交件方式選擇</Header>
          <Checkbox
            label='同意書已經由本人交付至實驗室。'
            onChange={() => { this.toggle('selfDeliver') }}
            checked={mailMethod === 'selfDeliver'}
          />
          <Checkbox
            label='同意書已經以掛號方式寄出。'
            onChange={() => { this.toggle('registeredMail') }}
            checked={mailMethod === 'registeredMail'}
          />
          <Checkbox
            label='同意書已經以平信方式寄出。'
            onChange={() => { this.toggle('ordinaryMail') }}
            checked={mailMethod === 'ordinaryMail'}
          />
        </Segment>
        {submitted && mailMethod === null ? <Segment attached>
          <Message negative>
            <Message.Header>請選擇郵寄或交付方式</Message.Header>
          </Message>
        </Segment> : null}
        <Segment attached>
          <Button fluid primary onClick={this.onSubmit} loading={loading} >我已寄出或交付同意書</Button>
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

MailInfo.propTypes = {
  nextStep: PropTypes.func
}
