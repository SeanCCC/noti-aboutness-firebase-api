import React, { Component } from 'react'
import { Header, Embed, Segment, Button, Icon, Message } from 'semantic-ui-react'
import { ContactComp } from '../Contact'
import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom'
// import axios from 'axios'

const consentFileLink = 'https://www.youtube.com/'

export default class Instruction extends Component {
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
        <Header as='h2' textAlign="center">App安裝教學與驗證</Header>
        <Segment attached>
          請依照下方影片教學安裝App與進行App功能驗證，如果有任何不順利的地方，歡迎與研究團隊聯絡，或來訪實驗室，由實驗團隊代勞。
          <a target="_blank" href={consentFileLink} rel='noreferrer noopener'>
            <Button fluid primary >
              <Icon name='file pdf'/>
            下載實驗用App
            </Button>
          </a>
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

Instruction.propTypes = {
  location: PropTypes.object
}
