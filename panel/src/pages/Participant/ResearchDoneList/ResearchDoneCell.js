import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

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
      <Fragment>
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
      </Fragment>)
  }
}

ResearchPendingCell.propTypes = {
  sendReminderMail: PropTypes.func,
  participant: PropTypes.object
}
