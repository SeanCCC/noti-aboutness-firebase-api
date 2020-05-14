import React, { Component } from 'react'
import { Header, Segment, Checkbox, Button, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../Contact'
import LabMap from './LabMap'

export default class Interview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rsvp: null,
      submitted: false,
      loading: false
    }
    this.toggle = this.toggle.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  toggle (value) {
    this.setState({ rsvp: value })
  }

  async onSubmit () {
    this.setState({ submitted: true })
    const { rsvp } = this.state
    const { nextStep } = this.props
    if (rsvp === null) return
    this.setState({ loading: true })
    await nextStep({ rsvp })
    this.setState({ loading: false })
  }

  render () {
    const { rsvp, submitted, loading } = this.state
    return (
      <div className="page">
        <Header as='h2'
          textAlign="center">訪談邀請書</Header>
        <Segment attached>
          <Header as='h3'
            textAlign="center">說明</Header>
        您好，在檢視您提供的研究資料後，我們想更了解關於資料的細節，因此希望邀請您到實驗室進行訪談。
        訪談耗時不超過一小時，在訪談中我們會詢問您在研究過程中的狀況，與填寫表單的細節等等......
        為了彌補帶給您的麻煩，我們會在訪談後，連同報酬額外給您300元新台幣的費用。<br/>
        在您決定好了之後，請到本頁最下方選擇是否願意接受訪談，並且送出回覆。
        如果您願意，我們會在回覆後近期聯絡您。
        </Segment>
        <Segment attached
          className="align-horizental">
          <Header as='h3'
            textAlign="center">請問您是否願意接受訪談？</Header>
          <Checkbox
            className="short-padded"
            label='我願意接受訪談'
            onChange={() => { this.toggle(true) }}
            checked={rsvp === true}
          />
          <Checkbox
            className="short-padded"
            label='我不願意或無法接受訪談'
            onChange={() => { this.toggle(false) }}
            checked={rsvp === false}
          />
          {submitted && rsvp === null
            ? <Message negative>
              <Message.Header>請選擇您的回覆</Message.Header>
            </Message>
            : null}
        </Segment>
        <Segment attached>
          <Button fluid
            primary
            onClick={this.onSubmit}
            loading={loading} >送出回覆</Button>
        </Segment>
        <Segment attached>
          <Header as='h3'
            textAlign="center">實驗室位置</Header>
        地址：新竹市東區大學路1001號交通大學電子與資訊研究中心715室<br/>
          <LabMap/>
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

Interview.propTypes = {
  nextStep: PropTypes.func,
  status: PropTypes.string
}
