import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'semantic-ui-react'
import status from '../../status'

export default class ResearchPendingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // sendingReminder: false
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
    // const { sendingReminder } = this.state
    const { participant: p } = this.props
    return (
      <Table.Row>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {p.researchEndDate}
        </Table.Cell>
        <Table.Cell>
          {p.lastInterviewInvitation || '尚未邀約'}
        </Table.Cell>
        <Table.Cell>
          123
        </Table.Cell>
      </Table.Row>)
  }
}

ResearchPendingCell.propTypes = {
  sendReminderMail: PropTypes.func,
  participant: PropTypes.object
}
