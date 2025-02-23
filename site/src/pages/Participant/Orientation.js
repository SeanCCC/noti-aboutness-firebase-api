import React, { Component } from 'react'
import { Header, Embed, Segment, Checkbox, Button, Icon, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../Contact'

const consentFileLink = 'https://www.youtube.com/'

export default class Orientation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirm: false,
      submitted: false,
      loading: false
    }
    this.toggle = this.toggle.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  toggle () {
    const { confirm } = this.state
    this.setState({ confirm: !confirm })
  }

  async onSubmit () {
    const { nextStep } = this.props
    const { confirm } = this.state
    this.setState({ submitted: true })
    if (!confirm) return
    this.setState({ loading: true })
    await nextStep()
    this.setState({ loading: false })
  }

  render () {
    const { confirm, submitted, loading } = this.state
    return (
      <div className="page">
        <Header as='h2' textAlign="center">實驗說明影片</Header>
        <Segment attached>
          我們將在這個影片中詳細說明實驗內容、實驗流程與參與者研究說明書的所有內容，如果有任何不解，歡迎聯絡實驗團隊（頁底有聯絡資訊）。請務必看完這個影片並詳讀參與者研究說明書以了解實驗參與者的權利與義務。看完後請勾選下方勾選框。
          <a target="_blank" href={consentFileLink} rel='noreferrer noopener'>
            <Button fluid primary >
              <Icon name='file pdf'/>
            下載參與者研究說明書
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
        <Segment attached>
          <Checkbox
            label='本人已完整觀看研究介紹影片並且已詳細瞭解上述研究計畫中研究方法、目的與程序，及所可能產生的危險與利益，有關本
            研究計畫的疑問，亦獲得詳細解答。'
            onChange={this.toggle}
            checked={confirm}
          />
        </Segment>
        {submitted && !confirm ? <Segment attached>
          <Message negative>
            <Message.Header>請在完成勾選框內容後，勾選勾選框。</Message.Header>
          </Message>
        </Segment> : null}
        <Segment attached>
          <Button fluid primary onClick={this.onSubmit} loading={loading} >下一步</Button>
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

Orientation.propTypes = {
  nextStep: PropTypes.func
}
