import React, { Component } from 'react'
import { Header, Embed, Segment, Button, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../Contact'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

export default class PickDate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirm: false,
      submitted: false
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.setState({ submitted: true })
  }

  render () {
    const { confirm, submitted } = this.state
    return (
      <div className="page">
        <Header as='h2' textAlign="center">選擇實驗開始日期</Header>
        <Segment attached>
          您可以選擇
        </Segment>
        <Segment attached>
          <Embed
            id='O6Xo21L0ybE'
            // placeholder='/images/image-16by9.png'
            source='youtube'
          />
        </Segment>
        {submitted && !confirm ? <Segment attached>
          <Message negative>
            <Message.Header>App驗證未通過，請確認已完成教學中驗證步驟，如已確認，請聯絡研究團隊。</Message.Header>
          </Message>
        </Segment> : null}
        <Segment attached>
          <Button fluid primary onClick={this.onSubmit} >選擇研究開始日期</Button>
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

PickDate.propTypes = {
  location: PropTypes.object
}
