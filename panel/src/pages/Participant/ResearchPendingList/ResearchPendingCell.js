import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'semantic-ui-react'
import status from '../../status'

export default class ResearchPendingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingReminder: false
    }
    this.sendReminder = this.sendReminder.bind(this)
  }

  async sendReminder () {
    const { sendReminderMail, participant } = this.props
    this.setState({ sendingReminder: true })
    await sendReminderMail(participant.uid)
    this.setState({ sendingReminder: false })
  }

  render () {
    const { sendingReminder } = this.state
    const { participant: p } = this.props
    return (
      <Table.Row>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.BIG_FIVE_DONE ? '是' : '否'}
        </Table.Cell>
        <Table.Cell>
          {p.deviceId !== undefined ? '是' : '否'}
        </Table.Cell>
        <Table.Cell>
          {p.researchStartDate}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.APP_VALID
            ? <Modal
              size="mini"
              trigger={<Button content="確認同意書" loading={sendingReminder} primary />}
              header='確認同意書有效'
              content='資料是否有填寫完整？'
              actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.sendReminder }]}
            />
            : null}
        </Table.Cell>
      </Table.Row>)
  }
}

ResearchPendingCell.propTypes = {
  sendReminderMail: PropTypes.func,
  participant: PropTypes.object
}
