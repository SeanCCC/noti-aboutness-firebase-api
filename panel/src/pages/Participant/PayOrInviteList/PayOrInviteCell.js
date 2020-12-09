import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'semantic-ui-react'

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
    const { participant: p, record } = this.props
    const { askingPayment, invitingInterview } = this.state
    const { totalEsmCount } = record
    const { researchEndDate } = p
    return (
      <Fragment>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {totalEsmCount || 0}
        </Table.Cell>
        <Table.Cell>
          {researchEndDate || 'N/A'}
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
      </Fragment>)
  }
}

PayorInviteCell.propTypes = {
  askAboutPayment: PropTypes.func,
  inviteInterview: PropTypes.func,
  participant: PropTypes.object,
  record: PropTypes.object
}
