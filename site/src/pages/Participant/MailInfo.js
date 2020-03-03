import React, { Component } from 'react'
import { Header, Segment, Checkbox, Button, Icon, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../Contact'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

const consentFileLink = 'https://www.youtube.com/'

export default class MailInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mailMethod: null,
      submitted: false
    }
    this.toggle = this.toggle.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  toggle (value) {
    this.setState({ mailMethod: value })
  }

  onSubmit () {
    this.setState({ submitted: true })
  }

  render () {
    const { mailMethod, submitted } = this.state
    return (
      <div className="page">
        <Header as='h2' textAlign="center">簽署與寄出同意書</Header>
        <Segment attached>
        1.請印出並且簽署研究者參與同意書，然後交付至實驗室或寄到實驗室，實驗室的位置在下方有詳細說明。<br/>
        2.請盡可能以掛號方式寄出，這可以確保信件一定會到達，以避免您不必要的困擾。<br/>
        3.所有影印與郵務方面支出，均已經包含在報酬中。<br/>
        4.請在郵件寄出後點選『我已寄出或交付同意書』
          <a target="_blank" href={consentFileLink} rel='noreferrer noopener'>
            <Button fluid primary>
              <Icon name='file pdf'/>
            下載參與者研究說明書
            </Button>
          </a>
        </Segment>
        <Segment attached>
          <Header as='h3' textAlign="center">同意書交付或寄出資訊</Header>
        收件人：張忠喬 先生<br/>
        聯絡電話：0975-068-858<br/>
        地址：新竹市東區大學路1001號交通大學電子與資訊研究中心715室<br/>
        </Segment>
        <Segment attached>
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
          <Button fluid primary onClick={this.onSubmit} >我已寄出或交付同意書</Button>
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

MailInfo.propTypes = {
  location: PropTypes.object
}
