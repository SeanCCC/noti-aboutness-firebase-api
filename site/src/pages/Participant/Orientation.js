import React, { Component } from 'react'
import { Header, Embed, Segment, Checkbox, Button, Icon, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { ContactComp } from '../Contact'

export const consentFileLink = 'https://firebasestorage.googleapis.com/v0/b/noti-aboutness-firebase-48728.appspot.com/o/4.%E5%8F%83%E8%88%87%E8%80%85%E7%A0%94%E7%A9%B6%E8%AA%AA%E6%98%8E%E6%9B%B8201021.pdf?alt=media&token=1282c65b-3893-4c0e-b64b-c2c68bda253f'

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
        <Header as='h2'
          textAlign="center">實驗說明影片</Header>
        <Segment attached>
          我們將在這個影片中詳細說明實驗內容、實驗流程與參與者研究說明書的所有內容，如果有任何不解，歡迎聯絡實驗團隊（頁底有聯絡資訊）。請務必看完這個影片並詳讀參與者研究說明書以了解實驗參與者的權利與義務。看完後請勾選下方勾選框。
          <Message warning>
            <Message.Header>請完整了解知情同意書內容，以保護您的權益。</Message.Header>
          </Message>
          <a target="_blank"
            href={consentFileLink}
            rel='noreferrer noopener'>
            <Button fluid
              primary >
              <Icon name='file pdf'/>
            下載『參與者研究說明書』
            </Button>
          </a>
        </Segment>
        <Segment attached>
          <Embed
            id='6AaJiaciJCI'
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
          <Button fluid
            primary
            onClick={this.onSubmit}
            loading={loading}
            disabled={loading} >下一步</Button>
        </Segment>
        <ContactComp/>
      </div>
    )
  }
}

Orientation.propTypes = {
  nextStep: PropTypes.func
}
