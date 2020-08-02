import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'semantic-ui-react'
import { mailMethodOptions } from '../../formOptions'
import moment from 'moment-timezone'

const translate = (options, value, defaultValue) => {
  if (defaultValue !== undefined && value === undefined) return defaultValue
  return options.find(opt => opt.value === value).text
}

export default class PayorInviteCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      askingPayment: false,
      invitingInterview: false
    }
    this.askAboutPayment = this.askAboutPayment.bind(this)
    this.inviteInterview = this.inviteInterview.bind(this)
  }

  async askAboutPayment () {
    const { participant, askAboutPayment } = this.props
    this.setState({ askingPayment: true })
    await askAboutPayment(participant.uid)
    this.setState({ askingPayment: false })
  }

  async inviteInterview () {
    const { inviteInterview, participant } = this.props
    this.setState({ invitingInterview: true })
    await inviteInterview(participant.uid)
    this.setState({ invitingInterview: false })
  }

  render () {
    const { participant: p } = this.props
    const { askingPayment, invitingInterview } = this.state
    const mailMethod = translate(mailMethodOptions, p.mailMethod, '未送出')
    const consentSentTime = !p.consentSentTime ? '未送出' : moment(new Date(p.consentSentTime)).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
    return (
      <Table.Row>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {mailMethod}
        </Table.Cell>
        <Table.Cell>
          {consentSentTime}
        </Table.Cell>
        <Table.Cell>
          <Modal
            size="mini"
            trigger={<Button content="進入付款程序" loading={askingPayment} disabled={askingPayment} primary />}
            header='確認進入付款程序?'
            content='真的不訪談這個人?'
            actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.askAboutPayment }]}
          />

          <Modal
            size="mini"
            trigger={<Button content="寄出訪談邀請" loading={invitingInterview} disabled={invitingInterview} primary />}
            header='是否邀請訪談'
            content='無'
            actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.inviteInterview }]}
          />
        </Table.Cell>
      </Table.Row>)
  }
}

PayorInviteCell.propTypes = {
  askAboutPayment: PropTypes.func,
  inviteInterview: PropTypes.func,
  participant: PropTypes.object
}
