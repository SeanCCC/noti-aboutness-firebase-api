import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

export default class AllDoneCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      acceptingConsent: false,
      sendingReminder: false
    }
    this.sendAcceptMail = this.sendAcceptMail.bind(this)
    this.sendReminder = this.sendReminder.bind(this)
  }

  async sendAcceptMail () {
    const { participant, acceptConsent } = this.props
    this.setState({ acceptingConsent: true })
    await acceptConsent(participant.uid)
    this.setState({ acceptingConsent: false })
  }

  async sendReminder () {
    const { sendReminderMail, participant } = this.props
    this.setState({ sendingReminder: true })
    await sendReminderMail(participant.uid)
    this.setState({ sendingReminder: false })
  }

  render () {
    const { participant: p } = this.props
    return (
      <Fragment>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {p.lastStatusChanged}
        </Table.Cell>
      </Fragment>)
  }
}

AllDoneCell.propTypes = {
  acceptConsent: PropTypes.func,
  sendReminderMail: PropTypes.func,
  participant: PropTypes.object
}
